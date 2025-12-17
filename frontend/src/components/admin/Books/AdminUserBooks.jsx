import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const AdminUserBooks = () => {
  const { id } = useParams(); // user id
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get(`/admin/user-books/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data)
        setBooks(res.data.books);
      } catch (err) {
        console.error("Failed to fetch user books", err);
      }
    };

    fetchUserBooks();
  }, [id]);

  const handleDelete = async (bookId) => {
    if (!window.confirm("Delete this book?")) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/delete-book/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBooks((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err) {
      alert("Failed to delete book");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">User Books</h2>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/admin")}
        >
          ⬅ Back to Dashboard
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-bordered table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Status</th>
                <th style={{ width: "150px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {books.length > 0 ? (
                books.map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.genre}</td>
                    <td>{book.reading_status}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() =>
                          navigate(`/update-book/${book.id}`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(book.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    This user has no books
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserBooks;
