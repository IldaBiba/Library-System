import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios"
const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/admin/get-user/${id}`);
        console.log(res)
        setFormData({
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role,
        });
      } catch (err) {
        setError("Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/update-user/${id}`, formData);
      navigate("/admin");
    } catch (err) {
      setError("Failed to update user");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="fw-bold mb-4 text-center">Edit User</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary w-100">
              Save Changes
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={() => navigate("/admin")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
