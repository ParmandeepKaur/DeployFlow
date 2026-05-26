const express = require("express");

const {
  getDeploymentStatus,
} = require("../controllers/deploymentController");

const router = express.Router();

router.get("/status", getDeploymentStatus);

module.exports = router;
