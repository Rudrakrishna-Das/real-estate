import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Swipers
import "swiper/css/bundle";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ListingItems from "../components/ListingItems";

const Home = () => {
  SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const res = await fetch("/api/list/get-listing?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListing();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListing = async () => {
      try {
        const res = await fetch("/api/list/get-listing?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListing();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaleListing = async () => {
      try {
        const res = await fetch("/api/list/get-listing?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListing();
  }, []);

  return (
    <section className="p-6">
      {/* top */}
      <div className="flex flex-col gap-8 my-32 max-w-6xl mx-auto transition-all duration-300">
        <h1 className="text-3xl lg:text-7xl text-slate-800 font-extrabold transition-all duration-300">
          Find your next <span className="text-slate-600">dream</span>
          <br />
          place with ease
        </h1>
        <div className="px-6 lg:px-52 text-sm lg:text-xl text text-slate-500 font-semibold transition-all duration-300">
          Rk Estate is the best place to find your next dream house.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          className="text-blue-600 text-lg pl-16 lg:pl-[35rem] font-bold hover:text-blue-800 transition-all duration-300"
          to={"/search"}
        >
          {" "}
          Let's Begain......
        </Link>
      </div>
      {/* swipper */}
      <Swiper navigation>
        {offerListings?.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                className="h-[550px]"
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      {/* listing results for offer sale rent */}

      <div className="max-w-7xl mx-auto p-3 my-10 flex flex-col gap-8">
        {offerListings?.length > 0 && (
          <div>
            <div>
              <h2 className="text-2xl text-slate-600 font-semibold">
                Recent Offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <ul className="flex flex-wrap gap-4 p-4">
              {offerListings.map((list) => (
                <li key={list._id}>
                  <ListingItems list={list} />
                </li>
              ))}
            </ul>
          </div>
        )}
        {rentListings?.length > 0 && (
          <div>
            <div>
              <h2 className="text-2xl text-slate-600 font-semibold">
                Recent Places for Rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                Show more offers
              </Link>
            </div>
            <ul className="flex flex-wrap gap-4 p-4">
              {rentListings.map((list) => (
                <li key={list._id}>
                  <ListingItems list={list} />
                </li>
              ))}
            </ul>
          </div>
        )}
        {saleListings?.length > 0 && (
          <div>
            <div>
              <h2 className="text-2xl text-slate-600 font-semibold">
                Recent Places for Sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=sale"}
              >
                Show more offers
              </Link>
            </div>
            <ul className="flex flex-wrap gap-4 p-4">
              {saleListings.map((list) => (
                <li key={list._id}>
                  <ListingItems list={list} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
