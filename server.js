const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const rfs = require("rotating-file-stream");
const connectDB = require("./config/db");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const morgan = require("morgan");
const logger = require("./middleware/logger");
const fileupload = require("express-fileupload");
const cors = require("cors");
//Router оруулж ирэх
const lecturesRoutes = require("./routes/lectures");
const subjectsRoutes = require("./routes/subjects");
const usersRoutes = require("./routes/users");
const eventRoutes = require("./routes/event");

// Аппын тохиргоог process.env ачаалах
dotenv.config({ path: "./config/config.env" });

connectDB();

// create a write stream (in appned mode)
var accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: path.join(__dirname, "log"),
});

const app = express();

var whitelist = [
  "http://localhost:3000",
  "http://localhost:8000",
  "128.199.248.252:8000",
];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS зөвшөөрөөгүй."));
    }
  },
};

// Body parser
app.use(express.json());
app.use(cors());
app.use(fileupload());
app.use(logger);
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/api/v1/lectures", lecturesRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/subjects", subjectsRoutes);
app.use("/api/v1/events", eventRoutes);
app.use(errorHandler);

const server = app.listen(
  process.env.PORT,
  console.log(`Express сервер ${process.env.PORT} порт дээр аслаа...`.blue)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Алдаа гарчээ : ${err.message}`.underline.red.bold);
  server.close(() => {
    process.exit(1);
  });
});
