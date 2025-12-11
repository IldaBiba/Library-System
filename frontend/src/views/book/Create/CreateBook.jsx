import React, { useState } from "react";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const CreateBook = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/books/create-book", 
        {
          title: data.title,
          author: data.author,
          genre: data.genre,
          status: data.status,
        },
      );

      alert("Book created successfully!");
      navigate("/my-books"); 
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Failed to create book");
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
              <option value="Not Read">Not Read</option>
              <option value="Reading">Reading</option>
              <option value="Finished">Finished</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold py-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBook;
