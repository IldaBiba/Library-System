import React, { useState } from "react";
import AdminBooks from "../../components/admin/Books/Books";
import AdminUsers from "../../components/admin/Users/Users";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("books");

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">

        <div className="col-md-2 bg-dark text-white py-4">
          <h4 className="fw-bold mb-4">Admin Panel</h4>

          <button
            className={`btn w-100 mb-2 ${
              activeTab === "books" ? "btn-primary" : "btn-outline-light"
            }`}
            onClick={() => setActiveTab("books")}
          >
            📚 Books
          </button>

          <button
            className={`btn w-100 ${
              activeTab === "users" ? "btn-primary" : "btn-outline-light"
            }`}
            onClick={() => setActiveTab("users")}
          >
            👥 Users
          </button>
        </div>

        <div className="col-md-10 p-5 bg-light">
          {activeTab === "books" && <AdminBooks />}
          {activeTab === "users" && <AdminUsers />}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
