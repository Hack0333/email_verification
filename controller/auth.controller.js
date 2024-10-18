import bcrypt from 'bcrypt'
import crypto from 'crypto'

import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateJWTTokenAndSetCookie } from "../utils/generateJWTTokenAndSetCookie.js";
import { sendVerificationEmail, sendWellcomeEmail ,sendForgotPasswordEmail,sendPasswordResetSuccessEmail} from "../mailtrap/email.js";

import User from "../models/user.model.js";

export const signup = async(req,res)=>{
    const {email,name,password} = req.body;

    try {
        if(!email || !name || !password){
            return res.status(400).json({success : false , message : "All fields are required"});
        }

        const UserAllreadyExist = await User.findOne({email});
        if(UserAllreadyExist){
            return res.status(400).json({success : false , message : "User already exists"});
        }
        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password , salt);

        const user = await User.create({
            email,
            name,
            password : hashPassword,
            verificationToken : generateVerificationToken(),
            verificationTokenExpiresAt : new Date(Date.now() + 1 * 60 * 60 * 1000),
        })

        await user.save();

        if(user){
            //jwt token
            generateJWTTokenAndSetCookie(res , user._id);
        }else{
            res.status(400).json({success : false , message : "Failed Creating user"});
        }

        await sendVerificationEmail(user.email , user.verificationToken);

        res.status(201).json({
            success : true,
            message : "user created successfuly",
            user : {
                ...user._doc,
                password : undefined
            }
        })

        
    } catch (error) {
        res.status(500).json({success: false, message: "An error occurred during signup", error: error.message});
    }
    
}

export const verifyEmail = async(req,res)=>{
    const {code} = req.body;

    try {
        const user = await User.findOne({
            verificationToken : code,
            verificationTokenExpiresAt : { $gt : Date.now()}
        })

        if(!user){
            res.status(400).json({
                success : false,
                message : "Invalid User or Error Verification Code"
            })
        }

        await sendWellcomeEmail(user.email, user.name);
        
        user.verificationToken = undefined;
        User.verificationTokenExpiresAt = undefined;
        user.isVerified = true;
        
        await user.save();

        res.status(200).json({
            success : true,
            message : "User Verified successfully",
        })

    } catch (error) {
        console.log("Erro during sending wellcome email :" ,error.message);
        res.status(500).json({
            success: false,
            message: "An error occurred during  wellcome email verification",
            error: {
                code: "wellcome EMAIL_VERIFICATION_FAILED",
                details: error.message
            }
        }); 

    }
}

export const login = async(req,res)=>{
    const {email,password} = req.body;
    try {
        if(!email || !password){
            return res.status(400).json({success : false , message : "All fields are required"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success : false , message : "Invalid email or password"});
        }
        
        const isPasswordMatch = await bcrypt.compare(password , user.password);
        if(!isPasswordMatch){
            return res.status(400).json({success : false , message : "Invalid email or password"});
        }

        generateJWTTokenAndSetCookie(res,user._id);

        res.status(200).json({
            success : true,
            message : "Login successfully",
            user : {
                ...user._doc,
                password : undefined
            }
        })

    } catch (error) {
        console.log("Error during login :", error.message);
        res.status(500).json({
            success : false,
            message : "An error occurred during login",
            error : error.message
        })
    }
}

export const logout = async(req,res)=>{
    res.clearCookie("token");
    res.status(200).json({success : true , message : "Logout successfully"});
}

export const forgotPassword = async(req,res)=>{
    const {email} = req.body;

    try {
        if(!email){
            return res.status(400).json({success : false , message : "Email is required"});
        }


        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success : false , message : "User not found"});
        }
        //generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

        user.passwordResetToken = resetToken;
        user.passwordResetExpiresAt = resetTokenExpiresAt;

        await user.save();

        await sendForgotPasswordEmail(user.email , `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({
            success : true,
            message : "password reset link sent successfully",
            user : {
                ...user._doc,
                password : undefined
            }
        })

    } catch (error) {
        console.log("Error during forgot password :", error.message);
        res.status(500).json({
            success : false,
            message : "An error occurred during forgot password",
            error : error.message
        })
    }
}

export const resetPassword = async(req,res)=>{
    const {resetToken} = req.params;
    try{
        const {newPassword} = req.body;
        const user = await User.findOne({
            passwordResetToken : resetToken,
            passwordResetExpiresAt : { $gt : Date.now()}
        });
        if(!user){
            return res.status(400).json({success : false , message : "Invalid user or expired reset token"});
        }
        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpiresAt = undefined;

        await user.save();

        await sendPasswordResetSuccessEmail(user.email);

        res.status(200).json({
            success : true,
            message : "Password reset successfully",
        })

    }catch(error){
        console.log("Error during reset password :", error.message);
        res.status(500).json({
            success : false,
            message : "An error occurred during reset password",
            error : error.message
        })
    }
}

export const checkAuth = async(req,res)=>{
    const userId = req.userId;
    if(!userId) return res.status(401).json({success:false , message : "unauthorised- no userid"});

    try {
        const user = await User.findById(userId).select("-password");
        if(!user) return res.status(401).json({success:false , message : "unauthorised- no user"});

        res.status(200).json({
            success : true,
            message : "auth checked",
            user
        })

    } catch (error) {
        console.log("Error during check auth :", error.message);
        res.status(500).json({
            success : false,
            message : "An error occurred during check auth",
            error : error.message
        })
    }
}