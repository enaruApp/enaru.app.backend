const path = require("path");
const Lecture = require("../models/Lecture");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");

exports.getLectures = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Lecture);

  const lectures = await Lecture.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: lectures,
    pagination,
  });
});

exports.getLecture = asyncHandler(async (req, res, next) => {
  //const lecture = await Lecture.findById(req.params.id).populate("books");
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) {
    throw new MyError(req.params.id + " ID бүхий сургалт байхгүй.", 400);
  }
  res.status(200).json({
    success: true,
    data: lecture,
  });
});

exports.createLecture = asyncHandler(async (req, res, next) => {
  const lecture = await Lecture.create(req.body);
  res.status(200).json({
    success: true,
    data: lecture,
  });
});

exports.updateLecture = asyncHandler(async (req, res, next) => {
  const lecture = await Lecture.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!lecture) {
    throw new MyError(req.params.id + " ID бүхий сургалт байхгүй.", 400);
  }
  res.status(200).json({
    success: true,
    data: lecture,
  });
});

exports.deleteLecture = asyncHandler(async (req, res, next) => {
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) {
    throw new MyError(req.params.id + " ID бүхий сургалт байхгүй.", 400);
  }

  lecture.remove();

  res.status(200).json({
    success: true,
    data: lecture,
  });
});

// PUT: api/v1/lectures/:id/photo
exports.uploadLecturePhoto = asyncHandler(async (req, res, next) => {
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) {
    throw new MyError(req.params.id + " ID бүхий сургалт байхгүй.", 400);
  }

  // image upload
  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    throw new MyError("Та зураг upoad хийнэ үү.", 400);
  }
  if (file.size > process.env.MAX_UPLOAD_FILE_SIZE) {
    throw new MyError("Та зурагны хэмжээ хэтэрсэн байна.", 400);
  }

  file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/image/${file.name}`, (err) => {
    if (err) {
      throw new MyError(
        "Файл хуулах явцад алдаа гарлаа. Алдаа: " + err.message,
        400
      );
    }

    lecture.photo = file.name;
    lecture.save();

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
