const User = require("../models/User");
const {createAccessToken, createRefreshTokne, createRefreshToken} = require("../utils/generateTokens");
const jwt = require('jsonwebtoken');

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAME_SITE || 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
};

exports.register = async (req, res) =>{
    const {name, email, password} = req.body;
    if(!name || !email || !password) return res.status(400).json({message: "Missing fields"});


    const existing = await User.findOne({email});
    if(existing) return res.status(400).json({message:'User already Exists'});

    const user = await User.create({name, email, password});

    const accessToken = createAccessToken({id: user._id, role:user.role});
    const refreshToken = createRefreshToken({id: user._id, role:user.role});

    user.refreshToken = refreshToken;

    await user.save();

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.status(201).json({user:{id:user._id, name:user.name, email: user.email, role: user.role}, accessToken});

};

exports.login = async (req, res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(!user) return res.status(401).json({message:"Invalid Credentials"});

};

exports.logout = async (req, res) =>{
    const refreshToken = req.cookies?.refreshToken;
    if(!refreshToken) return res.sendStatus(204);

    const user = await user.findOne({refreshToken});
    if(user){
        user.refreshToken = undefined;
        await user.save();
    }

    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    res.json({message: "Logged Out"});
};

exports.refreshToken = async (req, res) =>{
    const token = req.cookies?.refreshToken;
    if(!token) return res.status(401).json({message:"No refresh token"});

    try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(payload.id);
        if(!user || user.refreshToken !== token) return res.status(401).json({message:"Invalid refresh token"});

        const accessToken = createAccessToken({id: user._id, role:user.role,});
        const newFefreshToken = createRefreshToken({id: user._id, role: user.role});
        user.refreshToken = newRefreshToken;
        await user.save();
        res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);
        res.json({accessToken});
    } catch (error) {
        return res.status(401).json({message:"Invalid refresh token"});
    }
}
