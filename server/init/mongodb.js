const { mongoose } = require("mongoose");
const { MONGODB_URI } = require("../config/keys");



const connectDB = async () => {

    try {
        await mongoose.connect(MONGODB_URI)
        console.log("Database connected successfully");
        
    } catch (error) {
        throw new Error(error.message)
    }

}

module.exports = connectDB