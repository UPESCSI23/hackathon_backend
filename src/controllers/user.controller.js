import { UserModel } from "../models/user.model.js";
import { generateAccessAndRefreshToken } from "../utils/generateToken.js";

//signup
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    console.log(existingUser);

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
      secure: true,
    };

    return res
      .status(201)
      .cookie("refreshToken", accessToken, options)
      .cookie("accessToken", refreshToken, options)
      .json({ message: "User created successfully", user: createdUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "email is required" });
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
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ message: "User logged in successfully", user: loggedInUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

