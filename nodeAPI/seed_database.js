require("dotenv").config(); // inject environment variables from .env
const mongoose = require("mongoose")
const VaccineModel = require("./models/vaccineModel");
const HospitalModel = require("./models/hospitalModel");
const seed_vaccine_data = [
  {
    name: "Pfizer-BioNTech COVID-19 Vaccine",
    abbreviation: "BNT162b2",
    type: "mRNA",
    price: 19.50,
    sideEffects: ["Fatigue", "Headache", "Muscle pain", "Chills"],
    origin: "USA",
    dosesRequired: 2,
    info: {
      strainsCovered: ["SARS-CoV-2", "Omicron BA.4/BA.5", "Delta"]
    }
  },
  {
    name: "Moderna COVID-19 Vaccine",
    abbreviation: "mRNA-1273",
    type: "mRNA",
    price: 25.00,
    sideEffects: ["Injection site pain", "Fever", "Chills"],
    origin: "USA",
    dosesRequired: 2,
    info: {
      strainsCovered: ["SARS-CoV-2", "Omicron XBB", "Alpha"]
    }
  },
  {
    name: "Johnson & Johnson COVID-19 Vaccine",
    abbreviation: "Ad26.COV2.S",
    type: "Viral Vector",
    price: 10.00,
    sideEffects: ["Fatigue", "Nausea", "Fever"],
    origin: "USA",
    dosesRequired: 1,
    info: {
      strainsCovered: ["SARS-CoV-2"]
    }
  },
  {
    name: "BCG Tuberculosis Vaccine",
    abbreviation: "BCG",
    type: "Live Attenuated",
    price: 1.00,
    sideEffects: ["Injection site abscess", "Mild fever"],
    origin: "France",
    dosesRequired: 1,
    info: {
      strainsCovered: ["Mycobacterium tuberculosis"]
    }
  },
  {
    name: "Hepatitis B Vaccine",
    abbreviation: "HBV",
    type: "Protein Subunit",
    price: 18.00,
    sideEffects: ["Redness at injection site", "Fever"],
    origin: "USA",
    dosesRequired: 3,
    info: {
      strainsCovered: ["Hepatitis B virus"]
    }
  },
  {
    name: "Inactivated Polio Vaccine",
    abbreviation: "IPV",
    type: "Inactivated",
    price: 3.00,
    sideEffects: ["Injection site tenderness"],
    origin: "Belgium",
    dosesRequired: 4,
    info: {
      strainsCovered: ["Poliovirus types 1, 2, 3"]
    }
  },
  {
    name: "Diphtheria, Tetanus, Pertussis Vaccine",
    abbreviation: "DTP",
    type: "Toxoid",
    price: 2.00,
    sideEffects: ["Fever", "Irritability", "Swelling at injection site"],
    origin: "India",
    dosesRequired: 3,
    info: {
      strainsCovered: ["Corynebacterium diphtheriae", "Clostridium tetani", "Bordetella pertussis"]
    }
  },
  {
    name: "Human Papillomavirus Vaccine (Gardasil 9)",
    abbreviation: "HPV",
    type: "Protein Subunit",
    price: 140.00,
    sideEffects: ["Headache", "Dizziness", "Pain at injection site"],
    origin: "USA",
    dosesRequired: 2,
    info: {
      strainsCovered: ["HPV types 6, 11, 16, 18, 31, 33, 45, 52, 58"]
    }
  },
  {
    name: "Ebola Vaccine (Ervebo)",
    abbreviation: "rVSV-ZEBOV",
    type: "Viral Vector",
    price: 100.00,
    sideEffects: ["Arthralgia", "Fatigue", "Headache"],
    origin: "Germany",
    dosesRequired: 1,
    info: {
      strainsCovered: ["Zaire ebolavirus"]
    }
  },
  {
    name: "Typhoid Vaccine (Typbar-TCV)",
    abbreviation: "TCV",
    type: "Protein Subunit",
    price: 2.50,
    sideEffects: ["Fever", "Nausea", "Headache"],
    origin: "India",
    dosesRequired: 1,
    info: {
      strainsCovered: ["Salmonella Typhi"]
    }
  },
  {
    name: "Japanese Encephalitis Vaccine (Ixiaro)",
    abbreviation: "JE-VC",
    type: "Inactivated",
    price: 120.00,
    sideEffects: ["Muscle ache", "Redness at injection site"],
    origin: "Austria",
    dosesRequired: 2,
    info: {
      strainsCovered: ["Japanese encephalitis virus"]
    }
  },
  {
    name: "Smallpox Vaccine (ACAM2000)",
    abbreviation: "ACAM",
    type: "Live Attenuated",
    price: 5.00,
    sideEffects: ["Fever", "Swollen lymph nodes", "Fatigue"],
    origin: "USA",
    dosesRequired: 1,
    info: {
      strainsCovered: ["Variola virus"]
    }
  },
  {
    name: "Anthrax Vaccine (BioThrax)",
    abbreviation: "AVA",
    type: "Toxoid",
    price: 80.00,
    sideEffects: ["Soreness", "Fatigue", "Joint pain"],
    origin: "USA",
    dosesRequired: 5,
    info: {
      strainsCovered: ["Bacillus anthracis"]
    }
  },
  {
    name: "ZyCoV-D COVID-19 Vaccine",
    abbreviation: "ZyCoV-D",
    type: "DNA-Based",
    price: 4.00,
    sideEffects: ["Pain at injection site", "Headache", "Low-grade fever"],
    origin: "India",
    dosesRequired: 3,
    info: {
      strainsCovered: ["SARS-CoV-2"]
    }
  },
  {
    name: "Cholera Vaccine (Vaxchora)",
    abbreviation: "VCX",
    type: "Other",
    price: 30.00,
    sideEffects: ["Abdominal pain", "Diarrhea", "Fatigue"],
    origin: "USA",
    dosesRequired: 1,
    info: {
      strainsCovered: ["Vibrio cholerae O1"]
    }
  },
  {
    name: "Tick-Borne Encephalitis Vaccine (FSME-IMMUN)",
    abbreviation: "TBE",
    type: "Inactivated",
    price: 75.00,
    sideEffects: ["Fever", "Joint pain", "Nausea"],
    origin: "Austria",
    dosesRequired: 3,
    info: {
      strainsCovered: ["Tick-borne encephalitis virus"]
    }
  }
];

const seed_hospital_data = [
  {
    "name": "Govt General Hospital",
    "address": "123 Main St",
    "type": "Govt",
    "serviceCharge": 0
  },
  {
    "name": "City Health Center",
    "address": "456 Elm St",
    "type": "Govt",
    "serviceCharge": 20
  },
  {
    "name": "Public Care Hospital",
    "address": "789 Oak St",
    "type": "Govt",
    "serviceCharge": 10
  },
  {
    "name": "Metro Govt Hospital",
    "address": "321 Pine St",
    "type": "Govt",
    "serviceCharge": 15
  },
  {
    "name": "Regional Medical Center",
    "address": "654 Cedar St",
    "type": "Govt",
    "serviceCharge": 5
  },
  {
    "name": "District Wellness Center",
    "address": "987 Birch St",
    "type": "Govt",
    "serviceCharge": 25
  },
  {
    "name": "Sunshine Private Hospital",
    "address": "111 Maple St",
    "type": "Private",
    "serviceCharge": 75
  },
  {
    "name": "Silverline Clinic",
    "address": "222 Walnut St",
    "type": "Private",
    "serviceCharge": 99
  },
  {
    "name": "Elite Health Hospital",
    "address": "333 Chestnut St",
    "type": "Private",
    "serviceCharge": 59
  },
  {
    "name": "CareFirst Medical",
    "address": "444 Spruce St",
    "type": "Private",
    "serviceCharge": 110
  }
];

// use mongoDB <MODEL NAME>.insertMany(<SEED DATA VARIABLE>) to seed data on first run

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await VaccineModel.deleteMany(); // optional: clears existing data
  await VaccineModel.insertMany(seed_vaccine_data);
  await HospitalModel.deleteMany(); // optional: clears existing data
  await HospitalModel.insertMany(seed_hospital_data);
  console.log("Database seeded.");
  mongoose.disconnect();
});