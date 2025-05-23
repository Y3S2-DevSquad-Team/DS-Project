import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../../store/slices/userSlice";
import showToast from "../../utils/toastNotifications";
import api from "../../configs/api";
import ProfileSidebar from "../../components/UserManagement/ProfileSidebar";
import userAvatar from "../../assets/accountInfo/user-info-avatar.svg";
import { TbEdit } from "react-icons/tb";

const RestaurantProfile = () => {
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
        restaurantName: res.data.data.restaurantName || "",
        location: res.data.data.location || "",
        businessLicenseNumber: res.data.data.businessLicenseNumber || "",
        cuisineType: res.data.data.cuisineType || "",
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
    return <div className='mt-10 text-center text-gray-800'>Loading...</div>;
  }

  return (
    <>
      {/* Sidebar */}
      <div className='fixed top-0 left-0 w-64 h-screen'>
        <ProfileSidebar handleLogout={handleLogout} />
      </div>

      {/* Main Content */}
      <div className='min-h-screen p-10 ml-64 overflow-y-auto bg-gray-100'>
        <div className='w-full p-8 bg-white rounded-lg shadow-md'>
          <div className='flex flex-col items-center mb-8'>
            <div className='relative'>
              <img src={userAvatar} alt='Profile' className='object-cover w-24 h-24 rounded-full' />
              {isEditing && (
                <div className='absolute bottom-0 right-0 p-1 bg-green-500 rounded-full cursor-pointer' onClick={() => fileInputRef.current.click()}>
                  <TbEdit className='text-white' />
                </div>
              )}
              <input ref={fileInputRef} type='file' className='hidden' />
            </div>
            <h2 className='mt-4 text-2xl font-bold text-green-600'>{form.restaurantName || form.username}</h2>
            <p className='text-gray-600'>Restaurant Owner</p>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {Object.entries(form).map(([key, value]) => (
              <div key={key}>
                <label className='block mb-1 text-sm font-medium text-gray-700 capitalize'>{key.replace(/([A-Z])/g, " $1")}</label>
                <input
                  type='text'
                  name={key}
                  value={value}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className='w-full px-3 py-2 text-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100'
                />
              </div>
            ))}
          </div>

          <div className='flex justify-end gap-4 mt-8'>
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className='px-6 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600'>
                  Cancel
                </button>
                <button onClick={handleSave} className='px-6 py-2 text-white bg-green-500 rounded-md hover:bg-green-600'>
                  Save
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className='px-6 py-2 text-white bg-green-500 rounded-md hover:bg-green-600'>
                Edit Info
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantProfile;
