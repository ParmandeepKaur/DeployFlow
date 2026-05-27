const pool = require("../config/db");
const { exec } = require("child_process");

const getDashboardStats = async (req, res) => {
  try {
    // Count projects for logged-in user
    const projectResult = await pool.query(
      "SELECT COUNT(*) FROM projects WHERE user_id=$1",
      [1]
    );

    const totalProjects = parseInt(projectResult.rows[0].count);

    exec("docker ps --format '{{.Names}}'", (error, stdout) => {
      let runningContainers = 0;

      if (!error && stdout.trim()) {
        runningContainers = stdout.trim().split("\n").length;
      }

      const pipelineStatus =
        runningContainers > 0 ? "Healthy" : "Idle";

      const deploymentStatus =
        runningContainers > 0 ? "Stable" : "Not Running";

      res.status(200).json({
        totalProjects,
        runningContainers,
        pipelineStatus,
        deploymentStatus,
      });
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to fetch dashboard stats",
    });
  }
};

module.exports = {
  getDashboardStats,
};
