import ClinicalTest from "../../models/clinicaltest.model.js";
import TestParameter from "../../models/test_parameter.model.js";
import sendResponse from "../../utils/sendResponse.js";
import { faker } from "@faker-js/faker";

export const addTest = async (req, res) => {
  try {
    const { testName, testDetails } = req.body;
    const newClinicalTest = new ClinicalTest({ testName, testDetails });
    const newTest=await newClinicalTest.save();
    
    sendResponse(res, 200, true, "Successfully created clinical test", newTest);
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, false, error.message);
  }
};

export const getTest = async (req, res) => {
  const page = parseInt(req.query.currentPage) || 1;
  const limit = parseInt(req.query.limit) || ''
  const sort = -1;
  try {
    const totalTest = await ClinicalTest.countDocuments();
    const totalPages = Math.ceil(totalTest / limit);

    const tests = await ClinicalTest.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: sort })
      .exec();

    // res.json({
    //   totalTest,
    //   totalPages,
    //   currentPage: page,
    //   data: tests,
    // });
    sendResponse(res, 200, true, "Successfully fetched clinical tests", {
      totalTest,
      totalPages,
      currentPage: page,
      data: tests,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const updateTest = async (req, res) => {
  const { testName, testDetails } = req.body;
  const { id } = req.params;
  try {
    const existTest = await ClinicalTest.findOne({ _id: id });
    if (!existTest) return res.json({ message: "Did not found the test" });

    await ClinicalTest.updateOne({ _id: id }, { testName, testDetails });
    res.json({ message: "Successfully updated test" });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const deleteTest = async (req, res) => {
  const { id } = req.params;
  try {
    const existTest = await ClinicalTest.findOne({ _id: id });
    if (!existTest) return res.json({ message: "Did not found the test" });

    await ClinicalTest.deleteOne({ _id: id });
    sendResponse(res, 200, true, "Successfully deleted clinical test");
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};



export const AddParameter = async(req,res)=> {
  try{
    const {name,testId} = req.body
    const newParameter = new TestParameter({name,test:testId})
    await newParameter.save()
    sendResponse(res, 200, true, "Successfully added parameter");
  }catch(error){
    sendResponse(res,500,false,error.message)
  }
}



