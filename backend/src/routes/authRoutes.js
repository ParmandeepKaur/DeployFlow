const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/track-event", authMiddleware, async (req, res) => {
  try {
    const { eventType, metadata } = req.body;
    const { trackEvent } = require("../controllers/analyticsTracker");
    await trackEvent(req.user.id, eventType, metadata || {});
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to track event" });
  }
});

module.exports = router;