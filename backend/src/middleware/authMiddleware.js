const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied",
      });
    }

    const token = authHeader.split(" ")[1];

    const verified = jwt.verify(
      token,
      "deployflowsecret"
    );

    req.user = verified;

    next();

  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleware;