import { Schema, model } from "mongoose";
import { genSalt, hash, compare } from "bcryptjs"; // for password hashing
const schemaObj = Schema;

const userSchema = new schemaObj(
  {
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    address: { type: String, required: true, trim: true },
    phoneNo: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // auto-convert to lowercase
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        "Please enter a valid email address",
      ],
    },
    demographicData: {
      type: Schema.Types.ObjectId,
      ref: "demographicData",
    },
    adminPrivilege: {type: Boolean, default: false}
    //medicalId: {type: String, required: true} // this would be used for linking with other db's or medical records
  },
  {
    minimize: false,
    versionKey: false,
  }
);

// Encrypt/hash the password
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next(); // only hash if new/changed

  try {
    const salt = await genSalt(10); // 10 rounds of salting
    user.password = await hash(user.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// When logging in, compare the plain-text password with the salted/hashed password
// on file. The hashed password is validated with bcrypt taking care of matching the
// the plain-text to hashed.
userSchema.methods.comparePassword = async function (inputPassword) {
  return await compare(inputPassword, this.password);
};

const UserModel = model("user", userSchema); // MongoDB will pluralize
export default UserModel;
