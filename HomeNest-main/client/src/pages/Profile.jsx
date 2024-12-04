import React, { useEffect, useState } from "react";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";

//firebase storage
//  allow read;
//       allow write:if
//       request.resource.size<2*1024*1024 &&
//       request.resource.contentType.matches('image/.*')

export const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [fileperc, setFilePerc] = useState(0);
  const [fileError, setFileError] = useState(null);
  const [formdata, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [listingError, setListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshort) => {
        const progress =
          (snapshort.bytesTransferred / snapshort.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formdata, avatar: downloadURL });
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/update/${
          currentUser._id
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formdata),
        }
      );
      const data = await res.json();
      console.log(data);
      if (data.success == false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/delete/${
          currentUser._id
        }`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signout`
      );
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
  const handleShowListings = async () => {
    try {
      setListingError(false);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/listings/${
          currentUser._id
        }`
      );
      const data = await res.json();
      if (data.success === false) {
        setListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setListingError(true);
    }
  };
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/listing/delete/${listingId}`
      );
      const data = res.json();
      if (data.success == false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((list) => list._id !== listingId));
    } catch (error) {
      console.log(message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={formdata.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm self-center">
          {fileError ? (
            <span className="text-red-700">
              Error In Image Upload (Image Must be Less than 2MB)
            </span>
          ) : fileperc > 0 && fileperc < 100 ? (
            <span className="text-slate-700">{`Uploading ${fileperc}%`}</span>
          ) : fileperc === 100 ? (
            <span className="text-green-700">
              Image Successfully Uploaded!!
            </span>
          ) : (
            " "
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          id="username"
          onChange={(e) => handleChange(e)}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          id="email"
          onChange={(e) => handleChange(e)}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={(e) => handleChange(e)}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-95"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
        <div className="flex justify-between mt-5">
          <span
            className="text-red-700 cursor-pointer font-semibold"
            onClick={handleDeleteUser}
          >
            Delete Account
          </span>
          <span
            className="text-red-700 cursor-pointer font-semibold"
            onClick={handleSignOut}
          >
            Sign Out
          </span>
        </div>
        <p className="text-red-700 mt-5">{error ? error : ""}</p>
        <p className="text-green-700 mt-5 font-semibold">
          {updateSuccess ? "Data updated successfully" : ""}
        </p>
      </form>
      <button onClick={handleShowListings} className="text-green-700 w-full ">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {listingError ? "Error Showing Listings" : ""}
      </p>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4 ">
          <h1 className="text-center text-2xl font-bold">Your Listings</h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg flex p-3 justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt=""
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className="text-slate-700 font-semibold hover:underline truncate flex-1 "
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center ">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
