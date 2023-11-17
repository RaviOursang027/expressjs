const axios = require("axios");
const FormData = require("form-data");
const User = require("../models/user");
// const File = require("../models/file")
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const rootBucketDir = "root-bucket";
const sizeLimit = 50 * 1024 * 1024; // 10 MB
const bucketSizeLimit = 500 * 1024 * 1024; // 50 MB
const uuid = require('uuid'); // Import the uuid library
const FavoriteFile = require("../models/files");


const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bucketName = user.email; // const dest = path.join("root-bucket", bucketName);
    const dest = path.join(
      __dirname,
      "..",
      "bucket",
      "root-bucket",
      bucketName
    );

    console.log(dest);

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true }); // <- added recursive option
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// const upload = multer({ storage: storage }).single("file");
const upload = multer({ storage: storage }).array("file", 100); // Allows up to 100 files

exports.upload = upload;

// // Middleware for checking file size before processing
exports.preCheckFileSize = (req, res, next) => {
  //   let totalSize = 0;
  //   // const maxSize = 10 * 1024 * 1024; // 10 MB

  //   req.on("data", (chunk) => {
  //     totalSize += chunk.length;

  //     if (totalSize > sizeLimit) {
  //       res.status(413).json({ message: "File too large" });
  //       req.destroy();
  //     }
  //   });

  //   req.on("end", () => {
  //     next();
  //   });

  const contentLength = req.headers["content-length"];
  if (contentLength > sizeLimit) {
    return res.status(413).json({ message: "File too large" });
  }
  next();
};

// Function to check bucket size with incoming file size
const checkBucketSize = (bucketDir, incomingFileSize) => {
  const files = fs.readdirSync(bucketDir);
  let totalSize = 0;
  files.forEach((file) => {
    const filePath = path.join(bucketDir, file);
    const stats = fs.statSync(filePath);
    totalSize += stats.size;
  });
  console.log(totalSize);
  totalSize += incomingFileSize; // Add incoming file size
  console.log(totalSize + "with incoming file");
  return totalSize >= bucketSizeLimit; // 50 MB
};

function bytesToSize(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  if (bytes === 0) return "0 Byte";

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

exports.preCheckBucketSize = async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const bucketName = user.email;
  const bucketDir = path.join(
    __dirname,
    "..",
    "bucket",
    "root-bucket",
    bucketName
  );

  // If the directory does not exist, no need to check for size.
  if (!fs.existsSync(bucketDir)) {
    return next();
  }

  // Assuming you know the approximate incoming file size
  const approximateIncomingFileSize = Number(req.headers["content-length"]);
  console.log(approximateIncomingFileSize);
  console.log(bucketSizeLimit);

  // Checking just the incoming file size against the limit
  if (approximateIncomingFileSize > bucketSizeLimit) {
    return res.status(413).json({ message: "File too large" });
  }

  // Checking the combined size of existing bucket and incoming file against the limit
  if (checkBucketSize(bucketDir, approximateIncomingFileSize)) {
    return res.status(413).json({ message: "Bucket size limit exceeded" });
  }
  next();
};

exports.uploadFile = async (req, res) => {
  console.log(req.user._id);
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files were uploaded" });
  }
  const bucketName = user.email;
  const bucketDir = path.join(
    __dirname,
    "..",
    "bucket",
    "root-bucket",
    bucketName
  );

  if (!fs.existsSync(bucketDir)) {
    fs.mkdirSync(bucketDir);
  }

  //   if (checkBucketSize(bucketDir, req.file.size)) {
  //     return res.status(413).json({ message: "Bucket size limit exceeded" });
  //   }

  // You could loop here to handle multiple files, if necessary
  const uploadedFiles = req.files.map((file) => {
    return {
      filename: file.filename,
      size: bytesToSize(file.size),
    };
  });

  const currentDate = new Date().toISOString();

  res.json({
    message: "Files uploaded",
    files: uploadedFiles,
    uploadedDate: currentDate,
  });
};
exports.deleteFile = async (req, res) => {
  console.log(req.user._id);
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const bucketName = user.email;

  console.log(bucketName);
  const { fileName } = req.params;
  const url = `http://localhost:8002/delete-file/${bucketName}/${fileName}`;

  try {
    const response = await axios.delete(url);
    res.json(response.data);
  } catch (error) {
    console.error("Failed to delete file:", error);
    res.status(500).json({ message: "Failed to delete file" });
  }
};

exports.deleteMultipleFiles = async (req, res) => {
  console.log(req.user._id);
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const bucketName = user.email;
  console.log(bucketName);

  // Expecting an array of filenames to be deleted in the request body
  const { files } = req.body;

  if (!files || files.length === 0) {
    return res.status(400).send("No files specified for deletion.");
  }

  const url = `http://localhost:8002/delete-files/${bucketName}`;

  try {
    const response = await axios.delete(url, {
      data: { files }, // Sending files array as the request body of the DELETE request
    });
    res.json(response.data);
  } catch (error) {
    console.error("Failed to delete files:", error);
    res.status(500).json({ message: "Failed to delete files" });
  }
};

exports.listAllFiles = async (req, res) => {
  console.log(req.user._id);
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const bucketName = user.email;

  // console.log(bucketName);
  const url = `http://localhost:8002/list-all-files/${bucketName}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Failed to list files:", error);
    res.status(500).json({ message: "Failed to list files" });
  }
};

exports.downloadFile = async (req, res) => {
  console.log(req.user._id);
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const bucketName = user.email;

  console.log(bucketName);
  const { fileName } = req.params;
  const url = `http://localhost:8002/download-file/${bucketName}/${fileName}`;

  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    res.send(response.data);
  } catch (error) {
    console.error("Failed to download file:", error);
    res.status(500).json({ message: "Failed to download file" });
  }
};

exports.createFolder = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const bucketName = user.email; // Assume this is the bucket name
  const folderName = req.body.folderName; // Assume folderName is sent in request body

  if (!bucketName || !folderName) {
    return res
      .status(400)
      .json({ message: "Bucket name and folder name are required" });
  }

  const url = `http://localhost:8002/create-folder/${bucketName}/${folderName}`;

  try {
    // Making an axios POST request to create folder
    const response = await axios.get(url);
    // Assuming the other service returns a JSON response
    if (response.data.message === "Folder created") {
      res.json({ message: "Folder created " });
    } else {
      res.status(500).json({ message: "Failed to create folder" });
    }
  } catch (error) {
    console.error("Failed to create folder", error);
    res.status(500).json({ message: "Failed to create folder" });
  }
};



// rename filename
// exports.renameFile = async (req, res)=>{
//   const { currentName, newName } = req.body;

//   const userId = req.user._id;
//   const user = await User.findById(userId);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   if (!currentName || !newName) {
//     return res.status(400).json({ error: 'Both currentName and newName are required' });
//   }

//   const bucketName = user.email;

//   // this is for file path
//   const folderStructure = `bucket/root-bucket/${bucketName}`;

//   // Construct absolute paths for the source and destination files
//   const sourcePath = path.resolve(__dirname,'..', folderStructure, currentName);
//   const destPath = path.resolve(__dirname,'..', folderStructure, newName);

//   fs.rename(sourcePath, destPath, (err) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Error renaming the file' });
//     }

//     res.json({ message: 'File renamed successfully' });

//   });
// }


// currentname with extention
exports.renameFile = async (req, res) => {
  const { currentName, newName } = req.body;

  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!currentName || !newName) {
    return res.status(400).json({ error: 'Both currentName and newName are required' });
  }

  const bucketName = user.email;

  // This is for file path
  const folderStructure = `bucket/root-bucket/${bucketName}`;

  // Construct absolute paths for the source and destination files
  const sourcePath = path.resolve(__dirname, '..', folderStructure, currentName);

  // Determine if the currentName has an extension
  const extname = path.extname(currentName);
  const newNameWithExtension = extname ? newName + extname : newName;
  const destPath = path.resolve(__dirname, '..', folderStructure, newNameWithExtension);

  fs.rename(sourcePath, destPath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error renaming the file' });
    }

    res.json({ message: 'File renamed successfully' });
  });
}

// favourite file add api
// const uuid = require('uuid');
// const FavoriteFile = require("../models/files");

exports.favouriteFileAdd = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { fileName, filePath, size, price} = req.body;


  try {
    // Check if a file with the same filename exists for the same user
    const existingFile = await FavoriteFile.findOne({ userId, fileName });

    if (existingFile) {
      // A file with the same filename exists; update the filepath if different
      if (existingFile.filePath !== filePath) {
        existingFile.filePath = filePath;
        await existingFile.save();
        return res.json({ message: 'File updated with new filepath', file: existingFile });
      }
      return res.status(400).json({ message: "File already in favorites" });
    }

    // Generate a unique fileId using uuid
    const favFileId = uuid.v4();
    const currentDate = new Date().toISOString();

    const newFile = new FavoriteFile({
      userId,
      favFileId,
      fileName,
      filePath,
      modifiedDate: currentDate,
      size,
      price,
    });

    await newFile.save();
    res.json({ message: 'File added to favorites', file: newFile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add to favorites' });
  }
}



// api for file add(foldername)
// const uuid = require('uuid');
// exports.favouriteFileAdd = async (req, res) => {
//   const userId = req.user._id;
//   const user = await User.findById(userId);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const { fileName, folderName, filePath, size } = req.body;

//   try {
//     // Check if a file with the same filename or foldername exists for the same user
//     const existingFile = await FavoriteFile.findOne({
//       userId,
//       $or: [
//         { fileName },
//         { folderName },
//       ],
//     });

//     if (existingFile) {
//       // A file with the same filename or foldername exists; update the filepath if different
//       if (existingFile.filePath !== filePath) {
//         existingFile.filePath = filePath;
//         await existingFile.save();
//         return res.json({ message: 'File updated with new filepath', file: existingFile });
//       }
//       return res.status(400).json({ message: "File already in favorites" });
//     }

//     // Generate a unique fileId using uuid
//     const favFileId = uuid.v4();
//     const currentDate = new Date().toISOString();

//     const newFile = new FavoriteFile({
//       userId,
//       favFileId,
//       fileName,
//       folderName,
//       filePath,
//       modifiedDate: currentDate,
//       size,
//     });

//     await newFile.save();
//     res.json({ message: 'File added to favorites', file: newFile });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to add to favorites' });
//   }
// }



exports.favouriteFileRemove = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { fileName, filePath } = req.body;

  if (!fileName || !filePath) {
    return res.status(400).json({ message: 'Both fileName and filePath are required' });
  }

  try {
    const file = await FavoriteFile.findOne({ userId, fileName, filePath });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    await FavoriteFile.findOneAndDelete({ userId, fileName, filePath });
    res.json({ message: 'File removed from favorites', fileName, filePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



// // api for favouriteFileRemove(foldername)
// exports.favouriteFileRemove = async (req, res) => {
//   const userId = req.user._id;
//   const user = await User.findById(userId);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const { fileName, folderName, filePath } = req.body;

//   if (!(fileName || folderName) || !filePath) {
//     return res.status(400).json({ message: 'Either fileName or folderName and filePath are required' });
//   }

//   try {
//     const query = { userId, filePath };

//     if (fileName) {
//       query.fileName = fileName;
//     }

//     if (folderName) {
//       query.folderName = folderName;
//     }

//     const file = await FavoriteFile.findOne(query);

//     if (!file) {
//       return res.status(404).json({ message: 'File not found' });
//     }

//     await FavoriteFile.findOneAndDelete(query);
//     res.json({ message: 'File removed from favorites', fileName, folderName, filePath });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };



// favourite file list
exports.favouriteFileList = async (req, res) => {
  const userId = req.user._id; // Assuming you have a user ID from authentication
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  try {

    const favoriteFiles = await FavoriteFile.find({ userId });
    res.json({ message: 'Favorite files retrieved', files: favoriteFiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve favorite files' });
  }
};

// const favoriteFiles = [];
// // favouriteFilesadd
// exports.favouriteFileAdd = async (req, res) =>{

//    const userId = req.user._id;
//   const user = await User.findById(userId);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const { fileName } = req.body;

//   if (!fileName) {
//     return res.status(400).json({ error: 'File name is required.' });
//   }

//   // Check if the file already exists in favorites
//   if (favoriteFiles.includes(fileName)) {
//     return res.status(400).json({ error: 'File is already in favorites.' });
//   }

//   favoriteFiles.push(fileName);
//   res.status(201).json({ message: 'File added to favorites.', favoriteFiles });
// }


// favoritefilesget
// exports.favouriteFileList = async (req,res) =>{

//   const userId = req.user._id;
//   const user = await User.findById(userId);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }
//   res.json({ favoriteFiles });
// }

// removeFavouriteFile
// exports.favouriteFileRemove = async(req, res) => {

//   const userId = req.user._id;
//   const user = await User.findById(userId);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const { fileName } = req.body;

//   if (!fileName) {
//     return res.status(400).json({ error: 'File name is required.' });
//   }

//   const index = favoriteFiles.indexOf(fileName);

//   if (index === -1) {
//     return res.status(404).json({ error: 'File not found in favorites.' });
//   }

//   favoriteFiles.splice(index, 1);
//   res.json({ message: 'File removed from favorites.', favoriteFiles });
// }





// exports.favouriteFileAdd = async (req, res) =>{
// // const fileId = req.params.fileId;
// const { fileName } = req.body

// try {
//   const file = await File.findOne({ fileName });
//   // const file = await File.findOne({ fileId });

//   if (!file) {
//     return res.status(404).json({ message: 'File not found' });
//   }

//   file.isFavorite = true; // Mark the file as a favorite
//   await file.save();

//   res.json({ message: 'File added to favorites', file });
// } catch (error) {
//   console.log(error)
//   res.status(500).json({ message: 'Failed to add to favorites' });
// }
// }



// code for marking a file as a favorite
//   exports.favouriteFileAdd = async (req, res) =>{
// // app.post('/mark-favorite', (req, res) => {
//   const userId = req.user._id;
//   const filename = req.body.filename;

//   // Load the user's metadata file
//   const userMetadata = loadUserMetadata(userId);

//   // Check if the file exists and is not already marked as a favorite
//   if (!userMetadata.favoriteFiles.includes(filename)) {
//     // Add the filename to the list of favorites
//     userMetadata.favoriteFiles.push(filename);

//     // Save the updated metadata file
//     saveUserMetadata(userId, userMetadata);

//     res.json({ message: 'File marked as favorite' });
//   } else {
//     res.status(400).json({ message: 'File is already a favorite' });
//   }
// };


// exports.favouriteFileAdd = async (req, res) => {
//   const userId = req.user._id;
//   const filename = req.params.filename; // Assuming you pass the filename as a parameter

//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if the filename is already in the favorites list
//     if (!user.favorites.includes(filename)) {
//       // Add the filename to the user's favorites
//       user.favorites.push(filename);
//       await user.save();

//       res.json({ message: "File added to favorites" });
//     } else {
//       res.json({ message: "File is already in favorites" });
//     }
//   } catch (error) {
//     console.error("Failed to add file to favorites:", error);
//     res.status(500).json({ message: "Failed to add file to favorites" });
//   }
// };


// exports.favouriteFileAdd = async (req, res) => {

//   const userId = req.user._id;
//   const user = await User.findById(userId);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }
//   const { fileName } = req.body;

//   try {
//     // Generate a unique fileId using uuid
//     const fileId = uuid.v4();

//     const newFile = new File({
//       userId,
//       fileId, // Set the fileId
//       fileName,
//       isFavorite: true,
//     });

//     await newFile.save();

//     res.json({ message: 'File added to favorites', file: newFile });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to add to favorites' });
//   }
// }

// exports.favouriteFileAdd = async (req, res) => {
//   const userId = req.user._id;
//   const user = await User.findById(userId);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }
//   const { fileName } = req.body;

//   try {
//     // Check if the fileName already exists for the user
//     const existingFile = await File.findOne({ userId, fileName });

//     if (existingFile) {
//       return res.status(400).json({ message: "File with the same name already exists" });
//     }

//     // Generate a unique fileId using uuid
//     const fileId = uuid.v4();

//     const newFile = new File({
//       userId,
//       fileId, // Set the fileId
//       fileName,
//       isFavorite: true,
//     });

//     await newFile.save();

//     res.json({ message: 'File added to favorites', file: newFile });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to add to favorites' });
//   }
// }

// exports.favouriteFileList = async (req, res) => {
//   const userId = req.user._id; // Assuming you have a user ID from authentication
//   const user = await User.findById(userId);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }
//   try {
//     const favoriteFiles = await FavoriteFile.find({ userId });

//     // Process and add additional information to each file
//     const filesWithDetails = favoriteFiles.map((file) => ({
//       fileName: file.fileName,
//       // size: bytesToSize(file.stats.size), // Assuming 'stats' is a property of 'file'
//       modifiedDate: file.stats.mtime.toISOString(),
//     }));

//     res.json({ message: 'Favorite files retrieved', files: filesWithDetails });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to retrieve favorite files' });
//   }
// };


// movefile api
const mv = require('mv');
exports.moveFile = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const bucketName = user.email;
  const { sourceFolder, destinationFolder, fileName } = req.body;
  const folderStructureSource = sourceFolder
    ? `bucket/root-bucket/${bucketName}/${sourceFolder}`
    : `bucket/root-bucket/${bucketName}`;
  const folderStructureDestination = `bucket/root-bucket/${bucketName}/${destinationFolder || ''}`;
  const currentPath = path.join(__dirname, '..', folderStructureSource, fileName);
  const destinationPath = path.join(__dirname, '..', folderStructureDestination, fileName);
  mv(currentPath, destinationPath, function (err) {
    if (err) {
      console.log("Move Error", err);
      return res.status(500).json({ message: "File move failed", error: err });
    } else {
      console.log("Successfully moved");
      res.json({ message: "Successfully moved", fileName, currentPath, destinationPath });
    }
  });
};




// similar type written
// app.post("/mark-as-favorite/:bucketName/:fileName", async (req, res) => {
//   exports.markasFavorite = async (req, res) => {
//   const userId = req.user._id;
//   const user = await User.findById(userId);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const bucketName = user.email;
//   const { fileName } = req.params;

//   const url = `http://localhost:8002/mark-as-favorite/${bucketName}/${fileName}`;

//   try {
//     // Send a request to the "mark-as-favorite" endpoint of the file management system
//     const response = await axios.post(url);
//     res.json(response.data);
//   } catch (error) {
//     console.error("Failed to mark file as favorite:", error);
//     res.status(500).json({ message: "Failed to mark file as favorite" });
//   }
// };






// exports.favouriteFileRemove = async (req, res) => {
//   const userId = req.user._id;
//   const user = await User.findById(userId);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const { favouriteFileId } = req.body; // Assuming you pass the fileId as a parameter

//   try {
//     // Find the file by fileId and userId to ensure it belongs to the user
//     const file = await FavoriteFile.findOne({  favFileId:favouriteFileId }).exec();
//     console.log(favouriteFileId)
//     if (!file) {
//       return res.status(404).json({ message: 'File not found',favouriteFileId:file });
//     }

//     // Remove the file from favorites by setting isFavorite to false

//     //await file.save();
//     FavoriteFile.findOneAndDelete({favouriteFileId }).then(function(){
//       res.json({ message: 'File removed from favorites' });
//     })  
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };







// moveFile
// const mv = require('mv');
// exports.moveFile =async (req,res) => {
//   const userId = req.user._id
//   const user = await User.findById(userId)

//   const {name}= req.body


//   if (!user){
//     return res.status(404).json({message:"User not found"})
//   }
//   const bucketName = user.email;
//   const folderStructure = `bucket/root-bucket/${bucketName}`;
//   const destinationfolder=`bucket/root-bucket/`;
//   // const destinationfolder=`bucket/root-bucket/${bucketName}/fav`;
//   // Construct absolute paths for the source and destination files
//   const currentPath = path.join(__dirname, '..', folderStructure, "ravi.pdf");
//   const destinationPath =path.join(__dirname, '..', destinationfolder, "ravi.pdf")

//   mv(currentPath,destinationPath, function (err){
//     if(err){
//     throw err
//   }else{
//     console.log("successfully moved")
//     res.json({message:"successfully moved"})
//   }

//   })
// }


// const mv = require('mv');

// exports.moveFile = async (req, res) => {
//   const userId = req.user._id;
//   const user = await User.findById(userId);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }
//   const bucketName = user.email;
//   const folderStructureSource = `bucket/root-bucket/${bucketName}`;
//   const folderStructureDesination = `bucket/root-bucket/${bucketName}/NewFolder1`;
//   const { sourceFolder, destinationFolder, sourceFileName, destinationFileName } = req.body;
//   const currentPath = path.join(__dirname, '..', folderStructureSource, sourceFileName);
//   console.log(currentPath)
//   const destinationPath = path.join(__dirname, '..', folderStructureDesination, destinationFileName);
//   console.log(destinationPath)

//   mv(currentPath, destinationPath, function (err) {
//     if (err) {
//       console.log("Move Error", err)
//       return res.status(500).json({ message: "File move failed", error: err });
//     } else {
//       console.log("Successfully moved");
//       res.json({ message: "Successfully moved" });
//     }
//   });
// };



// exports.moveFile = async (req, res) => {
//   const userId = req.user._id;
//   const user = await User.findById(userId);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const bucketName = user.email;
//   const { sourceFolder, destinationFolder, sourceFileName, destinationFileName } = req.body; // Assuming you send these parameters in the request body.

//   if (!sourceFolder || !destinationFolder || !sourceFileName || !destinationFileName) {
//     return res.status(400).json({ message: "Missing required parameters" });
//   }

//   const folderStructureSource = `bucket/root-bucket/${bucketName}/${sourceFolder}`;
//   const folderStructureDesination = `bucket/root-bucket/${bucketName}/${destinationFolder}`;

//   const currentPath = path.join(__dirname, '..', folderStructureSource, sourceFileName);
//   console.log(currentPath);

//   const destinationPath = path.join(__dirname, '..', folderStructureDesination, destinationFileName);
//   console.log(destinationPath);

//   mv(currentPath, destinationPath, function (err) {
//     if (err) {
//       console.log("Move Error", err);
//       return res.status(500).json({ message: "File move failed", error: err });
//     } else {
//       console.log("Successfully moved");
//       res.json({ message: "Successfully moved" });
//     }
//   });
// };


exports.openFolder = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { folderName } = req.query; // Get the folder name from the query parameters
  const bucketName = user.email; // Assuming you want to use the user's email

  const url = `http://localhost:8002/open-folder/${bucketName}/${folderName}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Failed to list files:", error);
    res.status(500).json({ message: "Failed to list files in that folder" });
  }
};

// recycle bin proper
// exports.recycleBin = async (req, res) => {
//   console.log(req.user._id);
//   const userId = req.user._id;
//   const user = await User.findById(userId);

//   const { fileName } = req.body;

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const bucketName = user.email;
//   const recycleDir = path.join(
//     __dirname,
//     "..",
//     "bucket",
//     "recycle-bin",
//     bucketName
//   );

//   if (!fs.existsSync(recycleDir)) {
//     fs.mkdirSync(recycleDir);
//   }

//   const folderStructureSource = `bucket/root-bucket/${bucketName}`;
//   const folderStructureRecyclebinSource = `bucket/recycle-bin/${bucketName}`;
//   const recycleBinPath = path.join(__dirname, '..', folderStructureRecyclebinSource, fileName);
//   console.log("recycleBinPath",recycleBinPath)
//   const sourcePath = path.join(__dirname, '..', folderStructureSource, fileName)
//   console.log("sourcePath",sourcePath)

//   mv(sourcePath, recycleBinPath, function (err) {
//     if (err) {
//       console.log("Move Error", err);
//       return res.status(500).json({ message: "failed to move Recyclebin", error: err });
//     } else {
//       console.log("Successfully moved");
//       res.json({ message: "Successfully moved to Recyclebin", fileName });
//     }
//   });
// };


// const { promisify } = require('util');
// const mv = promisify(require('mv'));

// exports.recycleBin = async (req, res) => {
//   console.log(req.user._id);
//   const userId = req.user._id;
//   const user = await User.findById(userId);

//   const { fileName } = req.body;

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const bucketName = user.email;
//   const recycleDir = path.join(__dirname, "..", "bucket", "recycle-bin", bucketName);

//   if (!fs.existsSync(recycleDir)) {
//     fs.mkdirSync(recycleDir);
//   }

//   const folderStructureSource = `bucket/root-bucket/${bucketName}`;
//   const folderStructureRecyclebinSource = `bucket/recycle-bin/${bucketName}`;
//   const recycleBinPath = path.join(__dirname, '..', folderStructureRecyclebinSource, fileName);
//   console.log(recycleBinPath);
//   const sourcePath = path.join(__dirname, '..', folderStructureSource, fileName);

//   // Record the deletion date for the file (30 days from now)
//   const deletionDate = new Date();
//   deletionDate.setDate(deletionDate.getDate() + 30);

//   // Move the file to the recycle bin
//   try {
//      mv(sourcePath, recycleBinPath);

//     // Save the deletion date in your database or a metadata file
//     // Example: Update the 'deletionDate' property in the user's file metadata
//     // user.files[fileName].deletionDate = deletionDate;
//     // await user.save();

//     console.log("Successfully moved to Recyclebin");
//     res.json({ message: "Successfully moved to Recyclebin", fileName });
//   } catch (err) {
//     console.error("Move Error", err);
//     return res.status(500).json({ message: "Failed to move to Recyclebin", error: err });
//   }
// };

// // Function to delete expired files in the recycle bin
// const deleteExpiredFiles = async () => {
//   const currentDate = new Date();

//   // Calculate the date 30 days ago
//   const deletionDate = new Date(currentDate);
//   deletionDate.setDate(deletionDate.getDate() - 30);

//   // Get the list of files in the recycle bin
//   const recycleBinFiles = fs.readdirSync(__dirname, '..', folderStructureRecyclebinSource, fileName);

//   // Iterate through the files and check their deletion dates
//   for (const fileName of recycleBinFiles) {
//     const filePath = path.join(__dirname, '..', folderStructureRecyclebinSource, fileName);

//     // Retrieve the deletion date for the file from your database or metadata
//     // Example: const fileDeletionDate = user.files[fileName].deletionDate;

//     if (fileDeletionDate <= deletionDate) {
//       // If the file has exceeded its deletion date, delete it
//       try {
//         await fs.promises.unlink(filePath);
//         console.log(`Deleted expired file: ${fileName}`);
//       } catch (err) {
//         console.error(`Error deleting file: ${fileName}`, err);
//       }
//     }
//   }
// };

// // Schedule the deletion task to run daily (adjust as needed)
// setInterval(deleteExpiredFiles, 24 * 60 * 60 * 1000); // 24 hours


// exports.recycleBin = async (req, res) => {
//   console.log(req.user._id);
//   const userId = req.user._id;
//   const user = await User.findById(userId);

//   const { fileName } = req.body;

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const bucketName = user.email;
//   const recycleDir = path.join(
//     __dirname,
//     "..",
//     "bucket",
//     "recycle-bin",
//     bucketName
//   );

//   if (!fs.existsSync(recycleDir)) {
//     fs.mkdirSync(recycleDir);
//   }

//   const folderStructureSource = `bucket/root-bucket/${bucketName}`;
//   const folderStructureRecyclebinSource = `bucket/recycle-bin/${bucketName}`;
//   const recycleBinPath = path.join(__dirname, '..', folderStructureRecyclebinSource, fileName);
// console.log("recycleBinPath",recycleBinPath )
//   const sourcePath = path.join(__dirname, '..', folderStructureSource, fileName);
//   console.log("sourcePath",sourcePath )
//   // Get the current date and time
//   const moveDate = new Date();
//   const formattedDate = moveDate.toISOString(); // You can format the date as needed

//   // Append the timestamp to the file name
//   const timestampedFileName = `${formattedDate}-${fileName}`;

//   mv(sourcePath, path.join(recycleBinPath, timestampedFileName), function (err) {
//     if (err) {
//       console.log("Move Error", err);
//       return res.status(500).json({ message: "Failed to move Recyclebin", error: err });
//     } else {
//       console.log("Successfully moved");
//       res.json({ message: "Successfully moved to Recyclebin", fileName, timestamp: formattedDate });
//     }
//   });
// };



// exports.recycleBin = async (req, res) => {
//   console.log(req.user._id);
//   const userId = req.user._id;
//   const user = await User.findById(userId);

//   const { fileName } = req.body;

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const bucketName = user.email;
//   const recycleDir = path.join(
//     __dirname,
//     "..",
//     "bucket",
//     "recycle-bin",
//     bucketName
//   );

//   if (!fs.existsSync(recycleDir)) {
//     fs.mkdirSync(recycleDir, { recursive: true }); // Create the directory and its parent directories if they don't exist
//   }

//   const folderStructureSource = `bucket/root-bucket/${bucketName}`;
//   const folderStructureRecyclebinSource = `bucket/recycle-bin/${bucketName}`;
//   const recycleBinPath = path.join(__dirname, '..', folderStructureRecyclebinSource, fileName);
//   console.log("recycleBinPath",recycleBinPath)
//   const sourcePath = path.join(__dirname, '..', folderStructureSource, fileName);
//   console.log("sourcePath",sourcePath)
//   // Get the current date and time
//   const moveDate = new Date();
//   const formattedDate = moveDate.toISOString(); // You can format the date as needed


// mv(sourcePath, recycleBinPath, function (err) {
//   if (err) {
//     console.log("Move Error", err);
//     return res.status(500).json({ message: "failed to move Recyclebin", error: err });
//   } else {
//     console.log("Successfully moved");
//     res.json({ message: "Successfully moved to Recyclebin", fileName, date: formattedDate  });
//   }
// });
// };




exports.recycleBin = async (req, res) => {
  console.log(req.user._id);
  const userId = req.user._id;
  const user = await User.findById(userId);

  const { fileName } = req.body;

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const bucketName = user.email;
  const recycleDir = path.join(
    __dirname,
    "..",
    "bucket",
    "recycle-bin",
    bucketName
  );

  if (!fs.existsSync(recycleDir)) {
    fs.mkdirSync(recycleDir, { recursive: true }); // Create the directory and its parent directories if they don't exist
  }
  const url = `http://localhost:8002/recycle-bin/${bucketName}/${fileName}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Failed to move to recyclebin :", error);
    res.status(500).json({ message: "Failed to move to recyclebin" });
  }
};



exports.recycleBinList = async (req, res) => {
  console.log(req.user._id);
  const userId = req.user._id;
  const user = await User.findById(userId)

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const bucketName = user.email;

const url = `http://localhost:8002/recycle-bin-list/${bucketName}`;

try {
  const response = await axios.get(url);
  res.json(response.data);
} catch (error) {
  console.error("Failed to list recyclebin files :", error);
  res.status(500).json({ message: "Failed to list recyclebin files" });
}};







// exports.deleteRecyclebinContents = async (req, res) => {
//   const userId = req.user._id;
//   const user = await User.findById(userId)

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }
//   const bucketName = user.email;
//   const bucketDir = path.join(
//     __dirname,
//     "..",
//     "bucket",
//     "root-bucket",
//     bucketName
//   );
//   console.log(bucketDir)
//   try {
//     // Recursively delete the contents of the directory
//     await fs.rmdir(bucketDir, { recursive: true });

//     // Optionally, you can recreate the empty directory if needed
//     // await fs.mkdir(bucketDir);

//     return res.status(200).json({ message: "Contents deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting contents:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }





// this api for deleteRecyclebinContents
 
const fsPromises = require('fs').promises; // Import fs.promises

exports.deleteRecyclebinContents = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const bucketName = user.email;
  const bucketDir = path.join(__dirname, "..", "bucket", "recycle-bin", bucketName);

  try {
    // Recursively delete the contents of the directory using fs.promises.rmdir
    await fsPromises.rmdir(bucketDir, { recursive: true });

    return res.status(200).json({ message: "RecycleBin Contents deleted successfully" });
  } catch (error) {
    console.error("Error deleting contents:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}



// upload folder


const tarFs = require('tar-fs');
const zlib = require('zlib');
const { SFTP } = require('node-ssh');
const { promisify } = require('util');
const localDirectory = '/path/to/local/folder';
const remoteDirectory = '/path/to/remote/folder';
const remoteHost = process.env.HOST;
const remoteUsername = process.env.USERNAME;
const remotePassword = process.env.PASSWORD;

exports.uploadFolder = async (req, res) => {
  try {
    const connection = SFTP.createConnection({
      host: remoteHost,
      username: remoteUsername,
      password: remotePassword
    });
 
    await connection.connect();
    const tarStream = tarFs.createTarStream({
      cwd: localDirectory,
      onEntry: (entry) => {
        // Exclude hidden files and directories
        if (entry.name.startsWith('.')) {
          return entry.skip();
        }
      }
    });
 
    const gzipStream = zlib.createGzip();
    const remoteStream = connection.createWriteStream(path.join(remoteDirectory, 'folder.tar.gz'));
 
    tarStream.pipe(gzipStream).pipe(remoteStream);
 
    await new Promise((resolve, reject) => {
      remoteStream.on('finish', resolve);
      remoteStream.on('error', reject);
    });
 
    console.log('Folder uploaded successfully.');
  } catch (error) {
    console.error('Error uploading folder:', error);
  } finally {
    await connection.close();
  }
};
 