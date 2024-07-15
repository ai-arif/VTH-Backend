import Medicine from "../../models/medicine.model.js";
import sendResponse from "../../utils/sendResponse.js";
import { createNotification } from "./notification.controller.js";

export const addMedicine = async (req, res) => {
  try {
    const {
      name,
      price,
      quantity,
      description,
      brandName,
      composition,
      class: medicineClass,
      form,
      manufacturer,
      unitPrice,
      packSize,
      withdrawalPeriod,
      dose,
      route,
      strength,
      animalType,
    } = req.body;

    const newMedicine = new Medicine({
      name,
      price,
      quantity,
      description,
      brandName,
      composition,
      class: medicineClass,
      form,
      manufacturer,
      unitPrice,
      packSize,
      withdrawalPeriod,
      dose,
      route,
      strength,
      animalType,
    });

    const newMed = await newMedicine.save();

    if (newMed) {
      // const departmentInfo = await Department.findById(department);

      const title = `New medicine added`;
      const description = `'${name}' added as a new medicine of brand: '${brandName}' and manufacturer: ${manufacturer}`;
      const department = null;
      const type = "pharmacy";
      const destinationUrl = `/medicine/${newMed?._id}`;

      const notify = await createNotification(
        title,
        description,
        department,
        type,
        destinationUrl
      );
      // console.log({ notify })
    }

    sendResponse(res, 200, true, "Successfully created medicine", newMed);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, false, error.message);
  }
};

export const getMedicine = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || "";
  const sort = -1;

  try {
    const totalMedicine = await Medicine.countDocuments();
    const totalPages = Math.ceil(totalMedicine / limit);

    const medicines = await Medicine.find()
      .sort({ createdAt: sort })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    sendResponse(res, 200, true, "Successfully fetched medicines", {
      totalMedicine,
      totalPages,
      page,
      data: medicines,
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const getMedicinesBrandName = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || "";
  const sort = -1;

  try {
    const totalMedicine = await Medicine.countDocuments();
    const totalPages = Math.ceil(totalMedicine / limit);

    const medicines = await Medicine.find().select({ brandName: 1, _id: 1 })
      .sort({ createdAt: sort })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    sendResponse(res, 200, true, "Successfully fetched medicines brand name", {
      totalMedicine,
      totalPages,
      page,
      data: medicines,
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const updateMedicine = async (req, res) => {
  const {
    name,
    price,
    quantity,
    description,
    brandName,
    composition,
    class: medicineClass,
    form,
    manufacturer,
    unitPrice,
    packSize,
    withdrawalPeriod,
    dose,
    route,
    strength,
    animalType,
  } = req.body;
  const { id } = req.params;

  try {
    const existMedicine = await Medicine.findOne({ _id: id });
    if (!existMedicine)
      return sendResponse(res, 404, false, "Did not find the medicine");

    await Medicine.updateOne(
      { _id: id },
      {
        name,
        price,
        quantity,
        description,
        brandName,
        composition,
        class: medicineClass,
        form,
        manufacturer,
        unitPrice,
        packSize,
        withdrawalPeriod,
        dose,
        route,
        strength,
        animalType,
      }
    );

    sendResponse(res, 200, true, "Successfully updated medicine");
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const deleteMedicine = async (req, res) => {
  const { id } = req.params;

  try {
    const existMedicine = await Medicine.findOne({ _id: id });
    if (!existMedicine)
      return sendResponse(res, 404, false, "Did not find the medicine");

    const result = await Medicine.deleteOne({ _id: id });

    if (result) {
      // const departmentInfo = await Department.findById(department);

      const title = `A medicine has been deleted`;
      const description = `Medicine: '${existMedicine?.name}' of brand: '${existMedicine?.brandName}' has been removed`;
      const department = null;
      const type = "pharmacy";
      const destinationUrl = `/medicine/view`;

      const notify = await createNotification(
        title,
        description,
        department,
        type,
        destinationUrl
      );
      // console.log({ notify })
    }

    sendResponse(res, 200, true, "Successfully deleted medicine");
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// getMedicineById
export const getMedicineById = async (req, res) => {
  const { id } = req.params;

  try {
    const medicine = await Medicine.findOne({ _id: id });
    if (!medicine)
      return sendResponse(res, 404, false, "Did not find the medicine");

    sendResponse(res, 200, true, "Successfully fetched medicine", {
      data: medicine,
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// name, brandName take search query params and match with name and brandName and handle with proper pagination
export const searchMedicine = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = -1;
  const search = req.query.search;

  try {
    const totalMedicine = await Medicine.countDocuments({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { brandName: { $regex: search, $options: "i" } },
      ],
    });
    const totalPages = Math.ceil(totalMedicine / limit);

    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { brandName: { $regex: search, $options: "i" } },
      ],
    })
      .sort({ createdAt: sort })
      .limit(limit)
      .skip((page - 1) * limit);

    sendResponse(res, 200, true, "Successfully fetched medicines", {
      totalMedicine,
      totalPages,
      page,
      data: medicines,
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};
