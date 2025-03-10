import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const resetAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Delete existing admin
    console.log("Deleting existing admin...");
    await User.deleteOne({ email: "admin@ships.com" });

    // Create new admin
    console.log("Creating new admin...");

    // Create password hash
    const plainPassword = "admin123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // Verify the hash is working
    const verifyHash = await bcrypt.compare(plainPassword, hashedPassword);
    console.log("Password hash verification:", verifyHash);

    // Create a temporary ObjectId
    const tempAdminId = new mongoose.Types.ObjectId();

    const admin = new User({
      name: "admin",
      email: "admin@ships.com",
      password: hashedPassword,
      role: "admin",
      status: "active",
      createdBy: tempAdminId,
    });

    // Save without triggering the password hash middleware
    await admin.save();

    // Test password comparison
    const testCompare = await bcrypt.compare(plainPassword, admin.password);
    console.log("Password test after save:", testCompare);

    // Update the admin to set createdBy to their own ID
    await User.findByIdAndUpdate(admin._id, {
      createdBy: admin._id,
    });

    // Verify final state
    const savedAdmin = await User.findById(admin._id);
    console.log("Admin reset successful. New admin details:", {
      id: savedAdmin._id,
      email: savedAdmin.email,
      role: savedAdmin.role,
      status: savedAdmin.status,
      hasPassword: !!savedAdmin.password,
      passwordLength: savedAdmin.password.length,
    });

    // Final password verification
    const finalCheck = await bcrypt.compare(plainPassword, savedAdmin.password);
    console.log("Final password verification:", finalCheck);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("Error resetting admin:", error);
    process.exit(1);
  }
};

resetAdmin();
