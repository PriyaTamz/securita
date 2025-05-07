import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['superadmin', 'admin', 'user', 'auditor', 'userreport'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Role = mongoose.model('Role', roleSchema, 'role');
export default Role;
