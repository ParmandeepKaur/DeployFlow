const pool = require("../config/db");

const createProject = async (req, res) => {
  try {
    const { name, github_url, environment, status } = req.body;

    const newProject = await pool.query(
      "INSERT INTO projects(name, github_url, environment, status, user_id) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [
        name,
        github_url || "",
        environment || "Production",
        status || "Running",
        req.user.id
      ]
    );

    res.status(201).json({
      message: "Project created 🚀",
      project: newProject.rows[0],
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to create project",
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await pool.query(
      "SELECT * FROM projects WHERE user_id=$1 ORDER BY created_at DESC",
      [req.user.id]
    );

    res.status(200).json(projects.rows);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to fetch projects",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM projects WHERE id=$1 AND user_id=$2",
      [id, req.user.id]
    );

    res.status(200).json({
      message: "Project deleted 🗑️",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to delete project",
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  deleteProject,
};