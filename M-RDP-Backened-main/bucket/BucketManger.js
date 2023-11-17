// Import the required modules
const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const jwt1 = require("express-jwt");
const FavoriteFile = require("../models/files");
const User = require("../models/user");
const { recycleBin } = require("../controllers/storageAPI");

const rootBucketDir = "root-bucket";
const sizeLimit = 10 * 1024 * 1024; // 10 MB
const bucketSizeLimit = 50 * 1024 * 1024; // 50 MB

// Initialize Express app and port
const app = express();
const port = 8002;
const portmain = 8000;

app.use(express.json());

function bytesToSize(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  if (bytes === 0) return "0 Byte";

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

  // Use toFixed() to keep up to 2 decimal places
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}

// Delete File
app.delete("/delete-file/:bucketName/:filename", (req, res) => {
  const { bucketName, filename } = req.params;
  const filePath = path.join(rootBucketDir, bucketName, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  fs.unlinkSync(filePath);
  res.json({ message: "File deleted" });
});


// Delete Multiple Files
// const fse = require('fs-extra');
// // app.delete("/delete-files/:bucketName", (req, res) => {
//   const { bucketName } = req.params;
//   const { files } = req.body; // Array of filenames

//   if (!files || files.length === 0) {
//     return res.status(400).send("No files specified for deletion.");
//   }
//   const deletedFiles = [];
//   files.forEach((fileName) => {
//     const filePath = path.join(rootBucketDir, bucketName, fileName);
//     if (fs.existsSync(filePath)) {
//       if (fs.lstatSync(filePath).isDirectory()) {
//         fs.rmdir(filePath, () => {
//           console.log("Folder Deleted!",filePath);
//         })
//       }
//       else {
//         // If it's a file, use fs to delete it
//         fs.unlinkSync(filePath);
//       }
//       deletedFiles.push(fileName);
//     }
//   });

//   res.json({
//     message: `${deletedFiles.length} files deleted successfully.`,
//     deletedFiles,
//   });
// });
app.delete("/delete-files/:bucketName", (req, res) => {
  const { bucketName } = req.params;
  const { files } = req.body; // Array of filenames

  if (!files || files.length === 0) {
    return res.status(400).send("No files specified for deletion.");
  }
  const deletedFiles = [];

  files.forEach((fileName) => {
    const filePath = path.join(rootBucketDir, bucketName, fileName);
    if (fs.existsSync(filePath)) {
      if (fs.lstatSync(filePath).isDirectory()) {
        try {
          fs.rmdirSync(filePath, { recursive: true }); // Use recursive option to delete contents
          console.log("Folder Deleted!", filePath);
        } catch (err) {
          console.error("Error deleting folder:", err);
        }
      } else {
        // If it's a file, use fs to delete it
        fs.unlinkSync(filePath);
        console.log("File Deleted!", filePath);
      }
      deletedFiles.push(fileName);
    }
  });

  res.json({
    message: `${deletedFiles.length} files deleted successfully.`,
    deletedFiles,
  });
});


// list all files url
// app.get("/list-all-files/:bucketName", (req, res) => {
//   try {
//     const bucketDir = path.join(rootBucketDir, req.params.bucketName);
//     if (!fs.existsSync(bucketDir)) {
//       return res.status(404).json({ message: "Bucket not found" });
//     }

//     const files = fs.readdirSync(bucketDir);
//     // const fileUrls = files.map((file) => {
//     //   return `http://localhost:${portmain}/api/download/${req.params.bucketName}/${file}`;
//     // });

//     // res.json(fileUrls);

//     // Creating a new array to store files with their size
//     const fileDetails = files.map((file) => {
//       const filePath = path.join(bucketDir, file);
//       const stats = fs.statSync(filePath);
//       return {
//         url: `http://localhost:${portmain}/api/download/${file}`,
//         size: bytesToSize(stats.size), // Adding the file size here
//         modifiedDate: stats.mtime.toISOString(), // Adding the last modified date here
//         fileName: file,
//       };
//     });

//     res.json(fileDetails);
//   } catch (error) {
//     console.error("Error fetching all files from bucket:", error);
//     res
//       .status(500)
//       .send("An error occurred while fetching files from the bucket.");
//   }
// });

app.get("/list-all-files/:bucketName", (req, res) => {
  try {
    const bucketDir = path.join(rootBucketDir, req.params.bucketName);
    if (!fs.existsSync(bucketDir)) {
      return res.status(404).json({ message: "Bucket not found" });
    }

    const files = fs.readdirSync(bucketDir);
    let totalBucketSize = 0; // Initialize the total bucket size to zero

    // Creating a new array to store files with their size
    const fileDetails = files.map((file) => {
      const filePath = path.join(bucketDir, file);
      const stats = fs.statSync(filePath);
      totalBucketSize += stats.size; // Add the size of each file to the total bucket size
      return {
        url: `http://localhost:${portmain}/api/download/${req.params.bucketName}/${file}`,
        size: bytesToSize(stats.size), // Adding the file size here
        modifiedDate: stats.mtime.toISOString(), // Adding the last modified date here
        fileName: file,
      };
    });

    res.json({
      files: fileDetails,
      totalBucketSize: bytesToSize(totalBucketSize), // Send the total bucket size as well
    });
  } catch (error) {
    console.error("Error fetching all files from bucket:", error);
    res
      .status(500)
      .send("An error occurred while fetching files from the bucket.");
  }
});

// app.get('/favorite-files/:bucketName', async (req, res) => {
//   // const userId = req.user._id; // Assuming you have a user ID from authentication
//   // const user = await User.findById(userId);
//   // if (!user) {
//   //   return res.status(404).json({ message: "User not found" });
//   // }
//   try {
//     const bucketDir = path.join(rootBucketDir, req.params.bucketName);
//     if (!fs.existsSync(bucketDir)) {
//       return res.status(404).json({ message: "Bucket not found" });
//     }
//  const files = fs.readdirSync(bucketDir);
//     let totalBucketSize = 0; // Initialize the total bucket size to zero
//     const fileDetails = files.map((file) => {
//       const filePath = path.join(bucketDir, file);
//       const stats = fs.statSync(filePath);
//       totalBucketSize += stats.size; // Add the size of each file to the total bucket size
//       return {
//         url: `http://localhost:${portmain}/api/download/${req.params.bucketName}/${file}`,
//         size: bytesToSize(stats.size), // Adding the file size here
//         modifiedDate: stats.mtime.toISOString(), // Adding the last modified date here
//         fileName: file,
//       };
//     });

//     try {
//       // Assuming you have a mongoose model for FavoriteFile
//       const favoriteFiles = await FavoriteFile.find({ userId });

//       // Combine the favoriteFiles and fileDetails into the response
//       const response = {
//         message: 'Favorite files and file details retrieved',
//         favoriteFiles,
//         fileDetails,
//       };

//       res.json(response);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Failed to retrieve favorite files' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to list files' });
//   }
// });







// Download File
app.get("/download-file/:bucketName/:filename", (req, res) => {
  try {
    const { bucketName, filename } = req.params;
    const filePath = path.join(rootBucketDir, bucketName, filename);
    console.log(filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found.");
    }

    res.download(filePath); // This will start downloading the file on the client side.
  } catch (error) {
    console.error("Error fetching file from bucket:", error);
    res
      .status(500)
      .send("An error occurred while fetching the file from the bucket.");
  }
});

app.get("/create-folder/:bucketName/:folderName", (req, res) => {
  const { bucketName, folderName } = req.params; // Assume bucketName and folderName are sent in request body

  if (!bucketName || !folderName) {
    return res
      .status(400)
      .json({ message: "Bucket name and folder name are required" });
  }

  const bucketDir = path.join(rootBucketDir, bucketName);

  if (!fs.existsSync(bucketDir)) {
    return res.status(404).json({ message: "Bucket not found" });
  }

  const newFolderDir = path.join(bucketDir, folderName);

  if (fs.existsSync(newFolderDir)) {
    return res.status(409).json({ message: "Folder already exists" });
  }

  fs.mkdirSync(newFolderDir);
  res.json({ message: "Folder created" });
});



// api for open folder
app.get("/open-folder/:bucketName/:folderName", (req, res) => {
  const folderStructure = 'bucket/root-bucket'; // Define the root bucket directory

  let folderPath = path.join(__dirname, '..', folderStructure, req.params.bucketName);

  folderName = req.params.folderName
  // If folderName is provided, append it to the folderPath
  if (folderName) {
    folderPath = path.join(folderPath, folderName);
  }

  try {
    const folderContents = fs.readdirSync(folderPath); // Read the contents of the folder

    const folderDetails = folderContents.map((file) => {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);

      return {
        url: `http://localhost:${portmain}/api/download/${req.params.bucketName}/${folderName}/${file}`,
        fileName: file,
        size: bytesToSize(stats.size), // File size in a human-readable format
        modifiedDate: stats.mtime.toISOString(), // Last modified date in ISO 8601 format
      };
    });

    res.json({ folderContents: folderDetails });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error opening the folder' });
  }
})

// api for recyclebin 
// const mv = require('mv');

// app.get("/recycle-bin/:bucketName/:fileName", (req, res) => {
//   bucketName = req.params.bucketName
//   fileName = req.params.fileName
//   const folderStructureSource = `bucket/root-bucket/${bucketName}`;
//   const folderStructureRecyclebinSource = `bucket/recycle-bin/${bucketName}`;
//   const recycleBinPath = path.join(__dirname, '..', folderStructureRecyclebinSource, fileName);
//   console.log("recycleBinPath", recycleBinPath)
//   const sourcePath = path.join(__dirname, '..', folderStructureSource, fileName);
//   console.log("sourcePath", sourcePath)
//   // Get the current date and time
//   const moveDate = new Date();
//   const formattedDate = moveDate.toISOString(); // You can format the date as needed

//   mv(sourcePath, recycleBinPath, function (err) {
//     if (err) {
//       console.log("Move Error", err);
//       return res.status(500).json({ message: "failed to move Recyclebin", error: err });
//     } else {
//       console.log("Successfully moved");
//       res.json({ message: "Successfully moved to Recyclebin", fileName, date: formattedDate });
//     }
//   });

// })



// tried lasttime  for 60 seconds
// const mv = require('mv');
// app.get("/recycle-bin/:bucketName/:fileName", (req, res) => {
//   bucketName = req.params.bucketName;
//   fileName = req.params.fileName;
//   const folderStructureSource = `bucket/root-bucket/${bucketName}`;
//   const folderStructureRecyclebinSource = `bucket/recycle-bin/${bucketName}`;
//   const recycleBinPath = path.join(__dirname, '..', folderStructureRecyclebinSource, fileName);
//   console.log("recycleBinPath", recycleBinPath);
//   const sourcePath = path.join(__dirname, '..', folderStructureSource, fileName);
//   console.log("sourcePath", sourcePath);
//   // Get the current date and time
//   const moveDate = new Date();
//   const formattedDate = moveDate.toISOString(); // You can format the date as needed

//   mv(sourcePath, recycleBinPath, function (err) {
//     if (err) {
//       console.log("Move Error", err);
//       return res.status(500).json({ message: "failed to move Recyclebin", error: err });
//     } else {
//       console.log("Successfully moved");
//       res.json({ message: "Successfully moved to Recyclebin", fileName, date: formattedDate });
//     }
//   });

//   // Schedule the cleanup exactly 6 seconds from now
//   const cleanupTimeout = 60 * 1000; // 6 seconds in milliseconds
//   setTimeout(() => {
//     cleanupRecycleBin(folderStructureRecyclebinSource, formattedDate);
//   }, cleanupTimeout);
// });

// function cleanupRecycleBin(recycleBinPath, moveDateISOString) {
//   const recycleBinFolder = path.join(__dirname, '..', recycleBinPath);
//   // console.log("recycleBinFolder", recycleBinFolder);
//   const currentDate = new Date();
//   console.log(currentDate);
//   const moveDate = new Date(moveDateISOString);
//   console.log(moveDate);
//   const secondsDifference = (currentDate - moveDate) / 1000;
//   console.log(secondsDifference);

//   if (secondsDifference >= 60) {
//     const files = fs.readdirSync(recycleBinFolder);
//     // console.log("files", files);

//     files.forEach((fileName) => {
//       // console.log("fileName", fileName);
//       const filePath = path.join(recycleBinFolder, fileName);

//       // Check if the file's age is greater than or equal to 60 seconds
//       const fileAgeInSeconds = (currentDate - fs.statSync(filePath).ctime) / 1000;
//       if (fileAgeInSeconds >= 60) {
//         fs.unlinkSync(filePath);
//         console.log(`Deleted file: ${filePath}`);
//       }
//     });
//   }
// }




// tried 13-11-2023  (for 60 seconds)
const mv = require('mv');

app.get("/recycle-bin/:bucketName/:fileName", (req, res) => {
  const bucketName = req.params.bucketName;
  const fileName = req.params.fileName;
  const folderStructureSource = `bucket/root-bucket/${bucketName}`;
  const folderStructureRecyclebinSource = `bucket/recycle-bin/${bucketName}`;
  const recycleBinPath = path.join(__dirname, '..', folderStructureRecyclebinSource, fileName);
  const sourcePath = path.join(__dirname, '..', folderStructureSource, fileName);

  console.log("recycleBinPath", recycleBinPath);
  console.log("sourcePath", sourcePath);

  // Get the current date and time
  const moveDate = new Date();
  const formattedDate = moveDate.toISOString(); // You can format the date as needed

  mv(sourcePath, recycleBinPath, function (err) {
    if (err) {
      console.log("Move Error", err);
      return res.status(500).json({ message: "failed to move Recyclebin", error: err });
    } else {
      console.log("Successfully moved");
      res.json({ message: "Successfully moved to Recyclebin", fileName, date: formattedDate });
    }
  });

  // Schedule the cleanup exactly 6 seconds from now
  const cleanupTimeout = 60 * 1000; // 6 seconds in milliseconds
  setTimeout(() => {
    cleanupRecycleBin(folderStructureRecyclebinSource, formattedDate);
  }, cleanupTimeout);
});

function cleanupRecycleBin(recycleBinPath, moveDateISOString) {
  const recycleBinFolder = path.join(__dirname, '..', recycleBinPath);
  console.log("recycleBinFolder", recycleBinFolder);

  try {
    // Check if the directory exists
    if (fs.existsSync(recycleBinFolder)) {
      const currentDate = new Date();
      const moveDate = new Date(moveDateISOString);
      const secondsDifference = (currentDate - moveDate) / 1000;

      if (secondsDifference >= 60) {
        const files = fs.readdirSync(recycleBinFolder);

        if (files.length > 0) {
          files.forEach((fileName) => {
            const filePath = path.join(recycleBinFolder, fileName);

            // Check if the file's age is greater than or equal to 60 seconds
            const fileAgeInSeconds = (currentDate - fs.statSync(filePath).ctime) / 1000;

            if (fileAgeInSeconds >= 60) {
              
              if (fs.existsSync(filePath)) {
                const stats = fs.statSync(filePath);
              
                if (stats.isFile()) {
                  // It's a file, delete it
                  fs.unlinkSync(filePath);
                  console.log(`Recycle Bin Auto-Deleted file: ${filePath}`);
                } else if (stats.isDirectory()) {
                  // It's a directory, delete it recursively
                  fs.rmdirSync(filePath, { recursive: true });
                  console.log(`Recycle Bin Auto-Deleted folder: ${filePath}`);
                }
              } else {
                console.log(`Item not found: ${filePath}`);
              }
              
            }
          });
        } else {
          console.log("Recycle Bin is empty. No files to delete.");
        }
      }
    } else {
      console.error(`Recycle Bin directory does not exist: ${recycleBinFolder}`);
    }
  } catch (err) {
    console.error(`Error while cleaning up recycle bin: ${err.message}`);
  }
}



// tried 13-11-2023  (for 15 days)
// const mv = require('mv');
// app.get("/recycle-bin/:bucketName/:fileName", (req, res) => {
//   const bucketName = req.params.bucketName;
//   const fileName = req.params.fileName;
//   const folderStructureSource = `bucket/root-bucket/${bucketName}`;
//   const folderStructureRecyclebinSource = `bucket/recycle-bin/${bucketName}`;
//   const recycleBinPath = path.join(__dirname, '..', folderStructureRecyclebinSource, fileName);
//   const sourcePath = path.join(__dirname, '..', folderStructureSource, fileName);

//   console.log("recycleBinPath", recycleBinPath);
//   console.log("sourcePath", sourcePath);

//   // Get the current date and time
//   const moveDate = new Date();
//   const formattedDate = moveDate.toISOString(); // You can format the date as needed

//   mv(sourcePath, recycleBinPath, function (err) {
//     if (err) {
//       console.log("Move Error", err);
//       return res.status(500).json({ message: "failed to move Recyclebin", error: err });
//     } else {
//       console.log("Successfully moved");
//       res.json({ message: "Successfully moved to Recyclebin", fileName, date: formattedDate });
//     }
//   });

//   // Schedule the cleanup exactly 15 days from now
//   const cleanupTimeout = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds
//   setTimeout(() => {
//     cleanupRecycleBin(folderStructureRecyclebinSource, formattedDate);
//   }, cleanupTimeout);
// });

// function cleanupRecycleBin(recycleBinPath, moveDateISOString) {
//   const recycleBinFolder = path.join(__dirname, '..', recycleBinPath);
//   console.log("recycleBinFolder", recycleBinFolder);

//   try {
//     // Check if the directory exists
//     if (fs.existsSync(recycleBinFolder)) {
//       const currentDate = new Date();
//       const moveDate = new Date(moveDateISOString);
//       const daysDifference = (currentDate - moveDate) / (24 * 60 * 60 * 1000); // Difference in days

//       if (daysDifference >= 15) {
//         const files = fs.readdirSync(recycleBinFolder);

//         if (files.length > 0) {
//           files.forEach((fileName) => {
//             const filePath = path.join(recycleBinFolder, fileName);

//             // Check if the file's age is greater than or equal to 15 days
//             const fileAgeInDays = (currentDate - fs.statSync(filePath).ctime) / (24 * 60 * 60 * 1000);

//             if (fileAgeInDays >= 15) {
//               // Check if the file still exists before attempting to delete
//               if (fs.existsSync(filePath)) {
//                 fs.unlinkSync(filePath);
//                 console.log(`Recycle Bin Auto-Deleted file: ${filePath}`);
//               } else {
//                 console.log(`File not found: ${filePath}`);
//               }
//             }
//           });
//         } else {
//           console.log("Recycle Bin is empty. No files to delete.");
//         }
//       }
//     } else {
//       console.error(`Recycle Bin directory does not exist: ${recycleBinFolder}`);
//     }
//   } catch (err) {
//     console.error(`Error while cleaning up recycle bin: ${err.message}`);
//   }
// }




// function cleanupRecycleBin(recycleBinPath) {
//   const recycleBinFolder = path.join(__dirname, '..', recycleBinPath);
//   console.log("Recycle Bin Folder", recycleBinFolder);

//   try {
//     if (fs.existsSync(recycleBinFolder)) {
//       const currentDate = new Date();
//       const files = fs.readdirSync(recycleBinFolder);

//       files.forEach((fileName) => {
//         const filePath = path.join(recycleBinFolder, fileName);

//         // Check if the file's age is greater than or equal to 15 days
//         const fileAgeInMilliseconds = currentDate - fs.statSync(filePath).ctime;
//         const fifteenDaysInMilliseconds = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds

//         if (fileAgeInMilliseconds >= fifteenDaysInMilliseconds) {
//           fs.unlinkSync(filePath);
//           console.log(`Deleted file: ${filePath}`);
//         }
//       });
//     } else {
//       console.error("Recycle bin directory does not exist:", recycleBinFolder);
//     }
//   } catch (error) {
//     console.error("Error while cleaning up the recycle bin:", error);
//   }
// }


// for fifteen days
// app.get("/recycle-bin/:bucketName/:fileName", (req, res) => {
//   bucketName = req.params.bucketName;
//   fileName = req.params.fileName;
//   const folderStructureSource = `bucket/root-bucket/${bucketName}`;
//   const folderStructureRecyclebinSource = `bucket/recycle-bin/${bucketName}`;
//   const recycleBinPath = path.join(__dirname, '..', folderStructureRecyclebinSource, fileName);
//   console.log("recycleBinPath", recycleBinPath);
//   const sourcePath = path.join(__dirname, '..', folderStructureSource, fileName);
//   console.log("sourcePath", sourcePath);
  
//   // Get the current date and time
//   const moveDate = new Date();
//   const formattedDate = moveDate.toISOString(); // You can format the date as needed

//   mv(sourcePath, recycleBinPath, function (err) {
//     if (err) {
//       console.log("Move Error", err);
//       return res.status(500).json({ message: "failed to move Recyclebin", error: err });
//     } else {
//       console.log("Successfully moved");
//       res.json({ message: "Successfully moved to Recyclebin", fileName, date: formattedDate });
//     }
//   });

//   // Schedule the cleanup after 15 days (15 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
//   const cleanupTimeout = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds
//   setTimeout(() => {
//     cleanupRecycleBin(folderStructureRecyclebinSource);
//   }, cleanupTimeout);
// });

// function cleanupRecycleBin(recycleBinPath) {
//   const recycleBinFolder = path.join(__dirname, '..', recycleBinPath);
//   console.log("Recycle Bin Folder", recycleBinFolder);

//   const currentDate = new Date();
//   const files = fs.readdirSync(recycleBinFolder);

//   files.forEach((fileName) => {
//     const filePath = path.join(recycleBinFolder, fileName);

//     // Check if the file's age is greater than or equal to 15 days
//     const fileAgeInMilliseconds = currentDate - fs.statSync(filePath).ctime;
//     const fifteenDaysInMilliseconds = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds

//     if (fileAgeInMilliseconds >= fifteenDaysInMilliseconds) {
//       fs.unlinkSync(filePath);
//       console.log(`Deleted file: ${filePath}`);
//     }
//   });
// }






// app.get("/recycle-bin/:bucketName/:fileName", (req, res) => {
//   const bucketName = req.params.bucketName;
//   const fileName = req.params.fileName;
//   const folderStructureSource = `bucket/root-bucket/${bucketName}`;
//   const folderStructureRecyclebinSource = `bucket/recycle-bin/${bucketName}`;
//   const recycleBinPath = path.join(__dirname, '..', folderStructureRecyclebinSource, fileName);
//   console.log("recycleBinPath", recycleBinPath);
//   const sourcePath = path.join(__dirname, '..', folderStructureSource, fileName);
//   console.log("sourcePath", sourcePath);

//   // Get the current date and time
//   const moveDate = new Date();
//   const formattedDate = moveDate.toISOString(); // You can format the date as needed

//   mv(sourcePath, recycleBinPath, function (err) {
//     if (err) {
//       console.log("Move Error", err);
//       return res.status(500).json({ message: "Failed to move to Recyclebin", error: err });
//     } else {
//       console.log("Successfully moved");
//       res.json({ message: "Successfully moved to Recyclebin", fileName, date: formattedDate });
//     }
//   });

//   // Schedule the cleanup 30 days from now
//   const cleanupTimeout = 60 * 1000; // 30 days in milliseconds
//   setTimeout(() => {
//     cleanupRecycleBin();
//   }, cleanupTimeout);
// });

// Function to delete files older than 30 days
// function cleanupRecycleBin() {
//   const recycleBinFolder = path.join(__dirname, 'bucket', 'recycle-bin'); // Update this to the correct path

//   const currentDate = new Date();
//   currentDate.setDate(currentDate.getDate() -30 ); // Calculate the date 30 days ago

//   const files = fs.readdirSync(recycleBinFolder);

//   files.forEach((fileName) => {
//     const filePath = path.join(recycleBinFolder, fileName);
//     const fileStat = fs.statSync(filePath);

//     if (fileStat.isFile() && fileStat.mtime <= currentDate) {
//       fs.unlinkSync(filePath); // Delete the file
//       console.log(`Deleted file: ${filePath}`);
//     }
//   });
// }

// function cleanupRecycleBin() {
//   const recycleBinFolder = path.join(__dirname, 'bucket', 'recycle-bin'); // Update this to the correct path

//   const currentDate = new Date();
//   currentDate.setSeconds(currentDate.getSeconds() - 6); // Calculate the date 6 seconds ago

//   const files = fs.readdirSync(recycleBinFolder);

//   files.forEach((fileName) => {
//     const filePath = path.join(recycleBinFolder, fileName);
//     const fileStat = fs.statSync(filePath);

//     if (fileStat.isFile() && fileStat.mtime <= currentDate) {
//       fs.unlinkSync(filePath); // Delete the file
//       console.log(`Deleted file: ${filePath}`);
//     }
//   });
// }




// recyclebin list proper
app.get("/recycle-bin-list/:bucketName", (req, res) => {

  const recycleBin = "recycle-bin"
  bucketName = req.params.bucketName

  try {
    const bucketDir = path.join(recycleBin, bucketName);
    console.log("bucketDir", bucketDir)
    if (!fs.existsSync(bucketDir)) {
      console.log(bucketDir)
      return res.status(404).json({ message: "Bucket not found" });
    }

    const files = fs.readdirSync(bucketDir);
    let totalBucketSize = 0; // Initialize the total bucket size to zero

    // Creating a new array to store files with their size
    const fileDetails = files.map((file) => {
      const filePath = path.join(bucketDir, file);


      const stats = fs.statSync(filePath);
      totalBucketSize += stats.size; // Add the size of each file to the total bucket size
      return {
        url: `http://localhost:${portmain}/api/recycle-bin/${bucketName}/${file}`,
        size: bytesToSize(stats.size), // Adding the file size here
        Date: stats.mtime.toISOString(), // Adding the last modified date here
        fileName: file,
      };
    });

    res.json({
      files: fileDetails,
      totalBucketSize: bytesToSize(totalBucketSize), // Send the total bucket size as well
    });
  } catch (error) {
    console.error("Error fetching all files from bucket:", error);
    res
      .status(500)
      .send("An error occurred while fetching files from the bucket.");
  }
});

// tried for date 
// app.get("/recycle-bin-list/:bucketName", (req, res) => {
//   const recycleBin = "recycle-bin";
//   const bucketName = req.params.bucketName;

//   try {
//     const bucketDir = path.join(recycleBin, bucketName);

//     if (!fs.existsSync(bucketDir)) {
//       return res.status(404).json({ message: "Bucket not found" });
//     }

//     const files = fs.readdirSync(bucketDir);
//     let totalBucketSize = 0;
//     const fileDetails = [];

//     files.forEach((file) => {
//       const filePath = path.join(bucketDir, file);

//       // Read the date from the corresponding metadata file
//       const metadataFilePath = path.join(__dirname, '..', folderStructureRecyclebinSource, `${file}.metadata`);
//       const date = fs.readFileSync(metadataFilePath, 'utf-8');

//       const stats = fs.statSync(filePath);
//       totalBucketSize += stats.size;

//       fileDetails.push({
//         url: `http://localhost:${portmain}/api/recycle-bin/${bucketName}/${file}`,
//         size: bytesToSize(stats.size),
//         date: date, // Get the date from the metadata
//         fileName: file,
//       });
//     });

//     res.json({
//       files: fileDetails,
//       totalBucketSize: bytesToSize(totalBucketSize),
//     });
//   } catch (error) {
//     console.error("Error fetching all files from bucket:", error);
//     res.status(500).send("An error occurred while fetching files from the bucket.");
//   }
// });


// combined code but correct code
// app.get("/recycle-bin/:bucketName/:fileName", (req, res) => {
//   bucketName = req.params.bucketName
//   fileName = req.params.fileName
//   const folderStructureSource = `bucket/root-bucket/${bucketName}`;
//   const folderStructureRecyclebinSource = `bucket/recycle-bin/${bucketName}`;
//   const recycleBinPath = path.join(__dirname, '..', folderStructureRecyclebinSource, fileName);
//   console.log("recycleBinPath",recycleBinPath)
//   const sourcePath = path.join(__dirname, '..', folderStructureSource, fileName);
//   console.log("sourcePath",sourcePath)
//   // Get the current date and time
//   const moveDate = new Date();
//   const formattedDate = moveDate.toISOString(); // You can format the date as needed

//   mv(sourcePath, recycleBinPath, function (err) {
//     if (err) {
//       console.log("Move Error", err);
//       return res.status(500).json({ message: "failed to move Recyclebin", error: err });
//     } else {
//       console.log("Successfully moved");

//       const recycleBin = "recycle-bin";

//       try {
//         const bucketDir = path.join(recycleBin, bucketName);
//         console.log("bucketDir",bucketDir)
//         if (!fs.existsSync(bucketDir)) {
//           console.log(bucketDir);
//           return res.status(404).json({ message: "Bucket not found" });
//         }

//         const files = fs.readdirSync(bucketDir);
//         let totalBucketSize = 0; // Initialize the total bucket size to zero

//         // Creating a new array to store files with their size
//         const fileDetails = files.map((file) => {
//           const filePath = path.join(bucketDir, file);
//           const stats = fs.statSync(filePath);
//           totalBucketSize += stats.size; // Add the size of each file to the total bucket size
//           return {
//             url: `http://localhost:${portmain}/api/recycle-bin/${bucketName}/${file}`,
//             size: bytesToSize(stats.size), // Adding the file size here
//             modifiedDate: stats.mtime.toISOString(), // Adding the last modified date here
//             fileName: file,
//           };
//         });

//         const response = {
//           message: "Successfully moved to Recyclebin",
//           fileName,
//           date: formattedDate,
//           files: fileDetails,
//           totalBucketSize: bytesToSize(totalBucketSize), // Send the total bucket size as well
//         };

//         res.json(response);
//       } catch (error) {
//         console.error("Error fetching all files from bucket:", error);
//         res.status(500).send("An error occurred while fetching files from the bucket.");
//       }
//     }
//   });
// });




// similar type 
// app.post("/mark-as-favorite/:bucketName/:fileName", (req, res) => {
//   const bucketDir = path.join(rootBucketDir, req.params.bucketName);
//   const filePath = path.join(bucketDir, req.params.fileName);

//   // Check if the file exists
//   if (!fs.existsSync(filePath)) {
//     return res.status(404).json({ message: "File not found" });
//   }

//   // Update the file's "isFavorite" status in the database or any other storage mechanism
//   // For example, if you're using a database:
//   // FileModel.updateOne({ userId: req.user._id, fileName: req.params.fileName }, { isFavorite: true }, (err) => {
//   //   if (err) {
//   //     return res.status(500).json({ message: "Failed to mark file as favorite" });
//   //   }
//   //   res.json({ message: "File marked as favorite" });
//   // });

//   // For this example, we'll simulate the update and return a success message
//   // res.json({ message: "File marked as favorite", fileName});
//   res.json({ message: "File marked as favorite", fileName: req.params.fileName }); // Include fileName in the response

// });



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
