import jwt from 'jsonwebtoken';

export const genToken =(async(userId)=>{
    try{
        let token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"10d"});
        return token;
    }
    catch(error){
        console.log("Error in generating token",error);
    }
})