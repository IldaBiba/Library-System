import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../../api/axios";

const UpdateBook = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();


  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const book = res.data.book;
        console.log(book)


        setValue("title", book.title);
        setValue("author", book.author);
        setValue("genre", book.genre);
        setValue("status", book.reading_status);

        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch book");
        navigate("/"); 
      }
    };

    fetchBook();
  }, [id, navigate, setValue]);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(`/books/${id}`, {
        title: data.title,
        author: data.author,
        genre: data.genre,
        reading_status: data.status,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Book updated successfully!");
            const role =localStorage.getItem("role");

if (role === "admin") {
  navigate("/admin");
} else {
  navigate("/");
}
    } catch (err) {
      console.error(err);
      alert("Failed to update book");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center fw-bold mb-4">Edit Book</h2>
      <div className="card shadow p-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Author</label>
            <input
              type="text"
              className={`form-control ${errors.author ? "is-invalid" : ""}`}
              {...register("author", { required: "Author is required" })}
            />
            {errors.author && <div className="invalid-feedback">{errors.author.message}</div>}
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

          <button type="submit" className="btn btn-primary w-100 fw-bold py-2" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBook;
