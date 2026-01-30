const mongoose  = require("mongoose");


const billSchema = mongoose.Schema({

    name : {
        type : String,
        required : true
    },
     code: {
      type: String,
      required: true,
      unique: true, 
    },
    description: {
      type: String, 
    },
    amount: {
      type: Number,
      required: true,
    },
    frequency: {
      type: String,
      enum: ["monthly", "yearly", "one-time"],
      default: "yearly",
    },

    appliesTo: {
      type: [String], 
      enum: ["TRADER", "RESIDENT", "BUSINESS", "ARTISAN", "CIVIL SERVANTS", "OTHERS"], 
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },

}, {timestamps : true, minimize : false})

const Bill = mongoose.model("Bill", billSchema)


module.exports = Bill