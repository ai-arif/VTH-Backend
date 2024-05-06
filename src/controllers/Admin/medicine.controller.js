import Medicine from "../../models/medicine.model";
import sendResponse from "../../utils/sendResponse";

export const addMedicine = async (req, res) => {
  try {
    const { name, price, quantity, description } = req.body;
    const newMedicine = new Medicine({ name, price, quantity, description });
    const newMed=await newMedicine.save();
    
    sendResponse(res, 200, true, "Successfully created medicine", newMed);
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, false, error.message);
  }
};

export const getMedicine = async (req, res) => {
    const page = parseInt(req.query.currentPage) || 1;
    const limit = parseInt(req.query.limit) || ''
    const sort = -1;
    try {
        const totalMedicine = await Medicine.countDocuments();
        const totalPages = Math.ceil(totalMedicine / limit);
    
        const medicines = await Medicine.find()
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: sort })
        .exec();
    
        sendResponse(res, 200, true, "Successfully fetched medicines", {
        totalMedicine,
        totalPages,
        currentPage: page,
        data: medicines,
        });
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
    }

export const updateMedicine = async (req, res) => {
    const { name, price, quantity, description } = req.body;
    const { id } = req.params;
    try {
        const existMedicine = await Medicine.findOne({ _id: id });
        if (!existMedicine) return res.json({ message: "Did not found the medicine" });
    
        await Medicine.updateOne({ _id: id }, { name, price, quantity, description });
        res.json({ message: "Successfully updated medicine" });
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

export const deleteMedicine = async (req, res) => {
    const { id } = req.params;
    try {
        const existMedicine = await Medicine.findOne({ _id: id });
        if (!existMedicine) return res.json({ message: "Did not found the medicine" });
    
        await Medicine.deleteOne({ _id: id });
        res.json({ message: "Successfully deleted medicine" });
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}


