import User from '../Model/UserManagement.js';
import Group from '../Model/Group.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import speakeasy from 'speakeasy';

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
      return res.status(206).json({ message: 'MFA required', userId: user._id });
    }  

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: "strict" });

    res.status(200).json({ message: `Login successful for ${user.role}`, id: user._id, token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyMfaToken = async (req, res) => {
  try {
    const { userId, token } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.mfaEnabled || !user.mfaSecret) {
      return res.status(400).json({ message: 'MFA not enabled for this user' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({ message: 'Invalid or expired MFA token' });
    }

    const authToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', authToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',  
    });    

    return res.status(200).json({ message: 'MFA verification successful', token: authToken });

  } catch (error) {
    console.error('MFA verify error:', error.message, error.stack);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserGroups = async (req, res) => {
    try {
        const { userId } = req.params;

        const groups = await Group.find({ users: userId });

        if (groups.length === 0) {
            return res.status(404).json({ message: 'User is not part of any group' });
        }

        res.status(200).json({ message: `User is part of ${groups.length} group(s)` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
