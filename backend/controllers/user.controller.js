import User from "../models/user.model.js";

export const getCurrentUser = async(req, res)=>{
    try{
        let user= await User.findById(req.userId).select("-password");
        if(!user){
            return res.status(400).json({message:"user not found"});
        }
        res.status(200).json(user);
    }
    catch(error){
        res.status(500).json({message:`getCurrentUser error: ${error}`});
    }
}