const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");

const LectureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Сургалтын нэрийг оруулна уу"],
      unique: true,
      trim: true,
      maxlength: [
        50,
        "Сургалтын нэрний урт дээд тал нь 50 тэмдэгт байх ёстой.",
      ],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Сургалтын тайлбарыг оруулна уу"],
      trim: true,
      maxlength: [
        600,
        "Сургалтын тайлбарын урт дээд тал нь 600 тэмдэгт байх ёстой.",
      ],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    level: {
      type: Number,
      min: [1, "Сургалтын түвшин хамгийн багадаа 1 байх ёстой"],
      max: [5, "Сургалтын түвшин хамгийн ихдээ 5 байх ёстой"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//LectureSchema.virtual("books", {
//  ref: "Book",
//  localField: "_id",
//  foreignField: "category",
//  justOne: false,
// });

LectureSchema.pre("save", function (next) {
  // name хөрвүүлэх
  this.slug = slugify(this.name);
  next();
});

//LectureSchema.pre("remove", async function (next) {
//  await this.model("Book").deleteMany({ category: this._id });
//  next();
// });

module.exports = mongoose.model("Lecture", LectureSchema);
