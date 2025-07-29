import { Router } from "express";
const demographicDataRouter = Router({
  strict: true,
  caseSensitive: true,
});
import { find } from "../models/demographicDataModel";
import { isAuthorized } from "../jwtauth/JWTAuth";

// Get all demographic data
demographicDataRouter.get("/getDemographicData", async (req, res) => {
  try {
    // return simple array of simple JSON objects WITHOUT userId
    const demoData = await find().lean();
    res.status(200).json({ demographicData: demoData });
  } catch (err) {
    res.status(500).json({error: "Error retrieving demographic data"});
  }
});

// filter demographic data based on filter object
// NOTE: (the JWT token needs to be associated with a user with adminPrivileges:true)
demographicDataRouter.post(
  "/getDemographicDataWithFilter",
  isAuthorized,
  async (req, res) => {
    // Check that the user exists and has admin privileges in DB
    const user = await UserModel.findById(req.user.id).lean();
    if (!user)
      return res.status(404).json({ error: "Invalid userId, not found" });
    if (!user.adminPrivilege)
      return res
        .status(403)
        .json({ error: "User does not have administrative privileges" });

    let {
      ageMin,
      ageMax,
      genders,
      professions,
      medicalHistoryTerms,
      ethnicities,
    } = req.body;

    /// Construct the filter object
    const filter = {};

    // age, NOTE: create filter.age object ONCE (using only one conditional)
    if (ageMin !== undefined || ageMax !== undefined) {
      filter.age = {};
      if (ageMin !== undefined) filter.age.$gte = ageMin;
      if (ageMax !== undefined) filter.age.$lte = ageMax;
    }

    // gender
    if (Array.isArray(genders) && genders.length > 0) {
      filter.gender = { $in: genders };
    }

    // ethnicity
    if (Array.isArray(ethnicities) && ethnicities.length > 0) {
      filter.ethnicity = { $in: ethnicities };
    }

    // profession
    if (Array.isArray(professions) && professions.length > 0) {
      filter.profession = { $in: professions }; // ✅ correct key: singular
    }

    // medicalHistory
    if (Array.isArray(medicalHistoryTerms) && medicalHistoryTerms.length > 0) {
      filter.medicalHistory = { $in: medicalHistoryTerms };
    }

    // find all data that fits the filter that was passed
    try {
      const demoData = await find(filter).lean(); // return simple JSON object, not Mongo Obj
      res.status(200).json({ demographicData: demoData });
    } catch (err) {
      res.status(500).json({error: "Error retrieving demographic data"});
    }
  }
);

export default demographicDataRouter;
