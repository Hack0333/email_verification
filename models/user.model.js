import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    passwordResetToken: String,
    passwordResetExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
},{timeStamp : true})

const User = mongoose.model("User", userSchema);

export default User;