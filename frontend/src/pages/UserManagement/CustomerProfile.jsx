import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../../store/slices/userSlice";
import showToast from "../../utils/toastNotifications";
import userAvatar from "../../assets/accountInfo/user-info-avatar.svg";
import { TbEdit, TbPhone, TbMail, TbUser } from "react-icons/tb";
import { MdOutlineSave, MdCancel, MdEditNote } from "react-icons/md";
import { fetchUserProfile, updateUser } from "../../store/thunks/userThunks";

const CustomerProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const loading = useSelector((state) => state.user.loading);
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
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

  const handleLogout = () => {
    dispatch(userLogout());
    navigate("/");
  };

  const handleCancel = () => {
    setForm({
      username: currentUser.username || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
    });
    setIsEditing(false);
  };

  if (loading || !currentUser) {
    return (
      <div className="mt-10 text-center text-gray-800 text-lg font-medium">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-white px-4 py-10 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-32 h-32">
            <img
              src={userAvatar}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-4 border-green-500 shadow-md"
            />
            {isEditing && (
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-1 right-1 p-2 bg-green-600 rounded-full hover:bg-green-700 transition shadow"
              >
                <TbEdit className="text-white text-xl" />
              </button>
            )}
            <input ref={fileInputRef} type="file" className="hidden" />
          </div>
          <h2 className="mt-4 text-4xl font-bold text-green-700 tracking-wide">
            {form.username}
          </h2>
          <p className="text-sm text-gray-500 font-medium">Customer</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(form).map(([key, value]) => {
            const iconMap = {
              username: <TbUser className="text-green-600 mr-2 text-xl" />,
              email: <TbMail className="text-green-600 mr-2 text-xl" />,
              phone: <TbPhone className="text-green-600 mr-2 text-xl" />,
            };

            return (
              <div key={key}>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2 capitalize">
                  {iconMap[key] || null}
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-end mt-10">
          {isEditing ? (
            <div className="flex gap-4">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                <MdCancel className="text-xl" /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 shadow transition"
              >
                <MdOutlineSave className="text-xl" /> Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 shadow transition"
            >
              <MdEditNote className="text-xl" /> Edit Info
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
