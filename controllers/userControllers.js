const user = require("../models/User");

exports.getMe = async(req,res)=>{
    const user = await user.findByID(req.user.id).select('-password -refreshToken');
    res.json(user);
}

exports.getUsers = async(req, res)=>{
    const users = await user.find().select('-password -refreshToken');
    res.json(users);
}