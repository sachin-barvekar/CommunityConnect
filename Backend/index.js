const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/database");
const  cloudinaryConnect  = require('./config/cloudinary');
const userRoutes = require("./routes/user");
const app = express();
var cors = require("cors");
const PORT = process.env.PORT || 3000;

// CORS Configuration
app.use(
  cors({
    origin: "*",
  })
);

// Middleware
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const fileUpload = require('express-fileupload');
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
})); //middleware to interact files and express with server(file-upload used for upload files on server)

app.use(express.json());

app.use("/api/v1", userRoutes);

app.listen(PORT, () => {
  console.log(`THE SERVER IS UP AND RUNNING AT PORT ${PORT}`);
});

dbConnect();
//cloud se connect kran hai
cloudinaryConnect();

app.get("/", (req, res) => {
  res.send(`<h1>Backend is Running and this is '/' Route</h1>`);
});