import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItems from "../components/ListingItems";
import BigLoading from "../components/BigLoading";

const Search = () => {
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    offer: false,
    parking: false,
    furnished: false,
    sort: "createdAt",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);
  const [showMore, setShowMore] = useState(false);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const sortFromUrl = urlParams.get("sort");
    const typeFromUrl = urlParams.get("type");
    const orderFromUrl = urlParams.get("order");
    const offerFromUrl = urlParams.get("offer");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const searchTermFromUrl = urlParams.get("searchTerm");

    if (
      searchTermFromUrl ||
      furnishedFromUrl ||
      parkingFromUrl ||
      offerFromUrl ||
      orderFromUrl ||
      typeFromUrl ||
      sortFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();

      const res = await fetch(`/api/list/get-listing?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }

      setListing(data);
      setLoading(false);
    };
    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "offer" ||
      e.target.id === "parking" ||
      e.target.id === "furnished"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";

      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const onShowMoreClick = async () => {
    const numberOfListing = listing.length;
    const startIndex = numberOfListing;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/list/get-listing?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListing([...listing, ...data]);
  };
  return (
    <section className="flex flex-col md:flex-row">
      <div className=" border-slate-300 border-b-2 md:border-r-2 md:border-b-0 p-3 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex gap-3  items-center">
            <p className="whitespace-nowrap font-semibold text-lg">
              Search Term:{" "}
            </p>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
              value={sidebarData.searchTerm}
            />
          </div>
          <div className="flex gap-3 ">
            <p className="font-semibold text-lg">Type: </p>
            <div className="flex gap-4 flex-wrap">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="all"
                  className="w-5"
                  checked={sidebarData.type === "all"}
                  onChange={handleChange}
                />
                <span> Rent & Sale</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5"
                  checked={sidebarData.type === "rent"}
                  onChange={handleChange}
                />
                <span> Rent</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5"
                  checked={sidebarData.type === "sale"}
                  onChange={handleChange}
                />
                <span> sale</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5"
                  checked={sidebarData.offer}
                  onChange={handleChange}
                />
                <span> offer</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <p className="font-semibold text-lg">Amenities: </p>
            <div className="flex gap-2">
              <input
                id="parking"
                type="checkbox"
                className="w-5"
                checked={sidebarData.parking}
                onChange={handleChange}
              />
              <span> Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                id="furnished"
                type="checkbox"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.furnished}
              />
              <span> Furnished</span>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <p className="font-semibold text-lg">Sort: </p>
            <select
              id="sort_order"
              className="border p-3 rounded-lg"
              onChange={handleChange}
              defaultValue="createdAt_desc"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white text-lg font-semibold p-2 rounded-lg hover:opacity-95 uppercase">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-4xl font-semibold p-3 pb-0 border-b text-slate-700 mt-2 underline">
          Listing results:
        </h1>
        <h3 className="text-sm text-slate-700 font-bold px-8 mt-1">
          (Showing {listing.length} results)
        </h3>

        <div className="p-7 text-center">
          {!loading && listing.length === 0 && (
            <p className="text-slate-700 text-2xl text-left">
              No Listing Found!
            </p>
          )}
          {loading && <BigLoading />}
          {!loading && listing.length > 0 && (
            <ul className=" flex flex-wrap gap-4">
              {listing.map((list) => (
                <li key={list._id}>
                  <ListingItems list={list} />
                </li>
              ))}
            </ul>
          )}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline text-center p-7 font-bold text-2xl"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Search;
