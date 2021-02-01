const errorHandler = (err, req, res, next) => {
  const error = { ...err };

  error.message = err.message;

  if (error.message.startsWith("User validation failed: password: Path")) {
    error.message = "Нууц үг багадаа 4 тэмдэгтээс их байх ёстой.";
    error.statusCode = 401;
  }

  if (error.name === "CastError") {
    error.message = "Буруу бүтэцтэй ID байна.";
    error.statusCode = 400;
  }

  if (error.code === 11000) {
    error.message = "Энэ талбарын утгыг давхардуулж өгч болохгүй!";
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error,
  });
};

module.exports = errorHandler;
