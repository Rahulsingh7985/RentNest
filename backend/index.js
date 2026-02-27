import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
dotenv.config();

let port = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use('/api/auth',authRouter)
app.use('/api/user', userRouter)

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
    connectDB();
})

