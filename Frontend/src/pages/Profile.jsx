import { useRef, useState, useEffect } from "react";
import { signOutUserFailure, signOutUserStart, signOutUserSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { data } from "autoprefixer";

export default function Profile() {
  const fileRef = useRef(null);
  const [setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [address, setAddress] = useState("");
  const [Community, setCommunity] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/v1/user");
        const data = await res.json();
        if (data.success === false) {
          console.error("Failed to fetch user data:", data.message);
          return;
        }
        const postalCode = data.postalCode;
        setFormData({
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          avatar: data.imageUrl,
          role: data.role,
          postalCode: postalCode,
        });

        const addressRes = await fetch(`https://api.postalpincode.in/pincode/${postalCode}`);
        const addressData = await addressRes.json();
        console.log(addressData);
        if (addressData[0].Status === "Success") {
          const addressInfo = addressData[0].PostOffice[0];
          setAddress(`${addressInfo.Name}, ${addressInfo.District}, ${addressInfo.State}, ${addressInfo.Country}`);
          setCommunity(`${addressInfo.Name}, ${addressInfo.State}`);
        } else {
          console.error("Failed to fetch address data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/v1/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!data.success) {
        dispatch(signOutUserFailure());
        console.error('Sign out failed:', data.message);
        return;
      }
      dispatch(signOutUserSuccess());
      window.location.href = '/';
    } catch (error) {
      console.error("Sign out error:", data.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
    <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
    <div className="flex justify-center mt-4">
  <span className="text-xl font-semibold">
    Welcome to the community of {Community}!
  </span>
</div>
        <br />
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex flex-col items-center gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={formData.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer mt-2"
        />
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex gap-2 items-center">
          <span className="font-semibold">Name:</span>
          <div className="p-2 rounded-lg flex-1">{formData.name}</div>
        </div>
        <div className="flex gap-2 items-center">
          <span className="font-semibold">Email:</span>
          <div className="p-2 rounded-lg flex-1">{formData.email}</div>
        </div>
        <div className="flex gap-2 items-center">
          <span className="font-semibold">Mobile:</span>
          <div className="p-2 rounded-lg flex-1">{formData.mobile}</div>
        </div>
        <div className="flex gap-2 items-center">
          <span className="font-semibold">Role:</span>
          <div className="p-2 rounded-lg flex-1">{formData.role}</div>
        </div>
        <div className="flex gap-2 items-center">
          <span className="font-semibold">Postal Code:</span>
          <div className="p-2 rounded-lg flex-1">{formData.postalCode}</div>
        </div>
      </div>
      <div className="flex gap-2 items-center">
          <span className="font-semibold">Address:</span>
          <div className="p-2 rounded-lg flex-1">{address}</div>
      </div>
      <Link
        onClick={handleSignOut}
        className="bg-slate-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 mt-4 block"
      >
        Sign out
      </Link>
    </div>
  </div>
  );
}