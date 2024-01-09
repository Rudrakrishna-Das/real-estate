import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getListing = async () => {
      const res = await fetch(`/api/list/get-list/${params.listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setFormData(data);
    };
    getListing();
  }, []);

  const handleImageSubmit = () => {
    setUploading(true);
    if (files.length === 0) {
      setImageUploadError("No Image provided for Uploaded");
      setUploading(false);
      return;
    }
    const filesLength = files.length + formData.imageUrls.length;

    if (filesLength > 7) {
      setImageUploadError("Can only uploaded 6 images");
      setUploading(false);
      return;
    }
    const promises = [];
    for (let i = 0; i < files.length; i++) {
      promises.push(storeImages(files[i]));
    }
    Promise.all(promises)
      .then((urls) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImageUploadError(null);
        setUploading(false);
      })
      .catch((err) => {
        setImageUploadError(
          "Image Uplaod Failed. (only less than 4mb image can be uploaded)"
        );
        setUploading(false);
      });
  };

  const storeImages = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Uplod is ${progress}% done.`);
        },
        (err) => {
          reject(err);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            console.log(downloadUrl);
            resolve(downloadUrl);
          });
        }
      );
    });
  };

  const removeImageHandler = (index) => {
    setUploading(true);
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((url, i) => i !== index),
    });
    setUploading(false);
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (formData.imageUrls.length < 1)
      return setError("You must have to upload 1 image");
    if (formData.regularPrice < formData.discountedPrice)
      return setError("Discounted Price must be lower than Regular Price");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/list/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/create-listing/${data._id}`);
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <main className="max-w-4xl mx-auto p-3">
      <h1 className="font-bold text-3xl text-center py-3">Update a Listing</h1>
      <form
        onSubmit={submitHandler}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex flex-col gap-2 flex-1">
          <input
            className="rounded-lg p-3 border"
            type="text"
            placeholder="Name"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            className="rounded-lg p-3 border"
            name="description"
            id="description"
            cols="40"
            rows="2"
            placeholder="Description"
            required
            onChange={handleChange}
            value={formData.description}
          ></textarea>
          <input
            className="rounded-lg p-3 border"
            type="text"
            id="address"
            placeholder="Address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 my-2 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span className="font-semibold"> Sale </span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span className="font-semibold"> Rent </span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span className="font-semibold"> Parking Spot </span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span className="font-semibold"> Furnished </span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span className="font-semibold"> Offer </span>
            </div>
          </div>
          {/* Info */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                min="1"
                type="number"
                id="bedrooms"
                max="10"
                onChange={handleChange}
                value={formData.bedrooms}
                className="p-3 w-16 rounded-lg border"
              />
              <div>
                <p className="font-semibold text-sm"> Beds</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                min="1"
                type="number"
                id="bathrooms"
                max="10"
                onChange={handleChange}
                value={formData.bathrooms}
                className="p-3 w-16 rounded-lg border"
              />
              <div>
                <p className="font-semibold text-sm"> Baths</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                min="0"
                type="number"
                id="regularPrice"
                onChange={handleChange}
                value={formData.regularPrice}
                className="p-3 w-16 rounded-lg border"
              />
              <div className="flex flex-col items-center">
                <p className="font-semibold text-sm"> Regular price</p>
                <span className="text-xs">(rs/month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  min="0"
                  type="number"
                  id="discountedPrice"
                  onChange={handleChange}
                  value={formData.discountedPrice}
                  className="p-3 w-16 rounded-lg border"
                />
                <div className="flex flex-col items-center">
                  <p className="font-semibold text-sm"> Discounted price</p>
                  <span className="text-xs">(rs/month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images:
            <span className="text-sm font-normal text-blue-400 ml-2">
              {" "}
              The first image will be the cover (max:6)
            </span>
          </p>
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border-[1px] border-gray-300 rounded-lg w-full hover:cursor-pointer"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-lg text-green-600 border-2 border-green-400 rounded-lg uppercase hover:shadow-lg disabled:text-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed"
            >
              {uploading ? "UPLOADING....." : "UPLOAD"}
            </button>
          </div>
          <p className="text-sm text-red-700">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, i) => (
              <div
                key={url}
                className="flex justify-around items-center border p-2"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-40 h-14 object-cover rounded-lg border-2 border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => removeImageHandler(i)}
                  disabled={uploading}
                  className="border-2 border-red-700 text-red-700 h-10 px-5 py-0 uppercase hover:translate-x-1 duration-500"
                >
                  {uploading ? "deleting..." : "Delete"}
                </button>
              </div>
            ))}

          <button
            disabled={loading || uploading}
            className="bg-blue-700 p-2 text-center text-white text-xl font-semibold rounded-lg hover:opacity-95 disabled:bg-slate-500 disabled:cursor-not-allowed"
          >
            {loading ? "Updating...." : "Update Listing"}
          </button>
          {error && (
            <p className={`text-red-700 text-xs mt-3 font-semibold`}>{error}</p>
          )}
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;
