const path = require("path");
const Subject = require("../models/Subject");
const Lecture = require("../models/Lecture");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const User = require("../models/User");

// api/v1/Subjects
exports.getSubjects = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Subject);

  const subject = await Subject.find(req.query, select)
    .populate({
      path: "lecture",
      select: "name level",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: subject.length,
    data: subject,
    pagination,
  });
});

// api/v1/lectures/:lecId/lessons
exports.getSubjectLessons = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Subject);

  const subjects = await Subject.find(
    { ...req.query, lecture: req.params.lectureId },
    select
  )
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: subjects.length,
    data: subjects,
    pagination,
  });
});

exports.getSubject = asyncHandler(async (req, res, next) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    throw new MyError(req.params.id + " ID бүхий хичээл байхгүй байна.", 404);
  }
  res.status(200).json({
    success: true,
    data: subject,
  });
});

exports.createSubject = asyncHandler(async (req, res, next) => {
  const lecture = await Lecture.findById(req.body.lecture);

  if (!lecture) {
    throw new MyError(
      req.body.lecture + " ID бүхий сургалт байхгүй байна.",
      400
    );
  }

  req.body.createUser = req.userId;

  const subject = await Subject.create(req.body);

  res.status(200).json({
    success: true,
    data: subject,
  });
});

exports.deleteSubject = asyncHandler(async (req, res, next) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    throw new MyError(req.params.id + " ID бүхий хичээл байхгүй байна.", 404);
  }

  const user = await User.findById(req.userId);

  subject.remove();

  res.status(200).json({
    success: true,
    data: subject,
    whoDeleted: user.name,
  });
});

exports.updateSubject = asyncHandler(async (req, res, next) => {
  req.body.updateUser = req.userId;

  const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!subject) {
    throw new MyError(req.params.id + " ID бүхий хичээл байхгүй.", 400);
  }

  res.status(200).json({
    success: true,
    data: subject,
  });
});

// PUT: api/v1/subjects/:id/photo
exports.uploadSubjectPhoto = asyncHandler(async (req, res, next) => {
  const subject = await Subject.findById(req.params.id);
  if (!subject) {
    throw new MyError(req.params.id + " ID бүхий хичээл байхгүй.", 400);
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
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
    if (err) {
      throw new MyError(
        "Файл хуулах явцад алдаа гарлаа. Алдаа: " + err.message,
        400
      );
    }

    subject.photo = file.name;
    subject.save();

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

// api/v1/lectures/:lecId/subjects
exports.getLectureSubjects = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Subject);

  const subjects = await Subject.find(
    { ...req.query, lecture: req.params.lectureId },
    select
  )
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: subjects.length,
    data: subjects,
    pagination,
  });
});
