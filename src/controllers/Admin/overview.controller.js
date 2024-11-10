import Admin from "../../models/admin.model.js";
import Appointment from "../../models/appointment.model.js";
import ClinicalTest from "../../models/clinicaltest.model.js";
import Complaint from "../../models/complaint.model.js";
import Department from "../../models/department.model.js";
import Medicine from "../../models/medicine.model.js";
import PatientRegistrationForm from "../../models/patient_registration_form.model.js";
import Pharmacy from "../../models/pharmacy.model.js";
import Prescription from "../../models/prescription.model.js";
import Species from "../../models/species.model.js";
import TestResult from "../../models/test_result.model.js";

import { User } from "../../models/user.model.js";
import sendResponse from "../../utils/sendResponse.js";

export const getOverview = async (req, res) => {
    const { start_date, end_date } = req.query;
    if (!start_date || !end_date) {
        return sendResponse(
            res,
            400,
            false,
            "Start date and end date are required"
        );
    }
    // Convert dates to ISO format if necessary
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    try {
        const staffsOverview = await Admin.aggregate([
            // {
            //     $match: {
            //         createdAt: { $gte: startDate, $lte: endDate }
            //     }
            // },
            {
                $group: { _id: "$role", total: { $sum: 1 } }
            },
            {
                $group: {
                    _id: null,
                    totalRoles: { $sum: 1 },
                    staffs: { $push: { dept: "$_id", members: "$total" } },
                    totalStuffs: { $sum: "$total" }
                }
            }
        ]);

        const { totalRoles, staffs, totalStuffs } = staffsOverview?.[0] || [];

        const users = await User.countDocuments();
        const departments = await Department.countDocuments();
        const clinicalTests = await ClinicalTest.countDocuments();
        const species = await Species.countDocuments();

        const complaintsOverview = await Complaint.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $lookup: {
                    from: 'species',
                    localField: 'species',
                    foreignField: '_id',
                    as: 'species'
                }
            },
            {
                $unwind: "$species"
            },
            {
                $group: {
                    _id: "$species.name",
                    complaintCount: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    speciesComplaints: { $push: { species: "$_id", count: "$complaintCount" } },
                    totalComplaints: { $sum: "$complaintCount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    speciesComplaints: 1,
                    totalComplaints: 1
                }
            }
        ]);

        const { speciesComplaints, totalComplaints } = complaintsOverview?.[0] || {};

        const medicines = await Medicine.countDocuments();
        const prescriptions = await Prescription.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } });
        const pharmacyOrders = await Pharmacy.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } });

        const AppointmentOverview = await Appointment.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $project: { department: 1 }
            },
            {
                $lookup: {
                    from: "departments",
                    localField: "department",
                    foreignField: "_id",
                    as: "department"
                }
            },
            { $unwind: "$department" },
            {
                $group: {
                    _id: "$department.name",
                    count: { $sum: 1 }
                }

            },
            {
                $group: {
                    _id: null,
                    allAppointments: { $push: { department: "$_id", count: "$count" } },
                    totalAppointment: { $sum: "$count" }
                }
            },

        ]);

        const { allAppointments, totalAppointment } = AppointmentOverview?.[0] || {};

        const testResults = await TestResult.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } });
        const totalPatientRegister = await PatientRegistrationForm.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } });


        // monthly data 
        const generateDates = (year, month) => {
            const dates = [];
            const date = new Date(year, month - 1, 1);
            const currentDate = new Date();

            while (date <= currentDate) {
                dates.push(new Date(date));
                date.setDate(date.getDate() + 1);
            }

            return dates;
        };

        const getDailyOrderStats = async () => {
            try {
                const dailyStats = await Pharmacy.aggregate([
                    {
                        $group: {
                            _id: {
                                year: { $year: "$createdAt" },
                                month: { $month: "$createdAt" },
                                day: { $dayOfMonth: "$createdAt" }
                            },
                            totalOrders: { $sum: 1 },
                            totalSales: { $sum: "$totalPrice" }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            date: {
                                $dateFromParts: {
                                    year: "$_id.year",
                                    month: "$_id.month",
                                    day: "$_id.day"
                                }
                            },
                            totalOrders: 1,
                            totalSales: 1
                        }
                    },
                    {
                        $sort: {
                            date: 1
                        }
                    }
                ]);

                return dailyStats;
            } catch (error) {
                console.error("Error aggregating daily stats:", error);
                throw error;
            }
        };


        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const formatDate = (isoDate) => {
            const dateParts = isoDate.split("-");
            const day = dateParts[2];
            const monthIndex = parseInt(dateParts[1]) - 1;
            const month = months[monthIndex];
            const year = dateParts[0];
            return `${day} ${month} ${year}`;
        };

        const mergeDailyStats = (allDates, dailyStats) => {
            const statsMap = new Map(dailyStats.map(stat => [stat.date.toISOString().split('T')[0], stat]));
            return allDates.map(date => {
                const isoDate = date.toISOString().split('T')[0];
                if (statsMap.has(isoDate)) {
                    const stat = statsMap.get(isoDate);
                    return { date: formatDate(isoDate), "Total Orders": stat.totalOrders, "Total Sales": stat.totalSales };
                } else {
                    return { date: formatDate(isoDate), "Total Orders": 0, "Total Sales": 0 };
                }
            });
        };

        const getCompleteDailyStats = async () => {
            try {
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1; // getMonth() returns month index from 0 (Jan) to 11 (Dec)

                const allDates = generateDates(year, month);
                const dailyStats = await getDailyOrderStats();

                const completeStats = mergeDailyStats(allDates, dailyStats);
                return completeStats;
            } catch (error) {
                console.error("Error getting complete daily stats:", error);
                throw error;
            }
        };
        const dailyOrders = await getCompleteDailyStats();

        // yearly data 
        const generateMonths = (year) => {
            const months = [];
            const currentDate = new Date();

            for (let month = 1; month <= currentDate.getMonth() + 1; month++) {
                months.push({ year, month });
            }

            return months;
        };

        const getMonthlyOrderStats = async () => {
            try {
                const monthlyStats = await Pharmacy.aggregate([
                    {
                        $group: {
                            _id: {
                                year: { $year: "$createdAt" },
                                month: { $month: "$createdAt" }
                            },
                            totalOrders: { $sum: 1 },
                            totalSales: { $sum: "$totalPrice" }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            year: "$_id.year",
                            month: "$_id.month",
                            totalOrders: 1,
                            totalSales: 1
                        }
                    },
                    {
                        $sort: {
                            year: 1,
                            month: 1
                        }
                    }
                ]);

                return monthlyStats;
            } catch (error) {
                console.error("Error aggregating monthly stats:", error);
                throw error;
            }
        };
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const mergeMonthlyStats = (allMonths, monthlyStats) => {
            const statsMap = new Map(monthlyStats.map(stat => [`${stat.year}-${String(stat.month).padStart(2, '0')}`, stat]));
            return allMonths.map(({ year, month }) => {
                const key = `${year}-${String(month).padStart(2, '0')}`;
                const monthName = monthNames[month - 1];
                if (statsMap.has(key)) {
                    const stat = statsMap.get(key);
                    return { year: stat.year, month: monthName, "Total Orders": stat.totalOrders, "Total Sales": stat.totalSales };
                } else {
                    return { year, month: monthName, "Total Orders": 0, "Total Sales": 0 };
                }
            });
        };

        const getCompleteMonthlyStats = async () => {
            try {
                const currentDate = new Date();
                const year = currentDate.getFullYear();

                const allMonths = generateMonths(year);
                const monthlyStats = await getMonthlyOrderStats();

                const completeStats = mergeMonthlyStats(allMonths, monthlyStats);
                return completeStats;
            } catch (error) {
                console.error("Error getting complete monthly stats:", error);
                throw error;
            }
        };

        const monthlyOrders = await getCompleteMonthlyStats();



        // result |=========================>
        // const result = { testResults };

        const result = {
            dailyOrders, monthlyOrders,
            totalRoles, staffs, totalStuffs, users, departments, clinicalTests,
            species, speciesComplaints, totalComplaints, medicines, allAppointments, totalAppointment,
            prescriptions, pharmacyOrders, testResults, totalPatientRegister
        };

        return sendResponse(
            res,
            200,
            true,
            "Overview retrieved successfully",
            result
        );
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}


export const getOverview2 = async (req, res) => {
    try {
        const { start_date, end_date, daysBefore } = req.query;
        // Convert start and end dates to ISO format
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        // Calculate today's date range (from midnight to the end of the day)
        const todaysDate = new Date();
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Function to subtract days from a date
        function subtractDays(date, days) {
            const result = new Date(date);
            result.setDate(result.getDate() - days);
            result.setHours(0, 0, 0, 0);
            return result;
        }
        const todayStart = subtractDays(todaysDate, parseInt(daysBefore) || 30);

        console.log({ todayStart, daysBefore })


        const SpeciesInfo = await Appointment.aggregate([
            {
                $match: {
                    createdAt: { $gte: todayStart, $lte: todayEnd },
                }
            },
            {
                $project: {
                    species: 1,
                    createdAt: 1
                }
            },
            {
                $lookup: {
                    from: "species",
                    localField: "species",
                    foreignField: "_id",
                    as: "species"
                }
            },
            { $unwind: "$species" },
            {
                $group: {
                    _id: { speciesName: "$species.name", date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.date",
                    speciesData: {
                        $push: {
                            speciesName: "$_id.speciesName",
                            count: "$count"
                        }
                    }
                }
            },
            { $sort: { _id: 1 } } // Sort by date
        ]);


        const SpeciesData = await Species.find().select("name");
        const speciesList = SpeciesData.map(species => species?.name)

        // Format the results into the desired structure
        const formattedData = SpeciesInfo.map(item => {
            const dateFormatted = item._id; // Date as string (YYYY-MM-DD)
            const speciesData = speciesList.map(species => {
                // Find the species count for this date
                const speciesRecord = item.speciesData.find(speciesRecord => speciesRecord.speciesName === species);
                return {
                    [species]: speciesRecord ? speciesRecord.count : 0
                };
            });
            const formattedObject = { date: dateFormatted, ...speciesData.reduce((acc, curr) => ({ ...acc, ...curr }), {}) };
            return formattedObject;
        });


        // Get the start and end of the last 12 months
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const twelveMonthsEnd = new Date();

        // Get Monthly Data for Last 12 Months
        const monthlyData = await Appointment.aggregate([
            {
                $match: {
                    createdAt: { $gte: twelveMonthsAgo, $lte: twelveMonthsEnd }, // Match within the last 12 months
                }
            },
            {
                $project: {
                    species: 1,
                    createdAt: 1
                }
            },
            {
                $lookup: {
                    from: "species",
                    localField: "species",
                    foreignField: "_id",
                    as: "species"
                }
            },
            { $unwind: "$species" },
            {
                $group: {
                    _id: { speciesName: "$species.name", month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } } }, // Use Year-Month format (e.g. 2023-11)
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.month",
                    speciesData: {
                        $push: {
                            speciesName: "$_id.speciesName",
                            count: "$count"
                        }
                    }
                }
            },
            { $sort: { _id: 1 } } // Sort by month (YYYY-MM format)
        ]);

        // Format the results for monthly data
        const formattedMonthlyData = monthlyData.map(item => {
            // const monthFormatted = item._id.replace("-", "/"); // Format as "Nov 2024"

            const [year, month] = item._id.split('-'); // Split year and month
            const date = new Date(`${year}-${month}-01`); // Create a Date object
            const options = { year: 'numeric', month: 'long' }; // Options for the format
            const monthFormatted = date.toLocaleDateString('en-US', options); // Format as 'August 2024'

            const speciesData = speciesList.map(species => {
                // Find the species count for this month
                const speciesRecord = item.speciesData.find(speciesRecord => speciesRecord.speciesName === species);
                return {
                    [species]: speciesRecord ? speciesRecord.count : 0
                };
            });
            const formattedObject = { month: monthFormatted, ...speciesData.reduce((acc, curr) => ({ ...acc, ...curr }), {}) };
            return formattedObject;
        });






        return res.status(200).json({
            success: true,
            data: { speciesList, Species: formattedData, monthlyData: formattedMonthlyData },
            // data: Species,
        });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// export const getOverview2 = async (req, res) => {
//     try {
//         const { start_date, end_date, daysBefore } = req.query;

//         // Convert start and end dates to ISO format
//         const startDate = new Date(start_date);
//         const endDate = new Date(end_date);

//         // Calculate today's date range (from midnight to the end of the day)
//         const todaysDate = new Date();
//         const todayEnd = new Date();
//         todayEnd.setHours(23, 59, 59, 999);

//         // Function to subtract days from a date
//         function subtractDays(date, days) {
//             const result = new Date(date);
//             result.setDate(result.getDate() - days);
//             result.setHours(0, 0, 0, 0);
//             return result;
//         }
//         const todayStart = subtractDays(todaysDate, parseInt(daysBefore) || 0);

//         // Get the start and end of the last 12 months
//         const twelveMonthsAgo = new Date();
//         twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
//         const twelveMonthsEnd = new Date();

//         const SpeciesInfo = await Appointment.aggregate([
//             {
//                 $match: {
//                     createdAt: { $gte: todayStart, $lte: todayEnd },
//                 }
//             },
//             {
//                 $project: {
//                     species: 1,
//                     createdAt: 1
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "species",
//                     localField: "species",
//                     foreignField: "_id",
//                     as: "species"
//                 }
//             },
//             { $unwind: "$species" },
//             {
//                 $group: {
//                     _id: { speciesName: "$species.name", date: { $dateToString: { format: "%d %b %Y", date: "$createdAt" } } },
//                     count: { $sum: 1 }
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$_id.date",
//                     speciesData: {
//                         $push: {
//                             speciesName: "$_id.speciesName",
//                             count: "$count"
//                         }
//                     }
//                 }
//             },
//             { $sort: { _id: 1 } } // Sort by date
//         ]);

//         // Get Monthly Data for Last 12 Months
//         const monthlyData = await Appointment.aggregate([
//             {
//                 $match: {
//                     createdAt: { $gte: twelveMonthsAgo, $lte: twelveMonthsEnd },
//                 }
//             },
//             {
//                 $project: {
//                     species: 1,
//                     createdAt: 1
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "species",
//                     localField: "species",
//                     foreignField: "_id",
//                     as: "species"
//                 }
//             },
//             { $unwind: "$species" },
//             {
//                 $group: {
//                     _id: { speciesName: "$species.name", month: { $dateToString: { format: "%b-%Y", date: "$createdAt" } } },
//                     count: { $sum: 1 }
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$_id.month",
//                     speciesData: {
//                         $push: {
//                             speciesName: "$_id.speciesName",
//                             count: "$count"
//                         }
//                     }
//                 }
//             },
//             { $sort: { _id: 1 } } // Sort by month
//         ]);

//         // Get species list
//         const SpeciesData = await Species.find().select("name");
//         const speciesList = SpeciesData.map(species => species?.name);

//         // Format the results into the desired structure for daily data
//         const formattedData = SpeciesInfo.map(item => {
//             const dateFormatted = item._id; // Date formatted as "10 Nov 2024"
//             const speciesData = speciesList.map(species => {
//                 // Find the species count for this date
//                 const speciesRecord = item.speciesData.find(speciesRecord => speciesRecord.speciesName === species);
//                 return {
//                     [species]: speciesRecord ? speciesRecord.count : 0
//                 };
//             });
//             const formattedObject = { date: dateFormatted, ...speciesData.reduce((acc, curr) => ({ ...acc, ...curr }), {}) };
//             return formattedObject;
//         });

//         // Format the results for monthly data
//         const formattedMonthlyData = monthlyData.map(item => {
//             const monthFormatted = item._id; // Month formatted as "Nov-2024"
//             const speciesData = speciesList.map(species => {
//                 // Find the species count for this month
//                 const speciesRecord = item.speciesData.find(speciesRecord => speciesRecord.speciesName === species);
//                 return {
//                     [species]: speciesRecord ? speciesRecord.count : 0
//                 };
//             });
//             const formattedObject = { month: monthFormatted, ...speciesData.reduce((acc, curr) => ({ ...acc, ...curr }), {}) };
//             return formattedObject;
//         });

//         return res.status(200).json({
//             success: true,
//             data: { speciesList, Species: formattedData, MonthlyData: formattedMonthlyData },
//         });
//     } catch (error) {
//         console.error("Error fetching appointments:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//         });
//     }
// };
