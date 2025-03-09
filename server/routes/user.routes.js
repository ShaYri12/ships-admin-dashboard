import express from "express";
import User from "../models/user.model.js";
import { protect, admin } from "../middleware/auth.middleware.js";
import mongoose from "mongoose";

const router = express.Router();

// Temporary route to create first admin (Remove after creating first admin)
router.post("/create", async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const { name, email, password, status } = req.body;

    // Validate required fields
    if (!name || !email || !password || !status) {
      return res.status(400).json({
        message:
          "Please provide all required fields: name, email, password, status",
      });
    }

    const admin = await User.create({
      name,
      email,
      password,
      role: "admin", // Force role to be admin for this route
      status,
      createdBy: new mongoose.Types.ObjectId(),
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all users (admin only)
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("createdBy", "name");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create new user (admin only)
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, email, role, shipRole, status, assignedShip } = req.body;

    // Validate required fields
    if (!name || !email || !role || !status || !assignedShip) {
      return res.status(400).json({
        message:
          "Please provide all required fields: name, email, role, status, assignedShip",
      });
    }

    // Validate if shipRole is required based on role
    if ((role === "user" || role === "seller") && !shipRole) {
      return res.status(400).json({
        message: "Ship role is required for user and seller roles",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      role,
      shipRole,
      status,
      assignedShip,
      createdBy: req.user._id,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      shipRole: user.shipRole,
      status: user.status,
      assignedShip: user.assignedShip,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Update user (admin only)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.assignedShip = req.body.assignedShip || user.assignedShip;
    user.status = req.body.status || user.status;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      assignedShip: updatedUser.assignedShip,
      status: updatedUser.status,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user (admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You cannot delete your own admin account" });
    }

    // Check if trying to delete another admin
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin accounts" });
    }

    // Actually delete the user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
