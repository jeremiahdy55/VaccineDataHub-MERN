const express = require("express");
const userRouter = express.Router({ strict: true, caseSensitive: true });
const UserModel = require("../models/userModel");
const DemographicDataModel = require("../models/demographicDataModel")

userRouter.post("/register", async (req, res) => {
    const userObj = req.body;
    const {username, name, password, address, email, phoneNo} = userObj; // get user data fields
    const {age, gender, profession, medicalHistory, ethnicity} = userObj; // get demographic data fields
  try {
    const user = new UserModel({username, name, password, address, email, phoneNo});
    await user.save();
    const demographicData = new DemographicDataModel({userId: user._id, age, gender, profession, medicalHistory, ethnicity});
    await demographicData.save();
    user.demographicData = demographicData._id;
    await user.save();
    res.status(201).json([user, demographicData]);
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).send("Error creating user");
  }
});

module.exports = userRouter;
