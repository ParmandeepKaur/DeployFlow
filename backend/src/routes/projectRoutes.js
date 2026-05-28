const express = require("express");

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  updateProjectStatus,
  updateProjectReviewStatus,
  getProjectLogs,
} = require("../controllers/projectController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createProject);

router.get("/", authMiddleware, getProjects);

router.put("/:id", authMiddleware, updateProject);

router.delete("/:id", authMiddleware, deleteProject);

router.put("/:id/status", authMiddleware, updateProjectStatus);

router.put("/:id/review", authMiddleware, updateProjectReviewStatus);

router.get("/:id/logs", authMiddleware, getProjectLogs);

module.exports = router;