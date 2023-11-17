const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    favFileId: { type: String, unique: true },
    fileName: { type: String, unique: false },
    filePath: { type: String },
    modifiedDate: { type: String },
    size: { type: String },
    price: { type: String },
});

const FavoriteFile = mongoose.model("FavoriteFile", fileSchema);
module.exports = FavoriteFile;










// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const fileSchema = new mongoose.Schema({
//     userId: {
//         type: Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//     },
//     favFileId: { type: String, unique: true },
//     fileName: { type: String, unique: false },
//     folderName: {type: String },
//     filePath: { type: String },
//     modifiedDate: { type: String },
//     size: { type: String },
//     price: { type: String },
// });

// const FavoriteFile = mongoose.model("FavoriteFile", fileSchema);
// module.exports = FavoriteFile;

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const fileSchema = new mongoose.Schema({
//     userId: {
//         type: Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//     },
//     favFileId: { type: String, unique: true },
//     fileName: { type: String, unique: false },
//     filePath: { type: String },
//     modifiedDate: {
//         type: String,
//         default: () => new Date().toISOString(), // Set the default value to the current date in ISO format
//     },
//     size: { type: String },
//     // price: { type: String },
// });

// // Add a pre-save middleware to update the modifiedDate field before saving
// fileSchema.pre('save', function (next) {
//     const currentDate = new Date();
//     this.modifiedDate = currentDate.toISOString();
//     next();
// });

// const FavoriteFile = mongoose.model("FavoriteFile", fileSchema);
// module.exports = FavoriteFile;


// const mongoose = require('mongoose')
// const Schema = mongoose.Schema; // This line defines what 'Schema' is
// const fileSchema = new mongoose.Schema({

//     userId: {
//         type: Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//     },
//     favFileId: { type: String, unique: true }, // Make fileId unique
//     fileName: { type: String, unique: false },
//     filePath: { type: String },
//     modifiedDate: {
//         type: Date, // Change the type to Date to store date objects
//         default: Date.now // Set the default value to the current date and time
//     },
//     size: { type: String }
// })
// const FavoriteFile = mongoose.model("FavoriteFile", fileSchema)
// module.exports = FavoriteFile