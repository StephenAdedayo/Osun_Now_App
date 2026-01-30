const { redisClient } = require("../init/redis");
const { User } = require("../models");
const cloudinary = require("cloudinary").v2;

const setUpUserAccount = async (req, res, next) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      occupation,
      gender,
      nin,
      phone,
      email,
      address,
      city,
      lga,
    } = req.body;

    const imageFile = req.file;

    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      res.code = 400;
      throw new Error("User not found");
    }

    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        res.code = 400;
        throw new Error("Email already exists");
      }
    }

    const uploadUrl = await cloudinary.uploader.upload(imageFile.path);

    user.image = uploadUrl.secure_url;

    user.firstName = firstName;
    user.middleName = middleName;
    user.lastName = lastName;
    user.dateOfBirth = dateOfBirth;
    user.occupation = occupation;
    user.gender = gender;
    user.nin = +nin;
    user.phone = +phone;
    user.email = email;
    user.address = address;
    user.city = city;
    user.lga = lga;
    user.isProfileComplete = true;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Account Set up successful" });
  } catch (error) {
    next(error);
  }
};

const getUserData = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const cacheKey = `user:${_id}`;

    // VALUE comes from Redis
    const cachedUser = await redisClient.get(cacheKey);

    if (cachedUser) {
      return res.status(200).json({
        success: true,
        source: "cache",
        user: JSON.parse(cachedUser),
      });
    }

    const user = await User.findById(_id).select(
      "-password -verifyOtp -verifyOtpExpires -resetPasswordOtp -resetPasswordOtpExpires",
    );

    if (!user) {
      res.code = 400;
      throw new Error("User data not found");
    }

    await redisClient.setEx(cacheKey, 300, JSON.stringify(user));

    res.status(200).json({ success: true, source: "database", user });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      occupation,
      gender,
      nin,
      phone,
      email,
      address,
      city,
      lga,
    } = req.body;

    const { file } = req;

    const user = await User.findById(_id);

    if (!user) {
      res.code = 400;
      throw new Error("User not found");
    }

    if (phone) {
      const isPhoneExists = await User.findOne({ phone });
      if (
        isPhoneExists &&
        +phone === isPhoneExists.phone &&
        String(isPhoneExists._id) !== user._id
      ) {
        res.code = 400;
        throw new Error("Phone number already exists");
      }
    }

    if (email) {
      const isEmailExists = await User.findOne({ email });
      if (
        isEmailExists &&
        email === isEmailExists.email &&
        String(isEmailExists._id) !== user._id
      ) {
        res.code = 400;
        throw new Error("Email already exists");
      }
    }

    if (file) {
      const imageUrl = await cloudinary.uploader.upload(file.path);
      user.image = imageUrl.secure_url;
    } else {
      user.image = user.image;
    }

    user.phone = phone ? Number(phone) : user.phone;
    user.firstName = firstName ? firstName : user.firstName;
    user.middleName = middleName ? middleName : user.middleName;
    user.lastName = lastName ? lastName : user.lastName;
    user.dateOfBirth = dateOfBirth ? dateOfBirth : user.dateOfBirth;
    user.occupation = occupation ? occupation : user.occupation;
    user.gender = gender ? gender : user.gender;
    user.nin = nin && nin.length > 10 && nin.length < 12 ? nin : user.nin;
    user.email = email ? email : user.email;
    user.address = address ? address : user.address;
    user.city = city ? city : user.city;
    user.lga = lga ? lga : user.lga;
    user.isUserVerified = phone ? false : user.isUserVerified;

    await user.save();

    const cacheKey = `user:${_id}`;

    // VALUE comes from Redis
    const cachedUser = await redisClient.get(cacheKey);

    if (cachedUser) {
      await redisClient.del(cacheKey);
    }

    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { setUpUserAccount, getUserData, updateUserProfile };
