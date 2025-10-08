const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔗 Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/loginDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 📌 User Schema
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

// 📌 Register Route (optional)
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });

  await newUser.save();
  res.json({ message: "User registered!" });
});

// 📌 Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false, message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.json({ success: false, message: "Wrong password" });

  res.json({ success: true, message: "Login successful!" });
});

// Start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
