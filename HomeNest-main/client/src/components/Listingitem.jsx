import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function Listingitem({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[300px] ">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 trasition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {listing.name}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <MdLocationOn className="h-4 w-4 text-green-700 ml-2" />
          <p className="text-md text-gray-600 truncate">{listing.address}</p>
        </div>
        <p className=" ml-3 text-md text-gray-600 line-clamp-2">
          {listing.description}
        </p>
        <p className="text-slate-500 mt-2 font-semibold ml-3 flex items-center">
          $
          {listing.offer
            ? listing.discountPrice.toLocaleString("en-US")
            : listing.regularPrice.toLocaleString("en-US")}
          {listing.type === "rent" && "/month"}
        </p>
        <div className="text-slate-700 flex gap-3">
          <div className="font-bold text-sm ml-3 ">
            {listing.bedrooms > 1
              ? `${listing.bedrooms} beds`
              : `${listing.bedrooms} bed`}
          </div>
          <div className="font-bold text-sm ">
            {listing.bathrooms > 1
              ? `${listing.bathrooms} baths`
              : `${listing.bathrooms} bath`}
          </div>
        </div>
      </Link>
    </div>
  );
}
