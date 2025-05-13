import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
    organization: { type: String, required: true, unique: true },
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

const Organization = mongoose.model('Organization', organizationSchema, 'organization');
export default Organization;