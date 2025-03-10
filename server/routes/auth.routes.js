import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { protect } from "../middleware/auth.middleware.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    // Validate required fields
    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({
        message: "Please provide both email and password",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    console.log(
      "Found user:",
      user
        ? {
            id: user._id,
            email: user.email,
            role: user.role,
            status: user.status,
            hasPassword: !!user.password,
          }
        : "No user found"
    );

    // If no user found or user is not active, return error
    if (!user) {
      console.log("No user found with this email");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status !== "active") {
      console.log("User is not active");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // For non-admin users or invalid credentials, return error
    if (user.role !== "admin") {
      console.log("User is not an admin");
      return res.status(401).json({ message: "Only admin users can login" });
    }

    // Check password
    console.log("Comparing passwords...");
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("Password does not match");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT with 15 days expiration
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15d",
    });

    // Set cookie with 15 days expiration
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
      path: "/",
    });

    // Send user data
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      assignedShip: user.assignedShip,
    };

    console.log("Login successful for user:", userData);

    // Store in localStorage through client response
    res.json({
      ...userData,
      token, // Include token in response for localStorage
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  // Clear the cookie
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  res.json({ message: "Logged out successfully" });
});

// Get current user
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update profile route
router.put("/update-profile", protect, async (req, res) => {
  console.log("Starting profile update...");

  try {
    // Find user without password
    const user = await User.findById(req.user._id);
    if (!user) {
      console.log("User not found:", req.user._id);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Current user data:", {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Validate update data
    const updates = {};

    if (req.body.name) {
      if (req.body.name.trim().length < 2) {
        return res
          .status(400)
          .json({ message: "Name must be at least 2 characters long" });
      }
      updates.name = req.body.name.trim();
    }

    if (req.body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Check if email is already in use
      if (req.body.email !== user.email) {
        const emailExists = await User.findOne({
          email: req.body.email,
          _id: { $ne: user._id },
        });
        if (emailExists) {
          return res.status(400).json({ message: "Email already in use" });
        }
      }
      updates.email = req.body.email.trim().toLowerCase();
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });
      }
      updates.password = req.body.password;
    }

    console.log("Applying updates:", {
      ...updates,
      password: updates.password ? "[REDACTED]" : undefined,
    });

    // Apply updates
    Object.assign(user, updates);

    // Save user
    const updatedUser = await user.save();
    console.log("User updated successfully");

    // Send response
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      assignedShip: updatedUser.assignedShip,
      shipRole: updatedUser.shipRole,
    });
  } catch (error) {
    console.error("Profile update error:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(500).json({
      message: "Failed to update profile",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

export default router;
