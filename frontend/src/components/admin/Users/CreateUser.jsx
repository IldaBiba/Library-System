import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const CreateUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async () => {
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/admin/create-user",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(" User created successfully");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="fw-bold mb-4">Create User</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
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
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/admin")}
            >
              Cancel
            </button>

            <button
              className="btn btn-success"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
