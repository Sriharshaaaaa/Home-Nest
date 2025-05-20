import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper } from "swiper/react";
import { SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import Listingitem from "./../components/Listingitem";

export const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fecthOfferListings = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/listing/get?offer=true&limit=4`
        );
        const data = await res.json();
        setOfferListings(data);
        fecthRentListings();
      } catch (error) {}
    };
    const fecthRentListings = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/listing/get?type=rent&limit=4`
        );
        const data = await res.json();
        setRentListings(data);
        fecthSaleListings();
      } catch (error) {}
    };
    const fecthSaleListings = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/listing/get?type=sale&limit=4`
        );
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {}
    };
    fecthOfferListings();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find Your next <span className="text-slate-500">Perfect</span>
          <br />
          Place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Home Next is the best place to find your next perfect place to live{" "}
          <br />
          We have a wide range of properties for you to choose from
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let's get started
        </Link>
      </div>
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      <div className="max-w-7xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="my-3">
            <h2 className="text-2xl font-semibold text-slate-600">
              Recent Offers
            </h2>
            <Link
              to={"/search/?offer=true"}
              className="text-sm font-semibold text-blue-800 hover:underline"
            >
              Show more offers
            </Link>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <Listingitem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="my-3">
            <h2 className="text-2xl font-semibold text-slate-600">
              Recent Places for rent
            </h2>
            <Link
              to={"/search/?type=rent"}
              className="text-sm font-semibold text-blue-800 hover:underline"
            >
              Show more places for rent
            </Link>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <Listingitem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="my-3">
            <h2 className="text-2xl font-semibold text-slate-600">
              Recent Places for sale
            </h2>
            <Link
              to={"/search/?type=sale"}
              className="text-sm font-semibold text-blue-800 hover:underline"
            >
              Show more places for sale
            </Link>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <Listingitem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
