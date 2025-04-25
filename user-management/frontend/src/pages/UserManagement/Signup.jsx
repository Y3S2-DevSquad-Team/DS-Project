import { useState } from "react";

const Signup = () => {
  const [role, setRole] = useState("Customer");
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e, key) => {
    setFormData((prev) => ({
      ...prev,
      deliveryAddresses: [
        {
          ...prev.deliveryAddresses?.[0],
          [key]: e.target.value,
        },
      ],
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // TODO: Add role-specific validation and API call here
    console.log("Submitting for", role, formData);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-darkBg text-white px-4">
      <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">
          Sign Up as {role}
        </h2>

        <div className="mb-4 text-center">
          <select
            className="bg-[#2a2a2a] p-2 rounded text-white"
            value={role}
            onChange={(e) => {
              setFormData({});
              setRole(e.target.value);
              setError("");
            }}
          >
            <option>Customer</option>
            <option>DeliveryPerson</option>
            <option>Restaurant</option>
          </select>
        </div>

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Common fields */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="form-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="form-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="form-input"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            className="form-input"
          />

          {/* Role-specific fields */}
          {role === "Customer" && (
            <>
              <input
                placeholder="Address Label"
                className="form-input"
                onChange={(e) => handleAddressChange(e, "label")}
              />
              <input
                placeholder="Address"
                className="form-input"
                onChange={(e) => handleAddressChange(e, "address")}
              />
              <input
                placeholder="Latitude"
                className="form-input"
                onChange={(e) => handleAddressChange(e, "lat")}
              />
              <input
                placeholder="Longitude"
                className="form-input"
                onChange={(e) => handleAddressChange(e, "lng")}
              />
            </>
          )}

          {role === "DeliveryPerson" && (
            <>
              <input
                name="vehicleType"
                placeholder="Vehicle Type"
                onChange={handleChange}
                className="form-input"
              />
              <input
                name="licenseNumber"
                placeholder="License Number"
                onChange={handleChange}
                className="form-input"
              />
              <input
                name="nic"
                placeholder="NIC"
                onChange={handleChange}
                className="form-input"
              />
            </>
          )}

          {role === "Restaurant" && (
            <>
              <input
                name="restaurantName"
                placeholder="Restaurant Name"
                onChange={handleChange}
                className="form-input"
              />
              <input
                name="location"
                placeholder="Location"
                onChange={handleChange}
                className="form-input"
              />
              <input
                name="businessLicenseNumber"
                placeholder="License Number"
                onChange={handleChange}
                className="form-input"
              />
              <input
                name="cuisineType"
                placeholder="Cuisine Type"
                onChange={handleChange}
                className="form-input"
              />
              <input
                name="openingHours.start"
                placeholder="Opening Time"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    openingHours: {
                      ...prev.openingHours,
                      start: e.target.value,
                    },
                  }))
                }
                className="form-input"
              />
              <input
                name="openingHours.end"
                placeholder="Closing Time"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    openingHours: { ...prev.openingHours, end: e.target.value },
                  }))
                }
                className="form-input"
              />
              <input
                name="bankDetails.accountNumber"
                placeholder="Account Number"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bankDetails: {
                      ...prev.bankDetails,
                      accountNumber: e.target.value,
                    },
                  }))
                }
                className="form-input"
              />
              <input
                name="bankDetails.bankName"
                placeholder="Bank Name"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bankDetails: {
                      ...prev.bankDetails,
                      bankName: e.target.value,
                    },
                  }))
                }
                className="form-input"
              />
              <input
                name="bankDetails.branchCode"
                placeholder="Branch Code"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bankDetails: {
                      ...prev.bankDetails,
                      branchCode: e.target.value,
                    },
                  }))
                }
                className="form-input"
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-black font-bold py-3 rounded hover:bg-primaryDark transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
