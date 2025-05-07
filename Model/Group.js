import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    }],
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Group = mongoose.model('Group', groupSchema, 'group');
export default Group;