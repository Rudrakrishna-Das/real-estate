const express = require("express");
const {
  test,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const { verifyUser } = require("../utils/verifyUser");

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyUser, updateUser);
router.delete("/delete/:id", verifyUser, deleteUser);

module.exports = router;
