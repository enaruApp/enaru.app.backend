const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");
const Lecture = require("./models/Lecture");
const Subject = require("./models/Subject");

dotenv.config({ path: "./config/config.env" });

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const lectures = JSON.parse(
  fs.readFileSync(__dirname + "/data/lectures.json", "utf-8")
);

const subjects = JSON.parse(
  fs.readFileSync(__dirname + "/data/subjects.json", "utf-8")
);

const importData = async () => {
  try {
    await Lecture.create(lectures);
    await Subject.create(subjects);
    console.log("Өгөгдлийг импортлолоо....".green.inverse);
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Lecture.deleteMany();
    await Subject.deleteMany();
    console.log("Өгөгдлийг бүгдийг устгалаа....".red.inverse);
  } catch (err) {
    console.log(err.red.inverse);
  }
};

if (process.argv[2] == "-i") {
  importData();
} else if (process.argv[2] == "-d") {
  deleteData();
}
