import express from "express";
import mongoose from "mongoose";

import Recipe from "../models/Recipe.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.use(requireAuth);

export default router;
