import Role from "../Model/Role.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = "apple";

export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const role = await Role.findOne({ username });

        if (!role) {
            return res.status(401).json({ message: 'Invalid username' });
        }

        if (role.role !== "superadmin") {
            return res.status(401).json({ message: 'Unauthorized: Not a superadmin' });
        }

        const hardCodedPassword = "superadmin@123";

        if (password !== hardCodedPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: role._id, role: role.role }, JWT_SECRET, { expiresIn: "1d" });

        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

        res.json({ message: `Login successful for ${role.role}`, id: role._id, token, role: role.role });

    } catch (error) {
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
};

