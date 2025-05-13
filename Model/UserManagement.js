import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    timeZone: { type: String },
    mfaSecret: { type: String, default: null},
    mfaEnabled: { type: Boolean, default: false },
    isLdapUser: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    organizations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
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

const User = mongoose.model('User', userSchema, 'user');
export default User;
