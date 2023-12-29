const express = require("express");
const { createListing } = require("../controllers/list.controler");
const { verifyUser } = require("../utils/verifyUser");

const router = express.Router();

router.post("/create-listing", verifyUser, createListing);

module.exports = router;
