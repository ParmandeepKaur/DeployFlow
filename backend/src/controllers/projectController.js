const pool = require("../config/db");
const { trackEvent } = require("./analyticsTracker");

const createProject = async (req, res) => {
  try {
    const {
      name, // Maps to title
      description,
      github_url,
      live_demo_url,
      environment,
      status,
    } = req.body;

    const newProject = await pool.query(
      `
      INSERT INTO projects
      (title, description, github_url, live_demo_url, environment, status, faculty_review_status, deployment_approval_state, submission_health, user_id)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
      `,
      [
        name || "Untitled Project",
        description || "",
        github_url || "",
        live_demo_url || "",
        environment || "Production",
        status || "Created",
        "Pending",
        "Pending",
        "Healthy",
        req.user.id,
      ]
    );

    await trackEvent(req.user.id, "project_create", {
      project_id: newProject.rows[0].id,
      title: newProject.rows[0].title,
      environment: newProject.rows[0].environment,
    });

    res.status(201).json({
      message: "Project created 🚀",
      project: newProject.rows[0],
    });

  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({
      error: "Failed to create project",
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const { all } = req.query;
    let query = "";
    let params = [];

    if (all === "true") {
      // Faculty mode: Get all projects with owner details
      query = `
        SELECT p.*, u.name as owner_name, u.email as owner_email
        FROM projects p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
      `;
    } else {
      // Student mode: Get only logged-in user's projects
      query = `
        SELECT p.*, u.name as owner_name, u.email as owner_email
        FROM projects p
        JOIN users u ON p.user_id = u.id
        WHERE p.user_id = $1
        ORDER BY p.created_at DESC
      `;
      params = [req.user.id];
    }

    const projects = await pool.query(query, params);

    const formattedProjects = projects.rows.map((p) => {
      // Backward compatibility logic
      const isLegacy = !p.github_url && p.description?.includes(" | ");
      const split = isLegacy ? p.description.split(" | ") : [];

      return {
        id: p.id,
        name: p.title,
        title: p.title,
        description: isLegacy ? "" : (p.description || ""),
        github_url: isLegacy ? (split[0] || "") : (p.github_url || ""),
        environment: isLegacy ? (split[1] || "Production") : (p.environment || "Production"),
        live_demo_url: p.live_demo_url || "",
        status: p.status,
        faculty_review_status: p.faculty_review_status || "Pending",
        deployment_approval_state: p.deployment_approval_state || "Pending",
        submission_health: p.submission_health || "Healthy",
        last_deployment_time: p.last_deployment_time,
        created_at: p.created_at,
        owner_name: p.owner_name || "Unknown",
        owner_email: p.owner_email || "N/A",
        user_id: p.user_id,
      };
    });

    res.status(200).json(formattedProjects);

  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({
      error: "Failed to fetch projects",
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, github_url, live_demo_url, environment } = req.body;

    const result = await pool.query(
      `
      UPDATE projects
      SET title = $1, description = $2, github_url = $3, live_demo_url = $4, environment = $5
      WHERE id = $6 AND user_id = $7
      RETURNING *
      `,
      [title, description, github_url, live_demo_url, environment, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found or unauthorized",
      });
    }

    await trackEvent(req.user.id, "project_edit", {
      project_id: id,
      title,
    });

    res.status(200).json({
      message: "Project updated successfully 📝",
      project: result.rows[0],
    });

  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({
      error: "Failed to update project",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Get project title first to log it
    const projectCheck = await pool.query(
      "SELECT title FROM projects WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found or unauthorized",
      });
    }

    const title = projectCheck.rows[0].title;

    await pool.query(
      "DELETE FROM projects WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );

    await trackEvent(req.user.id, "project_delete", {
      project_id: id,
      title,
    });

    res.status(200).json({
      message: "Project deleted 🗑️",
    });

  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({
      error: "Failed to delete project",
    });
  }
};

const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let query = "UPDATE projects SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *";
    let params = [status, id, req.user.id];

    if (status === "Running") {
      query = `
        UPDATE projects 
        SET status = $1, last_deployment_time = CURRENT_TIMESTAMP 
        WHERE id = $2 AND user_id = $3 
        RETURNING *
      `;
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found or unauthorized",
      });
    }

    const eventName = status === "Running" ? "deploy" : (status === "Stopped" ? "stop" : "status_update");
    await trackEvent(req.user.id, eventName, {
      project_id: id,
      title: result.rows[0].title,
    });

    res.status(200).json({
      message: `Project status updated to ${status} 🚀`,
      project: result.rows[0],
    });

  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({
      error: "Failed to update project status",
    });
  }
};

const updateProjectReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { faculty_review_status, deployment_approval_state } = req.body;

    const result = await pool.query(
      `
      UPDATE projects
      SET faculty_review_status = $1, deployment_approval_state = $2
      WHERE id = $3
      RETURNING *
      `,
      [faculty_review_status, deployment_approval_state, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    await trackEvent(req.user.id, "faculty_review", {
      project_id: id,
      title: result.rows[0].title,
      faculty_review_status,
      deployment_approval_state,
    });

    res.status(200).json({
      message: "Project review status updated successfully 🌟",
      project: result.rows[0],
    });

  } catch (error) {
    console.error("Update review status error:", error);
    res.status(500).json({
      error: "Failed to update review status",
    });
  }
};

const getProjectLogs = async (req, res) => {
  try {
    const { id } = req.params;
    res.status(200).json({
      project_id: id,
      source: "simulation-agent",
      logs: [
        { level: "INFO", message: `Establishing bridge for project container ID: ${id}...` },
        { level: "SUCCESS", message: "Connected to virtualized deployment network." },
        { level: "INFO", message: "Ready to stream container logs." }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  updateProjectStatus,
  updateProjectReviewStatus,
  getProjectLogs,
};