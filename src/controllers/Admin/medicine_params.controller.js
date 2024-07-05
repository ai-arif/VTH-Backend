import { AsyncHandler } from "../../utils/AsyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import MedicineParams from "../../models/medicine_params.model.js";

export const createMedicineParams = AsyncHandler(async (req, res) => {
  const { param_category, param_name } = req.body;
  try {
    const medicineParam = await MedicineParams.findOne({ param_name });
    if (medicineParam) {
      return sendResponse(res, 400, false, "Medicine Param already exists");
    }
    const newMedicineParam = new MedicineParams({
      param_category,
      param_name,
    });
    await newMedicineParam.save();
    return sendResponse(res, 201, true, "Medicine Param created successfully", {
      param_category: newMedicineParam.param_category,
      param_name: newMedicineParam.param_name,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
});

// use proper paginatin query param limit, page
export const getMedicineParams = AsyncHandler(async (req, res) => {
  try {
    // const medicineParams = await MedicineParams.find();
    // i want to get group by param_category
    const medicineParams = await MedicineParams.aggregate([
      {
        $group: {
          _id: "$param_category",
          params: {
            $push: {
              id: "$_id",
              param_name: "$param_name",
            },
          },
        },
      },
    ]);

    const transformedData = medicineParams.reduce((acc, current) => {
      acc[current._id] = current.params;
      return acc;
    }, {});
    return sendResponse(
      res,
      200,
      true,
      "Medicine Params fetched successfully",
      transformedData
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
});

export const getMedicineParam = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const medicineParam = await MedicineParams.findById(id);
    if (!medicineParam) {
      return sendResponse(res, 404, false, "Medicine Param not found");
    }
    return sendResponse(
      res,
      200,
      true,
      "Medicine Param fetched successfully",
      medicineParam
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
});

export const updateMedicineParam = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { param_category, param_name } = req.body;
  try {
    const medicineParam = await MedicineParams.findById(id);
    if (!medicineParam) {
      return sendResponse(res, 404, false, "Medicine Param not found");
    }
    medicineParam.param_category = param_category;
    medicineParam.param_name = param_name;
    await medicineParam.save();
    return sendResponse(res, 200, true, "Medicine Param updated successfully", {
      param_category: medicineParam.param_category,
      param_name: medicineParam.param_name,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
});

export const deleteMedicineParam = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const medicineParam = await MedicineParams.findById(id);
    if (!medicineParam) {
      return sendResponse(res, 404, false, "Medicine Param not found");
    }
    await medicineParam.remove();
    return sendResponse(res, 200, true, "Medicine Param deleted successfully");
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
});
