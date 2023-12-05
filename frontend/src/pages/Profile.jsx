import { useSelector } from "react-redux";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <section className="max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4 ">
        <img
          className="rounded-full w-14 h-14 object-cover self-center cursor-pointer"
          src={currentUser.avatar}
          alt=""
        />
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
