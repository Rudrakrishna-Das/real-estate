const Listing = require("../models/listing.model");
const { errorHandler } = require("../utils/error");

exports.createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
};

exports.deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(404, "You can only delete your own Listings"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted");
  } catch (error) {
    next(error);
  }
};

exports.updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(401, "Listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listing"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

exports.getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.listId);
    if (!listing) {
      return next(errorHandler(401, "No listing Found"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

exports.getListings = async (req, res, next) => {
  const limit = req.query.limit || 9;
  const startIndex = parseInt(req.query.startIndex) || 0;

  let offer = req.query.offer;
  if (!offer) {
    offer = { $in: [false, true] };
  }

  let furnished = req.query.furnished;
  if (!furnished) {
    furnished = { $in: [false, true] };
  }

  let parking = req.query.parking;
  if (!parking) {
    parking = { $in: [false, true] };
  }

  let type = req.query.type;
  if (type === undefined || type === "all") {
    type = { $in: ["sale", "rent"] };
  }

  const searchTerm = req.query.searchTerm || "";
  const sort = req.query.sort || "createdAt";
  const order = req.query.order || "desc";

  try {
    const listings = await Listing.find({
      type,
      offer,
      parking,
      furnished,
      name: { $regex: searchTerm, $options: "i" },
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
