import User from "../Model/UserManagement.js";
import Group from "../Model/Group.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { promisify } from "util";

const toDataURL = promisify(qrcode.toDataURL);

const JWT_SECRET = "apple";

export const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !user.isActive) {
      return res.status(404).json({ message: 'Invalid credentials or not an user' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    if (user.mfaEnabled) {
      return res.status(206).json({ message: 'MFA required', mfaEnabled: user.mfaEnabled, userId: user._id });
    }  

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: "None" });

    res.status(200).json({ message: `Login successful for ${user.role}`, id: user._id, token: user.mfaEnabled ? null : token, role: user.role, username: user.username, mfaEnabled: user.mfaEnabled });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMfaQrCode = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user || !user.mfaEnabled || !user.mfaSecret) {
      return res.status(400).json({ message: "MFA not setup for this user" });
    }

    // Block second-time QR request
    if (user.mfaQrShown) {
      return res.status(403).json({
        message: "QR code already shown. Enter 6-digit code from your app.",
      });
    }

    const otpauth_url = speakeasy.otpauthURL({
      secret: user.mfaSecret,
      label: `Securita (${user.email})`,
      encoding: "base32",
    });

    // Use the promisified version
    const data_url = await toDataURL(otpauth_url);

    // ✅ Send QR code to frontend **before updating flag**
    res.status(200).json({ qrCodeImage: data_url });

    user.mfaQrShown = true;
    await user.save();
  } catch (err) {
    console.error("QR Code fetch error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyMfaToken = async (req, res) => {
  try {
    const { token } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.mfaEnabled || !user.mfaSecret) {
      return res.status(400).json({ message: "MFA not enabled for this user" });
    }

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: "base32",
      token,
      window: 2,
    });

    if (!verified) {
      return res.status(400).json({ message: "Invalid or expired MFA token" });
    }

    const authToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", authToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res
      .status(200)
      .json({ message: "MFA verification successful", token: authToken });
  } catch (error) {
    console.error("MFA verify error:", error.message, error.stack);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    const groups = await Group.find({ users: userId })
      .populate("users", "username email")
      .populate("organization", "name");

    if (groups.length === 0) {
      return res
        .status(404)
        .json({ message: "User is not part of any group yet" });
    }

    res
      .status(200)
      .json({ message: `User is part of ${groups.length} group(s)`, groups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserGroupById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { groupId } = req.params;

    const group = await Group.findOne({ _id: groupId, users: userId })
      .populate("users", "username email")
      .populate("organization", "name");

    if (!group) {
      return res
        .status(404)
        .json({ message: "Group not found or access denied" });
    }

    res.status(200).json({ group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const userLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
};
