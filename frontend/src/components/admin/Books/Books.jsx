import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios"

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/admin/get-all-books", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data)
        setBooks(res.data.books);
      } catch (err) {
        console.error("Failed to fetch books", err);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;

    try {
      await api.delete(`/delete/${id}`);
      setBooks(books.filter((b) => b.id !== id));
    } catch (err) {
      alert("Failed to delete book");
    }
  };

  return (
   <div className="container mt-5">

  <div className="d-flex justify-content-between align-items-center mb-4">
    <h2 className="fw-bold mb-0">All Books</h2>

    <button
      className="btn btn-success"
      onClick={() => navigate("/create-book")}
    >
      ➕ Create Book
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
            <th>User ID</th>
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
                <td>{book.user_id}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => navigate(`/update-book/${book.id}`)}
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
              <td colSpan="6" className="text-center text-muted py-4">
                No books found
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

export default AdminBooks;
