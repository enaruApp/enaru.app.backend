const express = require("express");
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controller/event");
const router = express.Router();

//"/api/v1/events"
router.route("/").get(getEvents).post(createEvent);
router.route("/:id").put(updateEvent).delete(deleteEvent);

module.exports = router;
