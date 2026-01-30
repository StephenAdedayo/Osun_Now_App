const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // e.g., "Electricity Bill (IBEDC)"
  },
  code: {
    type: String,
    required: true,
    unique: true, // e.g., "OSUN_ELEC_01"
  },
  provider: {
    type: String,
    required: true,
     // e.g., "Remita" or "IBEDC"
  },
  // The official Remita ID for this specific revenue type
  serviceTypeId: {
    type: String,
    required: true, 
  },
  // The ID of the government agency/biller
  remitaBillerId: {
    type: String,
    required: true,
  },
  identifierLabel: {
    type: String,
    required: true, // e.g., "Meter Number" or "Tax ID"
  },
  active: {
    type: Boolean,
    default: true, // Set to true so you can use it immediately
  },
  // Add category to filter on the frontend (Utilities, Waste, Taxes)
  category: {
    type: String,
    enum: ['Utility', 'Waste', 'Tax', 'Education'],
    required: true
  }
}, { timestamps: true, minimize: false });

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;