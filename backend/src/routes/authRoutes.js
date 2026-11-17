import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

const SALT_ROUNDS = 12;


function createToken(userId) {
  return jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      username.trim().length < 3 ||
      username.trim().length > 30 ||
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        message: "Username must be 3-30 characters and password must be 8-72 bytes"
      });
    }

    const normalizedUsername = username.trim().toLowerCase();

    const existingUser = await User.findOne({
      username: normalizedUsername
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username is already taken"
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      SALT_ROUNDS
    );

    const user = await User.create({
      username: normalizedUsername,
      password: hashedPassword
    });

    const token = createToken(user._id);

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Username is already taken"
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Server error"
    });
  }
});

// Log into an existing account
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      typeof username !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    const normalizedUsername = username.trim().toLowerCase();

    const user = await User.findOne({
      username: normalizedUsername
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const token = createToken(user._id);

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error"
    });
  }
});


router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists"
      });
    }

    return res.json({
      id: user._id,
      username: user.username
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      message: "Server error"
    });
  }
});


export default router;
