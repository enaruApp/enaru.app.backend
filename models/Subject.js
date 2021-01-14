const mongoose = require("mongoose");
const { token } = require("morgan");
const { transliterate, slugify } = require("transliteration");

const SubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Хичээлийн нэрийг оруулна уу"],
      unique: true,
      trim: true,
      maxlength: [
        250,
        "Хичээлийн нэрний урт дээд тал нь 250 тэмдэгт байх ёстой.",
      ],
    },
    lecturer: {
      type: String,
      required: [true, "Багшийн нэрийг оруулна уу"],
      trim: true,
      maxlength: [50, "Багшийн нэрний урт дээд тал нь 50 тэмдэгт байх ёстой."],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    video: {
      type: String,
      default: "no-video.jpg",
    },
    lecturerPhoto: {
      type: String,
      default: "no-photo.jpg",
    },
    content: {
      type: String,
      required: [true, "Хичээлийн агуулгыг оруулна уу"],
      trim: true,
      maxlength: [
        1000,
        "Хичээлийн агуулгын урт дээд тал нь 1000 тэмдэгт байх ёстой.",
      ],
    },
    lecture: {
      type: mongoose.Schema.ObjectId,
      ref: "Lecture",
      required: true,
    },
    createUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    updateUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Subject", SubjectSchema);
