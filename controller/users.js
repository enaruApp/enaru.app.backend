const path = require("path");
const User = require("../models/User");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");

// register
exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  const token = user.getJsonWebToken();

  res.status(200).json({
    success: true,
    token,
    user: user,
  });
});

// login
exports.signin = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;

  // Оролт шалгах
  if (!phone || !password) {
    throw new MyError("Имэйл болон нууц үгээ дамжуулна уу", 400);
  }

  // Тухайн хэрэглэгчийг хайна
  const user = await User.findOne({ phone }).select("+password");
  if (!user) {
    throw new MyError("Имэйл болон нууц үг буруу байна...", 401);
  }

  const ok = await user.checkPassword(password);
  if (!ok) {
    throw new MyError("Имэйл болон нууц үг буруу байна", 401);
  }

  res.status(200).json({
    success: true,
    token: user.getJsonWebToken(),
    user: user,
  });
});

// api/v1/users
exports.getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, User);

  const user = await User.find(req.query, select)
    .populate({
      path: "lecture",
      select: "name level",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: user.length,
    data: user,
    pagination,
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new MyError(
      req.params.id + " ID бүхий хэрэглэгч байхгүй байна.",
      404
    );
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  req.body.updateUser = req.userId;

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new MyError(req.params.id + " ID бүхий хэрэглэгч байхгүй.", 400);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new MyError(
      req.params.id + " ID бүхий хэрэглэгч байхгүй байна.",
      404
    );
  }
  user.remove();
  res.status(200).json({
    success: true,
    data: user,
  });
});

// PUT: api/v1/users/:id/photo
exports.uploadUserPhoto = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new MyError(req.params.id + " ID бүхий хэрэглэгч байхгүй.", 400);
  }

  // image upload
  const file = req.files.file;

  //if (!file.mimetype.startsWith("image")) {
  //  throw new MyError("Та зураг upload хийнэ үү.", 400);
  //}

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

    user.photo = file.name;
    user.save();

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
