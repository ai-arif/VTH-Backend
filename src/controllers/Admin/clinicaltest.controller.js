import ClinicalTest from "../../models/clinicaltest.model.js";
import sendResponse from "../../utils/sendResponse.js";


export const addTest = async (req, res) => {
  try {
    const { testName, testDetails } = req.body;
    const newClinicalTest = new ClinicalTest({testName,testDetails});
    await newClinicalTest.save();
   sendResponse(res, 200, true, "Successfully created clinical test");
  } catch (error) {
    console.log(error)
    return sendResponse(res, 500, false, error.message);
  }
};



export const getTest = async (req, res) => {
  try {
    const tests = await ClinicalTest.find()
    sendResponse(res,200,true,"Showing results",tests)
    
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};


export const updateTest = async (req, res) => {
    const { testName, testDetails } = req.body;
 
  try {

  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};
export const deleteTest = async (req, res) => {
  try {
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};
