const pool = require("../config/db");

const createProject = async (req, res) => {
  try {
    const { name } = req.body;

    const newProject = await pool.query(
      "INSERT INTO projects(name,user_id) VALUES($1,$2) RETURNING *",
      [name, req.user.id]
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
      "SELECT * FROM projects WHERE user_id=$1",
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

module.exports = {
  createProject,
  getProjects,
};