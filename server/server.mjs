import express from "express";
import dotenv from "dotenv";
import { dirname } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
import dbConnect from "./config/database.js";
import cloudinaryConnect from './config/cloudinary.js';
import userRoutes from "./routes/user.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from 'express-fileupload';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// CORS Configuration
app.use(
  cors({
    origin: "*",
  })
);

// Middleware
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));
app.use(express.json());
app.use("/api/v1", userRoutes);
// Use the client
app.use(express.static(path.join(__dirname,'/client/dist')));

app.listen(PORT, () => {
  console.log(`THE SERVER IS UP AND RUNNING AT PORT ${PORT}`);
});

dbConnect();
cloudinaryConnect();


//render client for any path
app.get('*', (req, res)=>res.sendFile(path.join(__dirname,'client', 'dist', 'index.html')));

app.get("/", (req, res) => {
  res.send(`<h1>Backend is Running and this is '/' Route</h1>`);
});
