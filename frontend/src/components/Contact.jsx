import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    landlord && (
      <section className="flex flex-col gap-2">
        <p>
          Contact{" "}
          <span className="font-semibold text-xl underline">
            {landlord.userName}
          </span>{" "}
          for{" "}
          <span className="font-semibold text-xl underline">
            {listing.name}
          </span>
        </p>
        <textarea
          name="message"
          id="message"
          rows="2"
          value={message}
          placeholder="Enter your message here"
          className="w-full p-3 border border-blue-950 rounded-lg"
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className="bg-slate-700 text-center text-white uppercase rounded-lg p-3 font-semibold transition-all duration-500  hover:bg-slate-900"
        >
          Send Message
        </Link>
      </section>
    )
  );
};

export default Contact;
