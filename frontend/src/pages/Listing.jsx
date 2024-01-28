import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaHome,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";
import BigLoading from "../components/BigLoading";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listing, setListing] = useState(null);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/list/get-list/${params.listingId}`);
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(true);
        return;
      }
      setListing(data);
      setLoading(false);
    };
    fetchList();
  }, []);

  return (
    <main>
      {loading && <BigLoading />}
      {error && (
        <p className="text-center text-4xl mt- font-extrabold text text-red-700">
          {" "}
          Something went wrong
        </p>
      )}{" "}
      {listing && !error && !loading && (
        <>
          {" "}
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[350px] m-2"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                    objectFit: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[20%] right-[3%] z-10 border rounded-full ems-center bg-slate-100 cursor-pointer hover:scale-95">
            {" "}
            <FaShare
              className="text-slate-600 m-3 text-lg"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto gap-4 p-3">
            <p className="text-xl underline font-semibold flex items-end gap-3">
              <FaHome className="text-4xl text-orange-900" />
              {listing.name} -{" rs "}
              {listing.offer ? listing.discountedPrice : listing.regularPrice}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900  shadow-red-950 shadow-md w-full max-w-[200px] text-white text-xl font-semibold text-center p-1 rounded-lg">
                {listing.type === "rent" ? "For rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 shadow-green-950 shadow-md w-full max-w-[200px] text-white text-xl font-semibold text-center p-1 rounded-lg">
                  rs {+listing.regularPrice - +listing.discountedPrice}{" "}
                  <span className="text-sm text-blue-300">DISCOUNT</span>
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="text-black font-semibold">Description:-</span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-2">
                <FaBed className="text-2xl" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className="flex items-center gap-2">
                <FaBath className="text-2xl" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </li>
              <li className="flex items-center gap-2">
                <FaParking className="text-2xl" />
                {listing.parking ? `Parking` : `No Parking`}
              </li>
              <li className="flex items-center gap-2">
                <FaChair className="text-2xl" />
                {listing.furnished ? `Furnished` : `No Furnished`}
              </li>
            </ul>
            {currentUser && !contact && listing.userRef !== currentUser._id && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white uppercase rounded-lg p-3 font-semibold transition-all duration-500  hover:bg-slate-900"
              >
                Contact Landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </>
      )}
    </main>
  );
};

export default Listing;
