import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../../store/slices/userSlice";
import showToast from "../../utils/toastNotifications";
import api from "../../configs/api";
import ProfileSidebar from "../../components/UserManagement/ProfileSidebar";
import userAvatar from "../../assets/accountInfo/user-info-avatar.svg";
import { TbEdit } from "react-icons/tb";

const CustomerProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    } else {
      fetchUserProfile();
    }
  }, [currentUser]);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/auth");
      setUserData(res.data.data);
      setForm({
        username: res.data.data.username,
        email: res.data.data.email,
        phone: res.data.data.phone,
      });
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to fetch profile");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await api.put("/auth", form);
      showToast("success", "Profile updated successfully");
      setIsEditing(false);
      fetchUserProfile();
    } catch (error) {
      showToast("error", "Failed to update profile");
    }
  };

  const handleLogout = () => {
    dispatch(userLogout());
    navigate("/");
  };

  if (!userData) {
    return <div className="text-center text-white mt-10">Loading...</div>;
  }

  return (
    <>
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64">
        <ProfileSidebar handleLogout={handleLogout} />
      </div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen bg-[#f3f4f6] p-10 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-md p-8 w-full">
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <img
                src={userAvatar}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              {isEditing && (
                <div
                  className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1 cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  <TbEdit className="text-white" />
                </div>
              )}
              <input ref={fileInputRef} type="file" className="hidden" />
            </div>
            <h2 className="text-2xl font-bold mt-4 text-[#06C167]">
              {form.username}
            </h2>
            <p className="text-gray-600">Customer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(form).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#06C167] text-gray-800 disabled:bg-gray-100"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-8">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-[#06C167] hover:bg-[#04894e] text-white px-6 py-2 rounded-md"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#06C167] hover:bg-[#04894e] text-white px-6 py-2 rounded-md"
              >
                Edit Info
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerProfile;
