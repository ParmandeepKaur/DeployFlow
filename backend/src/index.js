const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
dotenv.config();
const projectRoutes = require("./routes/projectRoutes");
const deploymentRoutes = require("./routes/deploymentRoutes");
const app = express();
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/deployments", deploymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
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
        title VARCHAR(100) NOT NULL,
        description TEXT,
        github_url VARCHAR(255),
        live_demo_url VARCHAR(255),
        environment VARCHAR(50) DEFAULT 'Production',
        status VARCHAR(50) DEFAULT 'Running',
        last_deployment_time TIMESTAMP,
        faculty_review_status VARCHAR(50) DEFAULT 'Pending',
        deployment_approval_state VARCHAR(50) DEFAULT 'Pending',
        submission_health VARCHAR(50) DEFAULT 'Healthy',
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Safe migrations for existing databases
    await pool.query(`
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS title VARCHAR(100);
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS description TEXT;
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_url VARCHAR(255);
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS live_demo_url VARCHAR(255);
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS environment VARCHAR(50) DEFAULT 'Production';
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS last_deployment_time TIMESTAMP;
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS faculty_review_status VARCHAR(50) DEFAULT 'Pending';
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS deployment_approval_state VARCHAR(50) DEFAULT 'Pending';
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS submission_health VARCHAR(50) DEFAULT 'Healthy';
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        user_id INT REFERENCES users(id) ON DELETE SET NULL,
        metadata JSONB,
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