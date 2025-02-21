import { UserModel } from "../models/user.model.js";
import { generateAccessAndRefreshToken } from "../utils/generateToken.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await UserModel.create({
      fullName,
      email,
      password,
    });

    const createdUser = await UserModel.findById(newUser._id).select(
      "-password -refreshToken",
    );

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      newUser._id,
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    };

    const refreshOptions = {
      ...options,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, refreshOptions)
      .json({ message: "User created successfully", user: createdUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await existingUser.comparePassword(password);
    console.log(isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      existingUser._id,
    );

    const loggedInUser = await UserModel.findById(existingUser._id).select(
      "-password -refreshToken",
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    };

    const refreshOptions = {
      ...options,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, refreshOptions)
      .json({ message: "User logged in successfully", user: loggedInUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await UserModel.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    // Set the new access token as a cookie
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    };

    const refreshOptions = {
      ...options,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, refreshOptions)
      .json({ message: "Token refreshed successfully" });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};
