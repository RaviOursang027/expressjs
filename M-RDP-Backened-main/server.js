// const https = require("https");
// const hostname = 'techmega.cloud';

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { insertAppData } = require("./models/appdetails");
const winston = require("winston");
require("dotenv").config();
// const fs = require("fs");

const app = express();

// Set up winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "your-service-name" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
// If we're not in production, also log to the console
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Connect to db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auth: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
  })
  .then(() => {
    console.log("DB connected");
    logger.info("DB connected");
  })
  .catch((err) => {
    console.log("DB Error => ", err);
    logger.error("DB Error => ", { error: err.message, stack: err.stack });
  });

// Call the function that inserts the data
insertAppData();

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// App middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());

// CORS settings for development environment
if (process.env.NODE_ENV === "development") {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://techmega.cloud:3000",
    "http://techmega.cloud",
    "https://techmega.cloud",
    "https://techmega.cloud:3000",
  ];

  app.use(
    cors({
      origin: allowedOrigins,
    })
  );
}

//techmega.cloud:3000/api

// Middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);

// JWT Error Handling Middleware
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    if (err.message === "jwt expired") {
      return res
        .status(401)
        .json({ message: "Session has expired, please sign in again." });
    }
    return res
      .status(401)
      .json({ message: "Unauthorized access, invalid token." });
  }
  next(err); // Pass the error to the next middleware
});

// Example of using the logger in a request to log info about the request
app.use((req, res, next) => {
  logger.info("Received request", {
    url: req.url,
    method: req.method,
    ip: req.ip,
  });
  next();
});

// Example of using the logger to log an error
app.use((err, req, res, next) => {
  logger.error("Error in request", {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });
  res.status(500).send("Something went wrong");
});

// Define the server port
const port = process.env.PORT || 8000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  logger.info(`Server is running on port: ${port}`);
});

// const options = {
//   key: fs.readFileSync("ssl/server.key"),                  //Change Private Key Path here
//   cert: fs.readFileSync("ssl/certificate.crt"),            //Change Main Certificate Path here
//   ca: fs.readFileSync('ssl/intermediate.crt'),             //Change Intermediate Certificate Path here
//   };

//   https.createServer(options, app)
// .listen(8000, function (req, res) {                        //Change Port Number here (if required, 443 is the standard port for https)
// console.log("Server started at port 8000");                //and here
// });
// module.exports.logger = logger;
