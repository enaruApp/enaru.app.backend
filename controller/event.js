const path = require("path");
const Event = require("../models/Event");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");

// api/v1/events
exports.getEvents = asyncHandler(async (req, res, next) => {
  const event = await Event.find();

  res.status(200).json({
    success: true,
    data: event,
  });
});

exports.createEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.create(req.body);
  res.status(200).json({
    success: true,
    data: event,
  });
});

exports.updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!event) {
    throw new MyError(req.params.id + " ID бүхий үйл явдал байхгүй.", 400);
  }
  res.status(200).json({
    success: true,
    data: event,
  });
});

exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    throw new MyError(req.params.id + " ID бүхий үйл явдал байхгүй.", 400);
  }

  event.remove();

  res.status(200).json({
    success: true,
    data: event,
  });
});
