import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../../store/slices/userSlice";
import showToast from "../../utils/toastNotifications";
import ProfileSidebar from "../../components/UserManagement/ProfileSidebar";
import userAvatar from "../../assets/accountInfo/user-info-avatar.svg";
import { TbEdit, TbUser, TbMail, TbPhone, TbBuilding, TbMapPin, TbLicense, TbChefHat } from "react-icons/tb";
import { MdOutlineSave, MdCancel, MdEditNote } from "react-icons/md";
import { fetchUserProfile, updateUser } from "../../store/thunks/userThunks";

const RestaurantProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const loading = useSelector((state) => state.user.loading);
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    restaurantName: "",
    location: "",
    businessLicenseNumber: "",
    cuisineType: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, []);

  useEffect(() => {
    if (currentUser) {
      setForm({
        username: currentUser.username || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        restaurantName: currentUser.restaurantName || "",
        location: currentUser.location || "",
        businessLicenseNumber: currentUser.businessLicenseNumber || "",
        cuisineType: currentUser.cuisineType || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await dispatch(updateUser(form)).unwrap();
      showToast("success", "Profile updated successfully");
      setIsEditing(false);
      dispatch(fetchUserProfile());
    } catch (error) {
      showToast("error", "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setForm({
      username: currentUser.username || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      restaurantName: currentUser.restaurantName || "",
      location: currentUser.location || "",
      businessLicenseNumber: currentUser.businessLicenseNumber || "",
      cuisineType: currentUser.cuisineType || "",
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    dispatch(userLogout());
    navigate("/");
  };

  if (loading || !currentUser) {
    return (
      <div className="mt-10 text-center text-gray-800 text-lg font-medium">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 px-4 py-10 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Restaurant Header Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-green-200 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-48 h-48 group">
              <img
                src={userAvatar}
                alt="Profile"
                className="w-full h-full object-cover rounded-2xl border-4 border-green-500 shadow-lg group-hover:shadow-green-300 transition-all duration-300"
              />
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-2 right-2 p-3 bg-green-600 rounded-xl hover:bg-green-500 transition-all duration-300 shadow-lg hover:scale-110"
                >
                  <TbEdit className="text-white text-2xl" />
                </button>
              )}
              <input ref={fileInputRef} type="file" className="hidden" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-6xl font-black text-green-800 tracking-wide drop-shadow-lg">
                {form.restaurantName || form.username}
              </h2>
              <p className="text-2xl text-green-600 font-medium mt-3">Restaurant Owner</p>
              <p className="text-xl text-gray-600 mt-2">{form.cuisineType}</p>
            </div>
          </div>
        </div>

        {/* Restaurant Details Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-green-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(form).map(([key, value]) => {
              const iconMap = {
                username: <TbUser className="text-green-600 mr-2 text-2xl" />,
                email: <TbMail className="text-green-600 mr-2 text-2xl" />,
                phone: <TbPhone className="text-green-600 mr-2 text-2xl" />,
                restaurantName: <TbBuilding className="text-green-600 mr-2 text-2xl" />,
                location: <TbMapPin className="text-green-600 mr-2 text-2xl" />,
                businessLicenseNumber: <TbLicense className="text-green-600 mr-2 text-2xl" />,
                cuisineType: <TbChefHat className="text-green-600 mr-2 text-2xl" />,
              };

              return (
                <div key={key} className="bg-green-50/50 p-6 rounded-2xl border border-green-200 hover:border-green-300 transition-all duration-300">
                  <label className="flex items-center text-base font-semibold text-green-700 mb-3 capitalize">
                    {iconMap[key] || null}
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-5 py-4 border-2 border-green-200 rounded-xl text-lg text-gray-800 bg-white focus:ring-4 focus:ring-green-100 focus:border-green-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-300 placeholder-gray-400"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex flex-col md:flex-row justify-end items-center mt-12 gap-4">
            {isEditing ? (
              <div className="flex gap-4">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-8 py-3 text-base font-semibold text-green-700 bg-white border border-green-300 rounded-xl hover:bg-green-50 hover:border-green-400 transition-all duration-300"
                >
                  <MdCancel className="text-2xl" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-8 py-3 text-base font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <MdOutlineSave className="text-2xl" /> Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-8 py-3 text-base font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 shadow-lg transition-all duration-300 hover:scale-105"
              >
                <MdEditNote className="text-2xl" /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfile;
