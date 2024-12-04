import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      requied: true,
    },
    description: {
      type: String,
      requied: true,
    },
    address: {
      type: String,
      requied: true,
    },
    regularPrice: {
      type: Number,
      requied: true,
    },
    discountPrice: {
      type: Number,
      requied: true,
    },
    bathrooms: {
      type: Number,
      requied: true,
    },
    bedrooms: {
      type: Number,
      requied: true,
    },
    furnished: {
      type: Boolean,
      requied: true,
    },
    parking: {
      type: Boolean,
      requied: true,
    },
    type: {
      type: String,
      requied: true,
    },
    offer: {
      type: Boolean,
      requied: true,
    },
    imageUrls: {
      type: Array,
      requied: true,
    },
    useRef: {
      type: String,
      requied: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
