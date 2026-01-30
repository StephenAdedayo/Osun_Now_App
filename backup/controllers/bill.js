const { redisClient } = require("../../server/init/redis");
const { Bill, UserBill, User } = require("../../server/models");

const generateBill = async (req, res, next) => {
  try {
    const { name, code, description, amount, frequency, appliesTo } = req.body;

    const billExists = await Bill.findOne({ code });

    if (billExists) {
      res.code = 400;
      throw new Error("Bill already exists");
    }

    const billData = {
      name,
      code,
      description,
      amount,
      frequency,
      appliesTo,
    };

    const newBill = new Bill(billData);

    await newBill.save();

    res
      .status(200)
      .json({ success: true, message: "Bill created successfully" });
  } catch (error) {
    next(error);
  }
};

// create bill for a single user
const userBills = async (req, res, next) => {
  try {
    const { userId, billTypeId, dueDate } = req.body;

    const isBillTypeExists = await Bill.findById(billTypeId);

    if (!isBillTypeExists) {
      res.code = 400;
      throw new Error("Bill type does not exists");
    }

    const userBillExists = await UserBill.findOne({
      userId,
      billTypeId,
      status: "unpaid",
    });

    if (userBillExists) {
      res.code = 400;
      throw new Error("Bill already exists");
    }

    const newBill = {
      userId,
      billTypeId,
      amount: isBillTypeExists.amount,
      dueDate,
    };

    const userBill = new UserBill(newBill);

    await userBill.save();

    res
      .status(201)
      .json({
        success: true,
        message: "User bill sent successfully",
        userBill,
      });
  } catch (error) {
    next(error);
  }
};

// create bill for all users
const assignBillToAllUser = async (req, res, next) => {
  try {
    const { billTypeId, dueDate } = req.body;

    const billType = await Bill.findById(billTypeId);

    if (!billType) {
      res.code = 400;
      throw new Error("Bill type is not found");
    }

    const users = await User.find({});

    const createBills = [];

    for (let user of users) {
      const exists = await UserBill.findOne({
        userId: user._id,
        billTypeId,
        status: "unpaid",
      });

      if (!exists) {
        createBills.push({
          userId: user._id,
          billTypeId,
          amount: billType.amount,
          dueDate,
        });
      }
    }

    if (createBills.length === 0) {
      res.code = 400;
      throw new Error("No eligible users found");
    }

    const createdBills = await UserBill.insertMany(createBills);

    res.status(201).json({
      message: `${createdBills.length} bills assigned successfully`,
      createdBills,
    });
  } catch (error) {
    next(error);
  }
};

// create bills for multiple users by occupation
const assignBillByOccupation = async (req, res, next) => {
  try {
    const { billTypeId, dueDate } = req.body;

    const billType = await Bill.findById(billTypeId);

    if (!billType) {
      res.code = 400;
      throw new Error("Bill type is not found");
    }

    const occupations = billType.appliesTo;

    const users = await User.find({
      occupation: { $in: occupations },
    });

    const createBills = [];

    for (let user of users) {
      const exists = await UserBill.findOne({
        userId: user._id,
        billTypeId,
        status: "unpaid",
      });

      if (!exists) {
        createBills.push({
          userId: user._id,
          billTypeId,
          amount: billType.amount,
          dueDate,
        });
      }
    }

    if (createBills.length === 0) {
      res.code = 400;
      throw new Error("No eligible users found");
    }

    const createdBills = await UserBill.insertMany(createBills);

    res.status(201).json({
      message: `${createdBills.length} bills assigned successfully`,
      createdBills,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBills = async (req, res, next) => {
  try {
    const cacheKey = `bills:all`;

    const cachedBills = await redisClient.get(cacheKey);

    if (cachedBills) {
      try {
        return res.status(200).json({
          success: true,
          source: "cache",
          allBills: JSON.parse(cachedBills),
        });
      } catch {
        await redisClient.del(cacheKey);
      }
    }

    const allBills = await Bill.find({});

    if (!allBills) {
      res.code = 400;
      throw new Error("Could not get bills");
    }

    await redisClient.setEx(cacheKey, 300, JSON.stringify(allBills));

    res.status(200).json({ success: true, allBills });
  } catch (error) {
    next(error);
  }
};

const getUserBillsAdmin = async (req, res, next) => {
  try {
    const cacheKey = `bills:all`;

    const cachedBills = await redisClient.get(cacheKey);

    if (cachedBills) {
      try {
        return res.status(200).json({
          success: true,
          source: "cache",
          allBills: JSON.parse(cachedBills),
        });
      } catch {
        await redisClient.del(cacheKey);
      }
    }

    const allBills = await UserBill.find({})
      .populate("userId")
      .populate("billTypeId");

    if (!allBills) {
      res.code = 400;
      throw new Error("Could not get bills");
    }

    await redisClient.setEx(cacheKey, 300, JSON.stringify(allBills));

    res.status(200).json({ success: true, allBills });
  } catch (error) {
    next(error);
  }
};

const getSingleUserBill = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const cacheKey = `userBill:${_id}`;

    const cachedBill = await redisClient.get(cacheKey);

    if (cachedBill) {
      try {
        return res
          .status(200)
          .json({
            success: true,
            source: "cache",
            cachedBill: JSON.parse(cachedBill),
          });
      } catch {
        await redisClient.del(cacheKey);
      }
    }

    const userBills = await UserBill.find({ userId: _id });

    if (!userBills) {
      res.code = 400;
      throw new Error("Could not get user bills");
    }

    await redisClient.setEx(cacheKey, 300, JSON.stringify(userBills));
    res.status(200).json({ success: true, userBills });
  } catch (error) {
    next(error);
  }
};

// delete bill
// pay bill
// swagger docs
// Step 1: Validate bill (get customer info & amount)
 const getBill = async (req, res) => {
  try {
    const { serviceCode, identifier } = req.body;

    const service = await Service.findOne({ code: serviceCode, active: true });
    if (!service) return res.status(404).json({ message: "Service not found" });

    const billData = await validateBill(serviceCode, identifier);

    res.status(200).json({
      success: true,
      data: {
        customerName: billData.customer_name,
        amount: billData.amount,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



// Step 2: Initialize payment
const payBill = async (req, res) => {
  try {
    const {_id} = req.user

    const user = await User.findById({id : _id})


    if(!user){
        res.status(400).json({success: false, message : "User not found"})
    }
    const { serviceCode, identifier, email } = req.body;
       
    const service = await Service.findOne({ code: serviceCode, active: true });
    if (!service) return res.status(404).json({ message: "Service not found" });
    
    const paystackResponse = await initializeBillPayment({ serviceCode, accountNumber: identifier, email });

    // Save bill in DB
    const bill = await Bill.create({
      userId :  user._id, 
      serviceId: service._id,
      identifier,
      amount: paystackResponse.amount,
      providerRef: paystackResponse.reference,
      providerPayload: paystackResponse,
      status: "pending",
    });

    res.status(200).json({
      message: "Payment initialized",
      data: {
        billId: bill._id,
        authorizationUrl: paystackResponse.authorization_url,
        reference: paystackResponse.reference,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



// Step 3: Verify payment (webhook or manual)
const confirmPayment = async (req, res) => {
  try {
    const { reference } = req.body;

    const bill = await Bill.findOne({ providerRef: reference });
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    const verification = await verifyBillPayment(reference);

    if (verification.status === "success") {
      bill.status = "paid";
      await bill.save();
    }

    res.status(200).json({ bill, verification });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


module.exports = {
  generateBill,
  userBills,
  assignBillToAllUser,
  assignBillByOccupation,
  getAllBills,
  getUserBillsAdmin,
  getSingleUserBill,
};
