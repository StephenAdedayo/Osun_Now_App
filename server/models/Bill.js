const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  identifierValue: {
    type: String, 
    required: true, // This stores the actual Meter Number or Tax ID
  },
  amount: {
    type: Number,
    required: true,
  },
  rrr: {
    type: String, // The unique Remita ID generated for this payment
    unique: true,
  },
  transactionReference: {
    type: String, // internal unique ID (use something like Date.now())
    unique: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING",
  },
  paymentResponse: {
    type: Object, // To store the full response from Remita for auditing
  }
}, { timestamps: true });

const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;