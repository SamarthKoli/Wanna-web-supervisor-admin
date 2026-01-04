const bcrypt=require("bcrypt");
const user=require("../models/user");
const {generateToken} =require("../utils/jwtUtils");

async function login(email,password){
    try{
        const existingUser=await user.findOne({email});
        if(!existingUser){
            throw new Error("User not found");
        }
        const isPasswordValid=bcrypt.compare(password,existingUser.password);
        if(!isPasswordValid){
            throw new Error("Incorrect password");
        }
        const token=generateToken({
            id: existingUser._id,
            email: existingUser.email,
            role: existingUser.role,
          });
        return { token, user: existingUser }; 
    }catch(error){
        console.error(error.message);
        throw new Error("Invalid credentials");
    }
}
module.exports={
    login,
};