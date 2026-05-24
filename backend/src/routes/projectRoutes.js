const express = require("express");

const {
  createProject,
  getProjects,
} = require("../controllers/projectController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createProject);

router.get("/", authMiddleware, getProjects);

module.exports = router;