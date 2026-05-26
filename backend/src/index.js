const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
dotenv.config();
const projectRoutes = require("./routes/projectRoutes");
const deploymentRoutes = require("./routes/deploymentRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/deployments", deploymentRoutes);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "DeployFlow Backend Running",
      time: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        github_url VARCHAR(255),
        environment VARCHAR(50) DEFAULT 'Production',
        status VARCHAR(50) DEFAULT 'Running',
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Database initialized successfully 🚀");
  } catch (error) {
    console.error("Database initialization failed ❌:", error);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await initDb();
  console.log(`Server running on port ${PORT}`);
});