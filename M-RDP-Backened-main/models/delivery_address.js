// const mongoose = require("mongoose");

// const deliveryAddressSchema = new mongoose.Schema(
//   {
//     _id: { type: mongoose.Types.ObjectId, auto: true },
//     address: { type: String, required: true },
//     apartment: { type: String, required: false },
//     city: { type: String, required: true },
//     country: { type: String, required: true },
//     firstname: { type: String, required: true },
//     lastname: { type: String, required: true },
//     phone: { type: String, required: true },
//     postalCode: { type: String, required: true },
//     state: { type: String, required: true },
//     userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
//   },
//   { versionKey: false } // Disable the versionKey (__v) field
// );

// const DeliveryAddress = mongoose.model(
//   "DeliveryAddress",
//   deliveryAddressSchema
// );

// module.exports = DeliveryAddress;
