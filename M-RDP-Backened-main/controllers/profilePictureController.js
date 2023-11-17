const multer = require("multer");
const mongodb = require("mongodb");
const fs = require("fs");
const path = require("path");
const User = require("../models/user");
require("dotenv").config();


const profilePictureStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.params.userId;
    const userFolderPath = `profile_pictures/${userId}`;

    // Create the user-specific folder if it doesn't exist
    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath, { recursive: true });
    }

    cb(null, userFolderPath);
  },
  filename: function (req, file, cb) {
    const filename = file.originalname + ".jpg";
    cb(null, filename);
  },
});

const profilePictureValidator = multer({
  storage: profilePictureStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"));
    }
  },
  limits: {
    fileSize: 1000000, // 1MB
  },
}).single("profilePicture");

const client = new mongodb.MongoClient(process.env.DATABASE, {
  useUnifiedTopology: true,
  auth: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD, //kumar
  },
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully");
    // return client.db("M-backened");
    return client.db(process.env.DB_NAME);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
}

async function uploadProfilePicture(req, res) {
  //   console.log(req);
  // const userId = req.user._id;
  const profilePicture = req.file;
  //   console.log(profilePicture);
  const userId = req.params.userId;

  try {
    const db = await connectToDatabase();
    await deleteExistingProfilePicture(userId, db);

    const profilePictureDocument = {
      userId,
      profilePicture: profilePicture.filename,
    };
    await db.collection("profile_pictures").insertOne(profilePictureDocument);

    // const imageUrl = `http://techmega.cloud:8000/api/profilePicture/${userId}/${profilePicture.filename}`;
    // const imageUrl= http://localhost:8000/api/profilePicture/649fe534c88bbd16e7eddd68/1200px-Sunflower_from_Silesia2.jpg.jpg
    const imageUrl  = `http://localhost:8000/api/profilePicture/${userId}/${profilePicture.filename}`;

    await User.updateOne({ _id: userId }, { profilePictureUrl: imageUrl });

    res.status(200).json({
      message: "The profile picture was uploaded successfully.",
      imageUrl,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({
      error: "An error occurred while uploading the profile picture.",
    });
  }
}

async function deleteProfilePicture(req, res) {
  const userId = req.params.userId;
  // const userId = req.user._id;

  const profilePicture = req.file;
  console.log(profilePicture);

  try {
    const db = await connectToDatabase();
    await deleteExistingProfilePicture(userId, db);
    // After deleting the profile picture
    await User.updateOne({ _id: userId }, { profilePictureUrl: null });
    res.status(200).send("The profile picture was deleted successfully.");
  } catch (error) {
    console.error("Error deleting profile picture:", error);
    res
      .status(500)
      .send("An error occurred while deleting the profile picture.");
  }
}

async function deleteExistingProfilePicture(userId, db) {
  try {
    const existingPicture = await db
      .collection("profile_pictures")
      .findOne({ userId });

    if (existingPicture) {
      const picturePath = `profile_pictures/${userId}/${existingPicture.profilePicture}`;
      if (fs.existsSync(picturePath)) {
        fs.unlinkSync(picturePath);
        await db.collection("profile_pictures").deleteOne({ userId });
      } else {
        console.warn("File not found:", picturePath);
      }
    }
  } catch (error) {
    console.error("Error deleting profile picture:", error);
    throw error;
  }
}

async function getProfilePicture(req, res) {
  try {
    const { userId, filename } = req.params;
    // Adjust the path to move one directory up from __dirname
    const rootDir = path.join(__dirname, "..");

    const imagePath = path.join(rootDir, "profile_pictures", userId, filename);

    console.log(imagePath);
    res.sendFile(imagePath);
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    res
      .status(500)
      .send("An error occurred while fetching the profile picture.");
  }
}

// async function deleteExistingProfilePicture(userId, db) {
//   try {
//     const existingPicture = await db
//       .collection("profile_pictures")
//       .findOne({ userId });

//     if (existingPicture) {
//       const picturePath = existingPicture.profilePicture;
//       fs.unlinkSync(picturePath);
//       await db.collection("profile_pictures").deleteOne({ userId });
//     }
//   } catch (error) {
//     console.error("Error deleting profile picture:", error);
//     throw error;
//   }
// }

module.exports = {
  uploadProfilePicture,
  deleteProfilePicture,
  profilePictureValidator,
  getProfilePicture,
};
