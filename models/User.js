const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  uNameF: {
    type: String,
    required: [true, "Хэрэглэгчийн овог оруулна уу"],
  },
  uNameL: {
    type: String,
    required: [true, "Хэрэглэгчийн нэр оруулна уу"],
  },
  phone: {
    type: String,
    unique: true,
    required: [true, "Хэрэглэгчийн утасны дугаар оруулна уу"],
  },
  email: {
    type: String,
    required: [true, "Хэрэглэгчийн имэйл хаягийг оруулна уу"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Имэйл хаяг буруу байна.",
    ],
    default: "user@mail.com",
  },
  role: {
    type: String,
    required: [true, "Хэрэглэгчийн эрхийг оруулна уу"],
    enum: ["user", "operator"],
    default: "user",
  },
  password: {
    type: String,
    minlength: 4,
    required: [true, "Нууц үгээ оруулна уу"],
    select: false,
  },
  level: {
    type: String,
    required: [true, "Хэрэглэгчийн зэргийг оруулна уу"],
    enum: [
      "Энгийн гишүүн",
      "Дэмжигч гишүүн",
      "Дэмжигч өрх",
      "Бүтээлч гишүүн",
      "Бүтээлч өрх",
    ],
    default: "Энгийн гишүүн",
  },
  uGender: {
    type: String,
    required: [true, "Хэрэглэгчийн хүйс оруулна уу"],
    enum: ["эрэгтэй", "эмэгтэй"],
    default: "эрэгтэй",
  },
  uRegister: {
    type: String,
    default: "-",
  },
  fNameF: {
    type: String,
    default: "-",
  },
  fNameL: {
    type: String,
    default: "-",
  },
  fRegister: {
    type: String,
    default: "-",
  },
  uMember: {
    type: String,
    required: [true, "Хэрэглэгчийн хүйс оруулна уу"],
    enum: ["эхнэр", "хүү", "охин", "ээж"],
    default: "эхнэр",
  },
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getJsonWebToken = function () {
  const token = jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRESIN,
    }
  );
  return token;
};

UserSchema.methods.checkPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
