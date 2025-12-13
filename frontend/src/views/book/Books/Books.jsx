
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

export default function UserBooksPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);


  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/books/my-books", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data)
        setBooks(res.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(books.filter((book) => book.id !== id)); 
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book");
    }
  };

 return (
  <div className="container mt-5">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h1 className="fw-bold">My Books</h1>
      <button
        className="btn btn-primary px-4"
        onClick={() => navigate("/create-book")}
      >
        Create Book
      </button>
    </div>

    {books.length === 0 ? (
      <div className="text-center py-5">
        <h3 className="fw-semibold mb-3">You don’t have any books yet</h3>
        <p className="text-muted mb-4">
          Start building your personal library by adding your first book!
        </p>
        
      </div>
    ) : (
      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>{book.reading_status}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);

}
