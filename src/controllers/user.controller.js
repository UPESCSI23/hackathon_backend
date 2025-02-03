const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//signup
exports.signup = async (req, res) => {
  try {
      const { name, email, password } = req.body;

      //Checking user already exists
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "User already exists" });

      //User Create
      user = new User({ name, email, password });
      await user.save();

      //Token Generate
      const token = generateToken(user._id);

      res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// Signin
exports.signin = async (req, res) => {
  try {
      const { email, password } = req.body;

      //user exists check
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid email or password" });

      //password check
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

      // Generate JWT Token
      const token = generateToken(user._id);

      res.json({ message: "Login successful", token });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};