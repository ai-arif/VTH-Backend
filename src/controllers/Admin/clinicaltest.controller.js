import ClinicalTest from "../../models/clinicaltest.model.js";
import sendResponse from "../../utils/sendResponse.js";
import { faker } from "@faker-js/faker";

export const addTest = async (req, res) => {
  try {
    const { testName, testDetails } = req.body;
    const newClinicalTest = new ClinicalTest({ testName, testDetails });
    await newClinicalTest.save();
    // let dummyData = []
    // for(let i=0;i<50;i++){
    //    dummyData.push({
    //        testName: faker.person.fullName(),
    //        testDetails: faker.lorem.lines({ min: 1, max: 5})
    //    })
    // }
    // await ClinicalTest.insertMany(dummyData)
    sendResponse(res, 200, true, "Successfully created clinical test");
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, false, error.message);
  }
};

export const getTest = async (req, res) => {
  const page = parseInt(req.query.currentPage) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = -1;
  try {
    const totalTest = await ClinicalTest.countDocuments();
    const totalPages = Math.ceil(totalTest / limit);

    const tests = await ClinicalTest.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: sort })
      .exec();

    res.json({
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
