import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [formData, setFormData] = useState({});
  const [fileUploaded, setFileUploaded] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);

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

  return (
    <section className="max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4 ">
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
            <span className="text-red-700">Failed Image Upload</span>
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
          className="p-2 rounded-lg bg-slate-300"
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="p-2 rounded-lg bg-slate-300"
        />
        <input
          type="text"
          id="password"
          placeholder="Password"
          className="p-2 rounded-lg bg-slate-300"
        />
        <button className="bg-blue-700 p-2 text-white text-lg font-semibold rounded-lg hover:opacity-95 disabled:opacity-75 disabled:bg-slate-300 disabled:cursor-not-allowed">
          UPDATE
        </button>
      </form>
      <div className="flex justify-between mt-5 text-red-800 font-semibold">
        <span className="cursor-pointer hover:opacity-95">Delete Account</span>
        <span className="cursor-pointer hover:opacity-95">Sign Out</span>
      </div>
    </section>
  );
};

export default Profile;
