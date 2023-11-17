const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    planName: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    receipt: { type: String, required: true },
    payment_id: { type: String },
    payment_status: { type: String },
    email: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { versionKey: false } // Disable the versionKey (__v) field
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
