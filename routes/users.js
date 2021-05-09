const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadUserPhoto,
  signup,
  signin,
} = require("../controller/users");

const router = express.Router();

//router.route("/").get(protect, authorize("admin", "operator"), getUsers);
router.route("/").get(getUsers);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

router.route("/:id/photo").put(uploadUserPhoto);

router.route("/signup").post(signup);
router.route("/signin").post(signin);

module.exports = router;
