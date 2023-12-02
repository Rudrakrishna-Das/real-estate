import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      navigate("/sign-in");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };
  return (
    <section className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">Sign Up</h1>
      <form onSubmit={submitHandler} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="border p-2 rounded-md"
          id="userName"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded-md"
          id="email"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Password"
          className="border p-2 rounded-md"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-blue-700 p-2 text-white rounded-md text-xl mt-2 hover:opacity-90 disabled:opacity-80 disabled:bg-slate-400"
        >
          {loading ? "loading...." : "Sign Up"}
        </button>
      </form>
      {error && <p className={`text-red-700 text-xs mt-3`}>{error}</p>}
      <p className="my-3">
        Have an account? {"  "}
        <Link
          to={"/sign-in"}
          className="text-blue-500 underline font-bold hover:text-blue-700"
        >
          Sign In
        </Link>
      </p>
    </section>
  );
};

export default SignUp;
