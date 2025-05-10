import User from '../Model/UserManagement.js';
import Admin from '../Model/Admin.js';
import Organization from '../Model/Organization.js';
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import qrcode from "qrcode";

export const createOrganization = async (req, res) => {
    try {
        const { organization } = req.body;

        const existingOrg = await Organization.findOne({ organization });
        if (existingOrg) {
            return res.status(400).json({ message: 'Organization already exists' });
        }

        const newOrg = new Organization({
            organization,
            createdBy: req.user.id
        })

        await newOrg.save();
        res.status(201).json({ message: 'Organization created successfully', org: newOrg });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllOrganization = async (req, res) => {
    try {
        const orgs = await Organization.find().select('-createdAt -updatedAt -__v');
        res.status(200).json({ orgs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrganizationById = async (req, res) => {
    try {
        const { id } = req.params;

        const orgs = await Organization.findById(id);
        if (!orgs) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        const userCount = await User.countDocuments({ organization: id });
        const admins = await Admin.find({ organization: id }).select('username');
        
        res.status(200).json({ orgs, userCount, admins });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createAdmin = async (req, res) => {
    try {
        const { organizationId, username, password } = req.body;

        const org = await Organization.findById(organizationId);
        if (!org) {
            return res.status(400).json({ message: 'Invalid organization' });
        }

        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            organization: organizationId,
            username,
            password: hashedPassword,
            role: 'admin',
            createdBy: req.user._id
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { organizationId, username, password, firstName, lastName, email, phone, timeZone, mfaEnabled } = req.body;

        const org = await Organization.findById(organizationId);
        if (!org) {
            return res.status(400).json({ message: 'Invalid organization' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            organization: organizationId,
            username,
            password: hashedPassword,
            firstName,
            lastName,
            email,
            phone,
            timeZone,
            mfaEnabled: mfaEnabled || false,
            createdBy: req.user.id,
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -mfaSecret').populate('organization');
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select('-password -mfaSecret').populate('organization');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phone, timeZone } = req.body;

        const updateUser = await User.findByIdAndUpdate(
            id,
            { firstName, lastName, email, phone, timeZone, updatedAt: new Date() },
            { new: true }
        ).select('-password -mfaSecret').populate('organization');

        if (!updateUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User updated successfully', user: updateUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = false;
        await user.save();

        res.status(200).json({ message: 'User deactivated (soft deleted)' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const activateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = true;
        await user.save();

        res.status(200).json({ message: 'User account activated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const enableMfaForUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.mfaEnabled) {
            return res.status(400).json({ message: 'MFA is already enabled for this user.' });
        }

        const secret = speakeasy.generateSecret({ name: `Securita (${user.email})` });

        user.mfaEnabled = true;
        user.mfaSecret = secret.base32;
        await user.save();

        /*qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
            if (err) {
                console.error('Error generating QR code:', err);
                return res.status(500).json({ message: 'Failed to generate QR code.' });
            }*/

        return res.status(200).json({ message: 'MFA enabled successfully.' });

    } catch (error) {
        console.error('Error enabling MFA:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};