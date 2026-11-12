import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Test endpoint
app.get("/api/health", (req, res) => {
  res.json({
    message: "Recipe Sharing API is running!"
  });
});

export default app;
