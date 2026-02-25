import express from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { genToken } from "../config/token.js";

export const signUp =async(req,res)=>{
    try{
        const {name,email,password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const hashPassword = await bcrypt.hash(password,10);
        let user = await User.create({name , email , password:hashPassword});

        let token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV ="production",
            sameSite:"strict",
            maxAge:10*24*60*60*1000
        })
        return res.status(201).json(user);
    }
    catch(error){
        console.log("Error in sign up",error);
    }
}

export const signIn = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid password"});
        }
        let token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge:10*24*60*60*1000
        })
        return res.status(201).json(user);
    }
        catch(error){
            console.log("Error in sign in",error);
    }
}

export const signOut = async(req,res)=>{
    try{
        res.clearCookie("token");
        return res.status(200).json({message:"Sign out successful"});
    }
    catch(error){
        console.log("Error in sign out",error);
    }
}