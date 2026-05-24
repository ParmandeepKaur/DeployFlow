const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING id,name,email",
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Registration failed",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.rows[0].id,
        email: user.rows[0].email,
      },
      "deployflowsecret",
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Login failed",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};