import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaEye } from "react-icons/fa";
import {
  signinFailure,
  signinStart,
  signinSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import Loading from "../components/Loading";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const { error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(signinStart());
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signinFailure(data.message));
        return;
      }
      dispatch(signinSuccess(data));
      navigate("/");
    } catch (err) {
      signinFailure(err.message);
    }
  };
  const showPasswordHandler = () => {
    setShowPassword((prevState) => !prevState);
  };
  return (
    <section className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">Sign In</h1>
      <form onSubmit={submitHandler} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded-md"
          id="email"
          onChange={handleChange}
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="border p-2 rounded-md"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-blue-700 p-2 text-white rounded-md text-xl mt-2 hover:opacity-90 uppercase disabled:opacity-80 disabled:bg-slate-400"
        >
          {loading ? <Loading height={10} width={10} top={0} /> : "Sign In"}
        </button>

        <OAuth />
      </form>

      <button
        onClick={showPasswordHandler}
        className="relative -top-[10rem] -right-[90%] sm:-top-[10rem] sm:-right-[28rem] max-w-[100px]"
      >
        <FaEye className="text-xl hover:opacity-75" />
      </button>
      {error && <p className={`text-red-700 text-xs mt-3`}>{error}</p>}
      <p className="my-3">
        Dont have an account? {"  "}
        <Link
          to={"/sign-up"}
          className="text-blue-500 underline font-bold hover:text-blue-700"
        >
          Sign up
        </Link>
      </p>
    </section>
  );
};

export default SignIn;
