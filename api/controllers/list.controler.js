const Listing = require("../models/listing.model");

exports.createListing = async (req, res, next) => {
  console.log(req.body);
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
};
