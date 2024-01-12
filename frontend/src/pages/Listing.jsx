import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import Loading from "../components/Loading";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listing, setListing] = useState(null);
  const params = useParams();
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

  console.log(listing);

  return (
    <main>
      {loading && <Loading />}
      {error && (
        <p className="text-center text-4xl mt-8 font-extrabold text text-red-700">
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
                  className="h-[550px] m-2"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </main>
  );
};

export default Listing;
