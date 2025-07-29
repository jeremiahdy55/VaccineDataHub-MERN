import { Router } from "express";
import { compare } from "bcryptjs";
const userRouter = Router({ strict: true, caseSensitive: true });
import UserModel, { findOne } from "../models/userModel";
import DemographicDataModel from "../models/demographicDataModel";
import { generateToken, isAuthorized } from "../jwtauth/JWTAuth";

// Register the user and log them in
userRouter.post("/register", async (req, res) => {
  const userObj = req.body;
  console.log({userObj})

  const { username, name, password, address, email, phoneNo } = userObj; // get user data fields
  const { age, gender, profession, medicalHistory, ethnicity } = userObj; // get demographic data fields
  try {
    const user = new UserModel({
      username,
      name,
      password,
      address,
      email,
      phoneNo,
    });
    await user.save();
    const demographicData = new DemographicDataModel({
      userId: user._id,
      age,
      gender,
      profession,
      medicalHistory,
      ethnicity,
    });
    await demographicData.save();
    user.demographicData = demographicData._id;
    await user.save();

    // Generate JWT token
    const token = generateToken(user);
    res.setHeader("x-access-token", token); // send it back in header
    res.json({
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        address: user.address,
        phoneNo: user.phoneNo,
        demographicData: user.demographicData,
        adminPrivilege: user.adminPrivilege,
      },
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).send("Error creating user");
  }
});

// Wrapper function to check if the user is authorized (via a valid JWT token check)
// Called on secure content component load
userRouter.get("/check", (req, res) => {
  isAuthorized(req, res, () => {
    // If this callback runs, user is authorized
    res.json({ authenticated: true, user: req.user });
  });
});

// login in the user and return a token in the body
userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await findOne({ username }).lean();
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare hashed password
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Send token and user info
    res.setHeader("x-access-token", token); // send it back in header
    res.json({
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        address: user.address,
        phoneNo: user.phoneNo,
        demographicData: user.demographicData,
        adminPrivilege: user.adminPrivilege,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error during login");
  }
});

export default userRouter;
