const express = require("express");

const { register, login } = require("../controller/users");

const router = express.Router();

router.route("/signup").post(register);
router.route("/signin").post(login);

module.exports = router;
