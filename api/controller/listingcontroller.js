import { errorHandler } from "../utils/error.js";
import Listing from "./../models/listingmodel.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, "Listing Not Found"));
  // if (req.user.id !== listing.useRef)
  //   return next(errorHandler(404, "You can only delete Your own listings"));
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing Has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, "Listing Not Found"));
  // if (req.user.id !== listing.useRef)
  //   return next(errorHandler(401, "You can only update Your own listings"));
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

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing Not Found"));
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    console.log("Received request with query:", req.query);

    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    } else {
      offer = offer === "true";
    }
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [true, false] };
    } else {
      furnished = furnished === "true";
    }
    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [true, false] };
    } else {
      parking = parking === "true";
    }
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["rent", "sale"] };
    }
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const query = {
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    };

    console.log("Processed query parameters:", {
      limit,
      startIndex,
      offer,
      furnished,
      parking,
      type,
      searchTerm,
      sort,
      order,
    });

    console.log("Final MongoDB query:", JSON.stringify(query, null, 2));

    try {
      const listings = await Listing.find(query)
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);

      console.log("Number of listings found:", listings.length);
      return res.status(200).json(listings);
    } catch (dbError) {
      console.error("Database query error:", dbError);
      return next(
        errorHandler(500, "Database query error: " + dbError.message)
      );
    }
  } catch (error) {
    console.error("Error in getListings:", error);
    return next(errorHandler(500, "Error fetching listings: " + error.message));
  }
};
