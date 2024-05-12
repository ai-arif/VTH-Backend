import AppointmentTest from "../../models/appointment_test.model.js";
import ClinicalTest from "../../models/clinicaltest.model.js";
import TestSubParameter from "../../models/sub_parameter.model.js";
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


// TEST PARAMETER

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



export const getParameter = async(req,res)=> {
  try{
    const {id} = req.params
    const parameters = await TestParameter.find({test:id})
    sendResponse(res, 200, true, "Successfully fetched parameter",{data:parameters});
  }catch(error){
    sendResponse(res,500,false,error.message)
  }
}


export const deleteParameter = async(req,res)=> {
  try{
    const {id} = req.params
    await TestParameter.deleteOne({_id:id})
    sendResponse(res, 200, true, "Successfully deleted parameter");
  }catch(error){
    sendResponse(res,500,false,error.message)
  }
}


export const updateParameter = async(req,res)=> {
  try{
    const {id} = req.params
    await TestParameter.updateOne({_id:id},{...req.body})
    sendResponse(res, 200, true, "Successfully updated parameter");
  }catch(error){
    sendResponse(res,500,false,error.message)
  }
}




//SUB PARAMETER
export const AddSubParameter = async(req,res)=> {
  try{
    const {sub_parameter_type,text,check,test_parameter} = req.body
     console.log(req.body)
    const newSubParameter = new TestSubParameter({
      sub_parameter_type,
      text,
      check,
      test_parameter
    })
    await newSubParameter.save()
    sendResponse(res, 200, true, "Successfully added sub parameter");
  }catch(error){
    sendResponse(res,500,false,error.message)
  }
}


export const getAllSubParameter = async(req,res)=> {
  try{
    const sub_parameters = await TestSubParameter.find()
    sendResponse(res, 200, true, "Successfully fetched sub parameter",{data:sub_parameters});
  
  }catch(error){
    sendResponse(res,500,false,error.message)
  }
}



export const getSubParameter = async(req,res)=> {
  try{
    const {id} = req.params
    const sub_parameter = await TestSubParameter.find({test_parameter:id})
    sendResponse(res, 200, true, "Successfully fetched sub parameter",{data:sub_parameter});
  }catch(error){
    sendResponse(res,500,false,error.message)
  }
}



export const deleteSubParameter = async(req,res)=> {
  try{
    const {id} = req.params
    await TestSubParameter.deleteOne({_id:id})
    sendResponse(res, 200, true, "Successfully deleted sub parameter");
  }catch(error){
    sendResponse(res,500,false,error.message)
  }
}


export const updateSubParameter = async(req,res)=> {
  try{
    const {id} = req.params
    await TestSubParameter.updateOne({_id:id},{...req.body})
    sendResponse(res, 200, true, "Successfully updated sub parameter");
  }catch(error){
    sendResponse(res,500,false,error.message)
  }
}



//APPOINTMENT TEST
export const AddAppointmentTest = async(req,res)=> {
  try{
     const newAppointmentTest = new AppointmentTest({...req.body})
     await newAppointmentTest.save()

    sendResponse(res, 200, true, "Successfully created appointment test");
  }catch(error){
    sendResponse(res,500,false,error.message)
  }
}