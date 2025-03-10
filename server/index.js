import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import User from "./models/user.model.js";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();

// Function to initialize default admin
const initializeDefaultAdmin = async () => {
  try {
    console.log("Checking for existing admin...");
    const adminExists = await User.findOne({
      email: "admin@ships.com",
      role: "admin",
    });

    if (!adminExists) {
      console.log("No admin found, creating default admin...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);

      // Create a temporary ObjectId for the first admin
      const tempAdminId = new mongoose.Types.ObjectId();

      const admin = new User({
        name: "admin",
        email: "admin@ships.com",
        password: hashedPassword,
        role: "admin",
        status: "active",
        createdBy: tempAdminId, // Set the admin as their own creator
      });

      await admin.save();
      console.log("Admin saved with initial data:", {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        status: admin.status,
        hasPassword: !!admin.password,
      });

      // Update the admin to set createdBy to their own ID
      await User.findByIdAndUpdate(admin._id, {
        createdBy: admin._id,
      });

      console.log("Default admin created and updated successfully");
    } else {
      console.log("Existing admin found:", {
        id: adminExists._id,
        email: adminExists.email,
        role: adminExists.role,
        status: adminExists.status,
        hasPassword: !!adminExists.password,
      });
    }
  } catch (error) {
    console.error("Error initializing admin:", error);
  }
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Error handling
app.use(errorHandler);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Initialize default admin after connection
    await initializeDefaultAdmin();

    const startServer = (port) => {
      try {
        app
          .listen(port, () => {
            console.log(`Server running on port ${port}`);
          })
          .on("error", (err) => {
            if (err.code === "EADDRINUSE") {
              console.log(`Port ${port} is busy, trying ${port + 1}...`);
              startServer(port + 1);
            } else {
              console.error("Server error:", err);
            }
          });
      } catch (error) {
        console.error("Failed to start server:", error);
      }
    };

    // Start server with initial port
    startServer(process.env.PORT || 3000);
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
