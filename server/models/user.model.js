import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return this.role === "admin";
      },
    },
    role: {
      type: String,
      enum: ["admin", "user", "seller"],
      default: "user",
    },
    shipRole: {
      type: String,
      required: function () {
        return this.role === "user" || this.role === "seller";
      },
    },
    assignedShip: {
      type: String,
      required: function () {
        return this.role === "user" || this.role === "seller";
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving (only for admin users)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.role !== "admin") return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password (only used for admin login)
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (this.role !== "admin") return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
