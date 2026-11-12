import "dotenv/config";
import app from "./app.js";
import { initializeDatabase } from "./db/init.js";

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();