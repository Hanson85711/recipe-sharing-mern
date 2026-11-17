import express from "express";
import mongoose from "mongoose";
import Recipe from "../models/Recipe.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.use(requireAuth);

//Create a Recipe
router.post("/", async (req, res) => {
  try {
    const { title, ingredients, imageUrl } = req.body;

    const recipe = await Recipe.create({
      title,
      ingredients,
      imageUrl,
      author: req.userId
    });

    return res.status(201).json(recipe);
  } catch (error) {
    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        message: "Invalid recipe data"
      });
    }

    console.error("Create recipe error:", error);

    return res.status(500).json({
      message: "Server error"
    });
  }
});

export default router;
