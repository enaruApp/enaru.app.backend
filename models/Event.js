const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: [true, "Үйл явдлын нэрийг оруулна уу"],
  },
  eventDate: {
    type: String,
    required: [true, "Үйл явдлын огноог оруулна уу"],
  },
  eventTitle: {
    type: String,
    required: [true, "Үйл явдлын гарчигийг оруулна уу"],
  },
  eventDescription: {
    type: String,
    required: [true, "Үйл явдлын текстийг оруулна уу"],
  },
  eventPhoto: {
    type: String,
    default: "event-photo.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", EventSchema);
