require('dotenv').config();
// require('express-async-errors');
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');




const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:'http://localhost:3000', credentials: true}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));