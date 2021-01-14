const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  getLectures,
  getLecture,
  createLecture,
  updateLecture,
  deleteLecture,
} = require("../controller/lectures");

// /api/v1/lectures/:id/subjects
const { getLectureSubjects } = require("../controller/subjects");
router.route("/:lectureId/subjects").get(getLectureSubjects);

//"/api/v1/lectures"
router
  .route("/")
  .get(getLectures)
  .post(protect, authorize("admin"), createLecture);
router
  .route("/:id")
  .get(getLecture)
  .put(protect, authorize("admin", "operator"), updateLecture)
  .delete(protect, authorize("admin"), deleteLecture);

module.exports = router;
