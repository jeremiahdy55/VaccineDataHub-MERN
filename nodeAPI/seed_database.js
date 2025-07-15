require("dotenv").config(); // inject environment variables from .env
const mongoose = require("mongoose")
const faker = require("faker"); // used for making fake data

const VaccineModel = require("./models/vaccineModel");
const HospitalModel = require("./models/hospitalModel");
const DemographicDataModel = require("./models/demographicDataModel");
const UserModel = require("./models/userModel");
const AppointmentModel = require("./models/appointmentModel");
const { vaccine_seed_data, hospital_seed_data } = require("./seed_data");

// === Utility Functions ===
const genderOptions = ["Male", "Female", "Nonbinary", "Other"];
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

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDateWithin6Months() {
  const now = new Date();
  const range = 1000 * 60 * 60 * 24 * 30 * 6; // 6 months in ms
  return new Date(now.getTime() + Math.floor(Math.random() * range * 2) - range);
}

// === Seeding Script ===
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔗 Connected to MongoDB.");

    // Clear existing data
    await VaccineModel.deleteMany(); 
    await HospitalModel.deleteMany(); 
    await UserModel.deleteMany();
    await DemographicDataModel.deleteMany();
    await AppointmentModel.deleteMany();

    // Populate vaccine and hospital data
    await VaccineModel.insertMany(vaccine_seed_data);
    await HospitalModel.insertMany(hospital_seed_data);

    const vaccines = await VaccineModel.find();
    const hospitals = await HospitalModel.find();

    // Randomly generate a user with random demographic data
    for (let i = 0; i < 100; i++) {
      const username = faker.internet.userName() + i;
      const name = faker.name.findName();
      const password = "asdf";
      const email = faker.internet.email(username);
      const address = faker.address.streetAddress();
      const phoneNo = faker.phone.phoneNumber("##########");

      const age = faker.datatype.number({ min: 18, max: 90 });
      const gender = randomFromArray(genderOptions);
      const profession = faker.name.jobTitle();
      const ethnicity = faker.helpers.shuffle(ethnicities).slice(0, faker.datatype.number({ min: 1, max: 3 }));
      const medicalHistory = faker.helpers.shuffle(medicalConditions).slice(0, faker.datatype.number({ min: 0, max: 4 }));

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
      const numAppointments = faker.datatype.number({ min: 1, max: 3 });

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
    
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
})();
