import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const Listing = () => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({ imageUrls: [] });
  const [imageUploadError, setImageUploadError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = () => {
    setLoading(true);
    if (files.length === 0) {
      setImageUploadError("No Image provided for Uploaded");
      setLoading(false);
      return;
    }
    const filesLength = files.length + formData.imageUrls.length;

    if (filesLength > 7) {
      setImageUploadError("Can only uploaded 6 images");
      setLoading(false);
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
        setLoading(false);
      })
      .catch((err) => {
        setImageUploadError(
          "Image Uplaod Failed. (only less than 4mb image can be uploaded)"
        );
        setLoading(false);
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
  console.log(files);
  const removeImageHandler = (index) => {
    setLoading(true);
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((url, i) => i !== index),
    });
    setLoading(false);
  };
  return (
    <main className="max-w-4xl mx-auto p-3">
      <h1 className="font-bold text-3xl text-center py-3">Create a Listing</h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <input
            className="rounded-lg p-3 border"
            type="text"
            placeholder="Name"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            className="rounded-lg p-3 border"
            name="description"
            id="description"
            cols="40"
            rows="2"
            placeholder="Description"
            required
          ></textarea>
          <input
            className="rounded-lg p-3 border"
            type="text"
            id="address"
            placeholder="Address"
            required
          />
          <div className="flex gap-6 my-2 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sell" className="w-5" />
              <span className="font-semibold"> Sell </span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span className="font-semibold"> Rent </span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="parking_spot" className="w-5" />
              <span className="font-semibold"> Parking Spot </span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span className="font-semibold"> Furnished </span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span className="font-semibold"> Offer </span>
            </div>
          </div>
          {/* Info */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                min="1"
                type="number"
                id="beds"
                max="10"
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
                id="baths"
                max="10"
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
                id="regular_price"
                className="p-3 w-16 rounded-lg border"
              />
              <div className="flex flex-col items-center">
                <p className="font-semibold text-sm"> Regular price</p>
                <span className="text-xs">(rs/month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                min="0"
                type="number"
                id="discounted_price"
                className="p-3 w-16 rounded-lg border"
              />
              <div className="flex flex-col items-center">
                <p className="font-semibold text-sm"> Discounted price</p>
                <span className="text-xs">(rs/month)</span>
              </div>
            </div>
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
              disabled={loading}
              onClick={handleImageSubmit}
              className="p-3 text-lg text-green-600 border-2 border-green-400 rounded-lg uppercase hover:shadow-lg disabled:text-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "UPLOADING....." : "UPLOAD"}
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
                  disabled={loading}
                  className="border-2 border-red-700 text-red-700 h-10 px-5 py-0 uppercase hover:translate-x-1 duration-500"
                >
                  {loading ? "deleting..." : "Delete"}
                </button>
              </div>
            ))}

          <button className="bg-blue-700 p-2 text-center text-white text-xl font-semibold rounded-lg hover:opacity-95">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default Listing;
