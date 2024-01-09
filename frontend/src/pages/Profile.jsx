import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";

import { app } from "../firebase";
import { Link } from "react-router-dom";
const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [formData, setFormData] = useState({});
  const [fileUploaded, setFileUploaded] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [userListingError, setUserListingError] = useState(null);
  const [userListing, setUserListing] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      fileHandle(file);
    }
  }, [file]);
  const fileHandle = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setFileUploadError(null);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setFileUploaded(progress);
      },
      (err) => {
        setFileUploadError(err);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) =>
          setFormData({ ...formData, avatar: downloadUrl })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const deleteAccountHandler = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const signoutHandler = async () => {
    dispatch(signOutUserStart());
    try {
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const getListinghandler = async () => {
    try {
      setUserListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === "false") {
        setUserListingError(true);
      }
      setUserListing(data);
    } catch (error) {
      setUserListingError(true);
    }
  };

  const listingDeleteHandler = async (id) => {
    try {
      const res = await fetch(`/api/list/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
      }
      setUserListing((prev) => prev.filter((listing) => listing._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="max-w-lg mx-auto my-5">
      <h1 className="text-3xl font-bold text-center my-7">Profile</h1>
      <form onSubmit={submitHandler} className="flex flex-col gap-4 ">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/.*"
        />
        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full w-14 h-14 object-cover self-center cursor-pointer"
          src={formData.avatar || currentUser.avatar}
          alt=""
        />
        <p className="text-sm text-center font-extrabold">
          {" "}
          {fileUploadError ? (
            <span className="text-red-700">
              Error image upload(Image must be less than 2 mb)
            </span>
          ) : fileUploaded > 1 && fileUploaded < 100 ? (
            <span className="text-slate-700">{`Image uploading ${fileUploaded}%`}</span>
          ) : fileUploaded === 100 && !fileUploadError ? (
            <span className="text-green-700">Image Successfully Uploaded</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.userName}
          onChange={handleChange}
          className="p-2 rounded-lg bg-slate-300"
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          className="p-2 rounded-lg bg-slate-300"
        />
        <input
          type="text"
          id="password"
          placeholder="Password"
          onChange={handleChange}
          className="p-2 rounded-lg bg-slate-300"
        />
        <button
          disabled={loading}
          className="bg-blue-700 p-2 text-white text-lg font-semibold rounded-lg hover:opacity-95 disabled:opacity-75 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          {loading ? "LOADING..." : "UPDATE"}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-blue-700 p-2 text-center text-white text-xl font-semibold rounded-lg hover:opacity-95 "
        >
          Create Listing
        </Link>
      </form>

      <p className="mt-3 text-red-800 font-semibold">{error ? error : ""}</p>
      <p className="mt-3 text-green-800 font-semibold">
        {updateSuccess ? "Profile updated successfully" : ""}
      </p>
      <div className="flex justify-between mt-7 text-red-800 font-semibold">
        <span
          onClick={deleteAccountHandler}
          className="cursor-pointer hover:opacity-95"
        >
          Delete Account
        </span>
        <span
          onClick={signoutHandler}
          className="cursor-pointer hover:opacity-95"
        >
          Sign Out
        </span>
      </div>
      <p className="text-red-700 font-semibold">
        {userListingError ? "Listing Error" : ""}
      </p>
      <button
        onClick={getListinghandler}
        className="text-center text-green-700 font-semibold w-full"
      >
        Show Listings
      </button>
      <ul>
        {userListing?.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-center mt-7 text-2xl font-bold">
              Your Listings
            </h1>
            {userListing.map((list) => (
              <div
                key={list._id}
                className="border px-3 flex justify-between items-center"
              >
                <Link
                  to={`/listing/${list._id}`}
                  className=" flex gap-3 items-center rounded-lg"
                >
                  <img
                    className="h-16 w-16 object-contain"
                    src={list.imageUrls[0]}
                    alt={list.name}
                  />
                  <h1 className="font-extrabold hover:underline truncate">
                    {list.name}
                  </h1>
                </Link>
                <div className="flex flex-col">
                  <button
                    onClick={() => listingDeleteHandler(list._id)}
                    className="text-red-800 font-semibold cursor-pointer"
                  >
                    DELETE
                  </button>
                  <Link
                    to={`/update-listing/${list._id}`}
                    className="text-green-800 font-semibold cursor-pointer"
                  >
                    EDIT
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </ul>
    </section>
  );
};

export default Profile;
