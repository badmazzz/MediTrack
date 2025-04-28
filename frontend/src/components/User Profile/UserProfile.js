import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";

export default function UserProfile() {
  const { user, updateProfile, updateAvatar } = useContext(StoreContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    street: "",
    city: "",
    zipcode: "",
    phone: "",
  });

  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.name || "",
        email: user.email || "",
        street: user.address?.[0]?.street || "",
        city: user.address?.[0]?.city || "",
        zipcode: user.address?.[0]?.zipcode || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    let ans = window.confirm("Are you sure you want to update your profile?");
    if (!ans) return;
    updateProfile(formData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const confirm = window.confirm(
        "Are you sure you want to change your profile picture?"
      );
      if (confirm) {
        setAvatar(file);
        updateAvatar(file);
      }
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Edit Profile</h2>
      <div className="row g-4">
        {/* Profile Picture */}
        <div className="col-md-4 text-center">
          <div className="card p-3">
            <img
              src={user.avatar}
              alt="Avatar"
              className="img-fluid rounded-circle mb-3"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <label className="form-label">Upload new image</label>
            <input
              type="file"
              className="form-control"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Form Section */}
        <div className="col-md-8">
          <div className="card p-4">
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Street</label>
                <input
                  type="text"
                  className="form-control"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Pin Code</label>
                <input
                  type="text"
                  className="form-control"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-4 text-end">
              <button className="btn btn-primary" onClick={handleSubmit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
