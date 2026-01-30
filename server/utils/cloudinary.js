const {
  CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET_KEY,
  CLOUDINARY_CLOUD_NAME,
} = require("../config/keys");

const cloudinary = require("cloudinary").v2;

const connectCloudinary = async () => {
  cloudinary.config({
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET_KEY,
    cloud_name: CLOUDINARY_CLOUD_NAME,
  });
};

module.exports = connectCloudinary;
