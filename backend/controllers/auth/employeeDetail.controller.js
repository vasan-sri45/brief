import mongoose from "mongoose";
import PersonalDetails from "../../models/auth/employeeDetails.model.js";

// CREATE or UPDATE personal details
export const upsertPersonalDetails = async (req, res) => {
  try {
    const employeeId = req.user._id;

    const personalDetails = await PersonalDetails.findOneAndUpdate(
      { employee: employeeId },
      {
        employee: employeeId,
        fatherName: req.body.fatherName,
        motherName: req.body.motherName,
        address: req.body.address,
        location: req.body.location,
        panNo: req.body.panNo,
        accountNo: req.body.accountNo,
        ifscNo: req.body.ifscNo,
        bankName: req.body.bankName,
        branchName: req.body.branchName,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Personal details saved successfully",
      personalDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET logged-in employee personal details
// export const getMyPersonalDetails = async (req, res) => {
//   try {
//     const employeeId = req.user;

//     const personalDetails = await PersonalDetails.findOne({
//       employee: employeeId,
//     });

//     res.status(200).json({
//       success: true,
//       personalDetails,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


export const getMyPersonalDetails = async (req, res) => {
  try {
    const employeeId = req.user;

    const personalDetails =
      await PersonalDetails.aggregate([
        {
          $match: {
            employee:
              new mongoose.Types.ObjectId(
                employeeId
              ),
          },
        },

        {
          $lookup: {
            from: "employees",
            localField: "employee",
            foreignField: "_id",
            as: "employeeDetails",
          },
        },

        {
          $unwind: "$employeeDetails",
        },

        {
          $project: {
            _id: 1,

            fatherName: 1,
            motherName: 1,
            address: 1,
            location: 1,
            panNo: 1,
            accountNo: 1,
            ifscNo: 1,
            bankName: 1,
            branchName: 1,

            employeeName:
              "$employeeDetails.name",

            employeeCode:
              "$employeeDetails.employee_id",

            employeeEmail:
              "$employeeDetails.email",

            employeeMobile:
              "$employeeDetails.mobile",
          },
        },
      ]);

    res.status(200).json({
      success: true,

      personalDetails:
        personalDetails[0] || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};