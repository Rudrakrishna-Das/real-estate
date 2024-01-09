const express = require("express");
const {
  createListing,
  deleteListing,
  updateListing,
  getListing,
} = require("../controllers/list.controler");
const { verifyUser } = require("../utils/verifyUser");

const router = express.Router();

router.post("/create-listing", verifyUser, createListing);
router.delete("/delete/:id", verifyUser, deleteListing);
router.post("/update/:id", verifyUser, updateListing);
router.get("/get-list/:listId", getListing);

module.exports = router;
