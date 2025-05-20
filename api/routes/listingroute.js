import express from "express";
import {
  createListing,
  deleteListing,
  getListing,
  getListings,
  updateListing,
} from "../controller/listingcontroller.js";
import { verifyToken } from "./../utils/verifyUser.js";

const router = express.Router();

router.post("/create", createListing);
router.get("/delete/:id", deleteListing);
router.post("/update/:id", updateListing);
router.get("/get/:id", getListing);
router.get("/get", getListings);

export default router;
