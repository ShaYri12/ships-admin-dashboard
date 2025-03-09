import User from "../models/user.model.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import config from "../config/config.js";

const initializeAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log("Connected to MongoDB for admin initialization");

    // Check if admin exists
    const adminExists = await User.findOne({
      email: "admin@ships.com",
      role: "admin",
    });

    if (adminExists) {
      console.log("Default admin already exists");
      await mongoose.disconnect();
      return;
    }

    // Create default admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    const admin = new User({
      name: "admin",
      email: "admin@ships.com",
      password: hashedPassword,
      role: "admin",
      status: "active",
      createdBy: null, // Since this is the first admin
    });

    await admin.save();
    console.log("Default admin created successfully");

    // Disconnect from MongoDB
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error initializing admin:", error);
    process.exit(1);
  }
};

// Run the initialization
initializeAdmin();
