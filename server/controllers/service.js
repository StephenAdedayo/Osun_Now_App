const { Service } = require("../models");


// create a service on remita and allocate a particular serviceTypeId to it
const addService = async (req, res, next) => {
  try {
    const {
      name,
      code,
      provider,
      identifierLabel,
      remitaBillerId,
      serviceTypeId,
      category,
    } = req.body;

    const service = await Service.findOne({ code });
    if (service) {
      res.code = 400;
      throw new Error("service already exists");
    }

    const serviceData = {
      name,
      code,
      provider,
      identifierLabel,
      remitaBillerId,
      serviceTypeId,
      category,
    };

    const newService = new Service(serviceData);

    await newService.save();

    res
      .status(201)
      .json({
        success: true,
        message: "Service created successfully",
        newService,
      });
  } catch (error) {
    next(error);
  }
};

const toggleServiceAvailablity = async (req, res, next) => {
  try {
    const { serviceId } = req.body;

    const service = await Service.findOne({ _id: serviceId });

    if (!service) {
      res.code = 400;
      throw new Error("Service not found");
    }

    service.active = !service.active;

    await service.save();

    res.status(200).json({ success: true, message: "Availability toggled" });
  } catch (error) {
    next(error);
  }
};

const getServices = async (req, res, next) => {
  try {
    const services = await Service.find({ active: true });

    res.status(200).json({ success: true, message: "All services", services });
  } catch (error) {
    next(error);
  }
};

module.exports = { addService, toggleServiceAvailablity, getServices };
