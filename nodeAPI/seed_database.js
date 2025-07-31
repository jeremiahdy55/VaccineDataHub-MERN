import dotenv from "dotenv";
dotenv.config(); // inject environment variables from .env

import { connect, disconnect } from "mongoose";
import pkg from "faker"; // used for making fake data
const { internet, name: _name, address: _address, phone, datatype, helpers } = pkg;

import VaccineModel from "./models/vaccineModel.js";
import HospitalModel from "./models/hospitalModel.js";
import DemographicDataModel from "./models/demographicDataModel.js";
import UserModel from "./models/userModel.js";
import AppointmentModel from "./models/appointmentModel.js";
import { vaccine_seed_data, hospital_seed_data } from "./seed_data.js";

// === Utility Functions ===
const genderOptions = ["Male", "Female", "Nonbinary", "Other"];
const genderProbabilities = [0.45, 0.45, 0.07, 0.03]
const ethnicities = [
  "American Indian or Alaska Native",
  "Asian - East Asian",
  "Asian - South Asian",
  "Asian - Southeast Asian",
  "Black or African American",
  "Hispanic or Latino",
  "Middle Eastern or North African (MENA)",
  "Native Hawaiian or Other Pacific Islander",
  "White",
  "Multiracial or Multiethnic",
  "Other",
  "Prefer not to say",
];
const medicalConditions = [
  "Anemia",
  "Asthma",
  "Diabetes",
  "Hypertension",
  "High cholesterol",
  "Low blood pressure",
  "Hypoglycemia",
  "Arthritis",
  "Depression",
  "Anxiety",
  "Allergies",
  "Migraines",
  "Heart disease",
  "Obesity",
  "Chronic pain",
  "Epilepsy",
  "GERD",
  "Thyroid disorder",
  "Autoimmune disorder",
  "Cancer (remission)",
];

const professionOptions = [
  "Education",
  "Technology",
  "Healthcare",
  "Finance",
  "Construction / Trades",
  "Retail / Customer Service",
  "Hospitality",
  "Transportation",
  "Government",
  "Arts / Media",
  "Student",
  "Unemployed",
  "Retired",
  "Other"
];

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function weightedRandom(items, weights) {
  const total = weights.reduce((acc, w) => acc + w, 0);
  const rnd = Math.random() * total;
  let sum = 0;

  for (let i = 0; i < items.length; i++) {
      sum += weights[i];
      if (rnd < sum) return items[i];
  }
}

function getRandomDateWithin6Months() {
  const now = new Date();
  const range = 1000 * 60 * 60 * 24 * 30 * 6; // 6 months in ms
  return new Date(now.getTime() + Math.floor(Math.random() * range * 2) - range);
}

// === Seeding Script ===
(async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log("🔗 Connected to MongoDB.");

    // Clear existing data
    await VaccineModel.deleteMany(); 
    await HospitalModel.deleteMany(); 
    await DemographicDataModel.deleteMany();
    await UserModel.deleteMany();
    await AppointmentModel.deleteMany();

    // Populate vaccine and hospital data
    await VaccineModel.insertMany(vaccine_seed_data);
    await HospitalModel.insertMany(hospital_seed_data);

    const vaccines = await VaccineModel.find();
    const hospitals = await HospitalModel.find();

    // Randomly generate a user with random demographic data
    for (let i = 0; i < 1000; i++) {
      const username = internet.userName() + i;
      const name = _name.findName();
      const password = "asdf";
      const email = internet.email(username);
      const address = _address.streetAddress();
      const phoneNo = phone.phoneNumber("##########");

      const age = datatype.number({ min: 18, max: 90 });
      const gender = weightedRandom(genderOptions, genderProbabilities);
      const profession = randomFromArray(professionOptions);
      const ethnicity = (Math.random() < 0.5) 
                          ? helpers.shuffle(ethnicities).slice(0, datatype.number({ min: 1, max: 4 }))
                          : ["Prefer not to say"];
      const medicalHistory = helpers.shuffle(medicalConditions).slice(0, datatype.number({ min: 0, max: 4 }));

      const user = await UserModel.create({
        username,
        name,
        password,
        address,
        phoneNo,
        email,
      });

      const demographic = await DemographicDataModel.create({
        userId: user._id,
        age,
        gender,
        profession,
        medicalHistory,
        ethnicity,
      });

      user.demographicData = demographic._id;
      await user.save();

      // each user has 1-3 appointments
      const numAppointments = datatype.number({ min: 3, max: 5 });

      for (let j = 0; j < numAppointments; j++) {
        const vaccine = randomFromArray(vaccines);
        const hospital = randomFromArray(hospitals);
        const appointmentDate = getRandomDateWithin6Months();
        const isPast = appointmentDate < new Date();

        await AppointmentModel.create({
          appointmentDate,
          userId: user._id,
          hospitalId: hospital._id,
          vaccineId: vaccine._id,
          approved: true,
          paid: isPast,
        });
      }

      if ((i + 1) % 20 === 0) {
        console.log(`Seeded ${i + 1} users...`);
      }
    }

    const adminUser = await UserModel.create({
      username: "admin",
      name: "Administrator",
      password: "admin",
      address: "N/A",
      phoneNo: "0000000000",
      email: "admin@avaa.health.org",
      adminPrivilege: true,
    });

    console.log("Finished seeding data!");
  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    
    await disconnect();
    console.log("Disconnected from MongoDB.");
  }
})();
