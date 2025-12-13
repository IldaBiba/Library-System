import React, { useState } from "react";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const CreateBook = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/books/create-book",
        {
          title: data.title,
          author: data.author,
          genre: data.genre,
          reading_status: data.status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const role = localStorage.getItem("role");
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err.response?.data?.message || err.message);

      if (err.response?.status === 401) {
        setShowAuthModal(true);
      } else {
        alert(err.response?.data?.message || "Failed to create book");
      }
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center fw-bold mb-4">Create a New Book</h2>

      <div className="card shadow p-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <div className="invalid-feedback">{errors.title.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Author</label>
            <input
              type="text"
              className={`form-control ${errors.author ? "is-invalid" : ""}`}
              {...register("author", { required: "Author is required" })}
            />
            {errors.author && (
              <div className="invalid-feedback">{errors.author.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Genre</label>
            <input type="text" className="form-control" {...register("genre")} />
          </div>

          <div className="mb-3">
            <label className="form-label">Status</label>
            <select className="form-select" {...register("status")}>
              <option value="want-to-read">Want to read</option>
              <option value="reading">Reading</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
            Create Book
          </button>
        </form>
      </div>

      {showAuthModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3">
              <div className="modal-header">
                <h5 className="modal-title">Authentication Required</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowAuthModal(false)}
                ></button>
              </div>

              <div className="modal-body text-center">
                <p className="mb-3">
                  You need to <strong>log in</strong> or <strong>register</strong> to create a book.
                </p>

                <div className="d-flex justify-content-center gap-3">
                  <button
                    className="btn btn-primary px-4"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>

                  <button
                    className="btn btn-success px-4"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBook;
