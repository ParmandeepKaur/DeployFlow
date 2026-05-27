const pool = require("../config/db");

const createProject = async (req, res) => {
  try {
    const {
      name,
      github_url,
      environment,
      status,
    } = req.body;

    const newProject = await pool.query(
      `
      INSERT INTO projects
      (title, description, status, user_id)
      VALUES($1, $2, $3, $4)
      RETURNING *
      `,
      [
        name,
        `${github_url || ""} | ${
          environment || "Production"
        }`,
        status || "Created",
        req.user.id,
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
      `
      SELECT * FROM projects
      WHERE user_id=$1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    const formattedProjects =
      projects.rows.map((p) => {
        const split =
          p.description?.split(" | ") ||
          [];

        return {
          id: p.id,
          name: p.title,
          github_url:
            split[0] || "",
          environment:
            split[1] ||
            "Production",
          status: p.status,
          created_at:
            p.created_at,
        };
      });

    res.status(200).json(
      formattedProjects
    );

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error:
        "Failed to fetch projects",
    });
  }
};

const deleteProject = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM projects
      WHERE id=$1
      AND user_id=$2
      `,
      [id, req.user.id]
    );

    res.status(200).json({
      message:
        "Project deleted 🗑️",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error:
        "Failed to delete project",
    });
  }
};

const updateProjectStatus =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const { status } =
        req.body;

      const result =
        await pool.query(
          `
        UPDATE projects
        SET status=$1
        WHERE id=$2
        AND user_id=$3
        RETURNING *
        `,
          [
            status,
            id,
            req.user.id,
          ]
        );

      if (
        result.rows.length === 0
      ) {
        return res
          .status(404)
          .json({
            error:
              "Project not found",
          });
      }

      res.status(200).json({
        message:
          "Project status updated 🚀",
        project:
          result.rows[0],
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        error:
          "Failed to update project status",
      });
    }
  };

module.exports = {
  createProject,
  getProjects,
  deleteProject,
  updateProjectStatus,
};