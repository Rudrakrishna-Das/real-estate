import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signinSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const googleAuthHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
        }),
      });

      const data = await res.json();
      dispatch(signinSuccess(data));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      onClick={googleAuthHandler}
      type="button"
      className="bg-blue-950 p-2 text-white rounded-md text-xl hover:opacity-95"
    >
      Continue With Google
    </button>
  );
};

export default OAuth;
