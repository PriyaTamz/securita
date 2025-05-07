import Admin from '../Model/Admin.js';
import Group from '../Model/Group.js';
import User from '../Model/UserManagement.js';
import Organization from '../Model/Organization.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = "apple";

export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }

        if (admin.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Not an admin' });
        }

        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });

        res.status(200).json({ message: 'Admin logged in successfully', token, adminId: admin._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createGroup = async (req, res) => {
    try {
        const { name, userIds, organizationId } = req.body;

        const existingGroup = await Group.findOne({ name });
        if (existingGroup) {
            return res.status(400).json({ message: 'Group name already exists' });
        }

        const usersExist = await User.find({ _id: { $in: userIds } });
        if (usersExist.length !== userIds.length) {
            return res.status(404).json({ message: 'One or more users not found' });
        }

        const orgExists = await Organization.findById(organizationId);
        if (!orgExists) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        const newGroup = new Group({
            name,
            users: userIds,
            organization: organizationId,
            createdBy: req.user.id
        });

        await newGroup.save();
        res.status(201).json({ message: 'Group created successfully', group: newGroup });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllGroup = async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(201).json({ groups });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
