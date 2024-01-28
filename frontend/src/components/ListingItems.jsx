import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

const ListingItems = ({ list }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg hover:bg-slate-200 transition-all duration-500 w-full sm:w-[280px]">
      <Link className="flex flex-col gap-2" to={`/listing/${list._id}`}>
        <div className="overflow-hidden rounded-t-lg">
          <img
            src={list.imageUrls[0]}
            alt="cover Image"
            className="h-44 w-full object-cover hover:scale-110 transition-scale duration-500"
          />
        </div>
        <div className="text-left p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {list.name}
          </p>
          <div className="flex gap-2 items-center">
            <MdLocationOn className="text-green-600 h-4 w-4" />
            <p className="text-sm text-gray-600 truncate w-full">
              {list.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {list.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold">
            rs.{" "}
            {list.offer
              ? list.discountedPrice.toLocaleString("en-us")
              : list.regularPrice.toLocaleString("en-us")}{" "}
            {list.type === "rent" && "/month"}
          </p>
          <div className="flex gap-4 font-bold text-xs text-slate-700">
            <div>
              {list.bedrooms > 1
                ? `${list.bedrooms} beds`
                : `${list.bedrooms} bed`}
            </div>
            <div>
              {list.bathrooms > 1
                ? `${list.bathrooms} baths`
                : `${list.bedrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
export default ListingItems;
