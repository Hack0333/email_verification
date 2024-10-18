import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./Db/ connect.js";
import authRoutes from "./route/auth.route.js";
import cookieParser from "cookie-parser";
dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use('/api/auth', authRoutes);


app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});