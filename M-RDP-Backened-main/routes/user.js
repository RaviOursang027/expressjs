const express = require("express");
const router = express.Router();

// const multer = require("multer");
// const upload = multer({ dest: "./root-bucket/" }); // specify the folder to save uploaded files
// const upload = multer({ storage: multer.memoryStorage() });

//import controller
const { requireSignin, adminMiddleware } = require("../controllers/auth");
const {
  read,
  update,
  // upload,
  // createBucket,
  // uploadlist,
  // downloadFile,
  // deleteFile,
  createVirtualMachine,
  createOrder,
  paymentSuccess,
  getUserDeliveryAddresses,
  createDeliveryAddress,
  updateDeliveryAddress,
  getAllApps,
  storeUserApp,
  getUserApps,
  pincodedetails,
  // getFaqs,
  userSubscriptionDetails,
  initiateEmailChange,
  verifyAndChangeEmail,
  fetchIpVm,
  deleteUser,
  feedbackRating,
} = require("../controllers/user");

const storageAPI = require("../controllers/storageAPI");
const vmAPI = require("../controllers/vmAPI");
// const storageAPI = require('./storageAPI');

const {
  deleteProfilePicture,
  uploadProfilePicture,
  profilePictureValidator,
  getProfilePicture,
} = require("../controllers/profilePictureController");

router.get("/user", requireSignin, read);
router.put("/user/update", requireSignin, update);
router.put("/admin/update", requireSignin, adminMiddleware, update);
// router.get("/user/createVirtualMachine", requireSignin, createVirtualMachine);
router.get("/user/fetchIpVm", requireSignin, fetchIpVm);
router.post("/user/createOrder", requireSignin, createOrder);
router.post("/user/paymentSuccess", requireSignin, paymentSuccess);

router.delete("/user/delete-Account", requireSignin, deleteUser);
router.get(
  "/address/getUserDeliveryAddresses",
  requireSignin,
  getUserDeliveryAddresses
);
router.post(
  "/address/createDeliveryAddress",
  requireSignin,
  createDeliveryAddress
);
router.put(
  "/address/updateDeliveryAddress",
  requireSignin,
  updateDeliveryAddress
);

router.get("/getAllApps", requireSignin, getAllApps);
// router.get("/getAppList", getAppList);
router.post("/userapps/storeUserApp", requireSignin, storeUserApp);
router.get("/getUserApps", requireSignin, getUserApps);
router.get("/pincode-details/:pincode", requireSignin, pincodedetails);
// router.get("/getFaqs", getFaqs);
router.get("/userSubscriptionDetails", requireSignin, userSubscriptionDetails);
router.get(
  "/profilePicture/:userId/:filename",
  // requireSignin,
  getProfilePicture
);

router.post(
  "/uploadProfilePicture/:userId",
  // requireSignin,
  profilePictureValidator,
  uploadProfilePicture
);
router.delete("/deleteProfilePicture/:userId", deleteProfilePicture);

router.post("/initiateEmailChange", requireSignin, initiateEmailChange);
router.post("/verifyAndChangeEmail", requireSignin, verifyAndChangeEmail);


// router.get("/upload", requireSignin, upload);
// router.get("/createBucket", requireSignin, createBucket);
// router.post("/uploadlist", uploadlist);
// router.post("/downloadFile", downloadFile);
// router.delete("/deleteFile", deleteFile);
// router.post("/createVm", createVm);

// router.post('/upload', storageAPI.uploadFile);
// router.post("/upload", upload.single("file"), storageAPI.uploadFile);

router.post(
  "/upload-file",
  requireSignin,
  // storageAPI.preCheckFileSize,
  storageAPI.preCheckBucketSize,
  storageAPI.upload,
  storageAPI.uploadFile
);

router.delete("/delete/:fileName", requireSignin, storageAPI.deleteFile);

router.delete(
  "/multipe-file-delete",
  requireSignin,
  storageAPI.deleteMultipleFiles
);
router.get("/list", requireSignin, storageAPI.listAllFiles);
router.get("/download/:fileName", requireSignin, storageAPI.downloadFile);
router.post("/create-folder", requireSignin, storageAPI.createFolder);
router.get("/openFolder", requireSignin, storageAPI.openFolder);
router.post("/recycleBin", requireSignin, storageAPI.recycleBin)
router.get("/recycleBinList", requireSignin, storageAPI.recycleBinList)
router.delete("/deleteRecyclebinContents", requireSignin, storageAPI.deleteRecyclebinContents)

// written for storage api
router.post("/renameFile",requireSignin, storageAPI.renameFile);
router.post("/favorites/add", requireSignin,storageAPI.favouriteFileAdd)
router.get("/favorites/list", requireSignin,storageAPI.favouriteFileList)
router.delete("/favorites/remove", requireSignin,storageAPI.favouriteFileRemove)
router.post("/uploadFolder", storageAPI.uploadFolder);
router.post("/moveFile", requireSignin,storageAPI.moveFile)
// similar type written
// router.post("/mark-as-favorite/:fileName",requireSignin,storageAPI.markasFavorite)

// router.post("/start-vm", requireSignin, vmAPI.startVM);
// router.post("/stop-vm", requireSignin, vmAPI.stopVM);
router.get("/status-vm", requireSignin, vmAPI.getVMStatus);
router.get("/network-stats", requireSignin, vmAPI.getNetworkStats);
router.get("/Vm-session", requireSignin, vmAPI.readLogs);
router.get(
  "/user/createVirtualMachine",
  requireSignin,
  vmAPI.createVirtualMachine
);

router.post("/feedback-rating", requireSignin, feedbackRating);
module.exports = router;

// http://techmega.cloud:3000/api/getAllApps
