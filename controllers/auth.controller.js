const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Create a demo user if it doesn't exist
const createDemoUser = async () => {
  try {
    const existingUser = await User.findOne({ email: "intern@dacoid.com" });

    if (!existingUser) {
      const demoUser = new User({
        email: "intern@dacoid.com",
        password: "Test123",
      });

      await demoUser.save();
      console.log("Demo user created");
    }
  } catch (error) {
    console.error("Error creating demo user:", error);
  }
};

// Call this function when the server starts
createDemoUser();

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      {
        expiresIn: "24h",
      }
    );

    res.json({ token, userId: user._id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
