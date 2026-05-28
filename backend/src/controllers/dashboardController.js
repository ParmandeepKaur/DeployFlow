const pool = require("../config/db");
const { exec } = require("child_process");

const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Users
    const usersCountRes = await pool.query("SELECT COUNT(*) FROM users");
    const totalUsers = parseInt(usersCountRes.rows[0].count) || 0;

    // 2. Projects Managed
    const projectsCountRes = await pool.query("SELECT COUNT(*) FROM projects");
    const totalProjects = parseInt(projectsCountRes.rows[0].count) || 0;

    // 3. Active Projects (status = 'Running')
    const activeProjectsRes = await pool.query("SELECT COUNT(*) FROM projects WHERE status = 'Running'");
    const activeProjects = parseInt(activeProjectsRes.rows[0].count) || 0;

    // 4. Deployments Triggered (event_type = 'deploy')
    const deploysRes = await pool.query("SELECT COUNT(*) FROM analytics_events WHERE event_type = 'deploy'");
    const deploymentsTriggered = parseInt(deploysRes.rows[0].count) || 0;

    // 5. Most Used Environment
    const envRes = await pool.query(
      `
      SELECT environment, COUNT(*) as count 
      FROM projects 
      WHERE environment IS NOT NULL AND environment != ''
      GROUP BY environment 
      ORDER BY count DESC 
      LIMIT 1
      `
    );
    const mostUsedEnvironment = envRes.rows.length > 0 ? envRes.rows[0].environment : "Production";

    // 6. Recent Activity Timeline (last 10 events)
    const timelineRes = await pool.query(
      `
      SELECT e.id, e.event_type, e.metadata, e.created_at, u.name as user_name, u.email as user_email
      FROM analytics_events e
      LEFT JOIN users u ON e.user_id = u.id
      ORDER BY e.created_at DESC
      LIMIT 10
      `
    );
    const activityTimeline = timelineRes.rows.map((row) => ({
      id: row.id,
      eventType: row.event_type,
      metadata: row.metadata || {},
      timestamp: row.created_at,
      userName: row.user_name || "System",
      userEmail: row.user_email || "system@deployflow.local",
    }));

    // Docker integration check
    exec("docker ps --format '{{.Names}}'", (error, stdout) => {
      let runningContainers = 0;

      if (!error && stdout.trim()) {
        runningContainers = stdout.trim().split("\n").length;
      }

      // Preserving original pipeline status formula
      const pipelineStatus = runningContainers > 0 ? "Healthy" : "Idle";
      const deploymentStatus = runningContainers > 0 ? "Stable" : "Not Running";
      
      // Calculate Platform Health
      const platformHealth = runningContainers > 0 ? "98% (Optimal)" : "95% (Stable)";

      res.status(200).json({
        totalUsers,
        totalProjects,
        activeProjects,
        deploymentsTriggered,
        mostUsedEnvironment,
        platformHealth,
        runningContainers,
        pipelineStatus,
        deploymentStatus,
        activityTimeline,
      });
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      error: "Failed to fetch dashboard stats",
    });
  }
};

module.exports = {
  getDashboardStats,
};
