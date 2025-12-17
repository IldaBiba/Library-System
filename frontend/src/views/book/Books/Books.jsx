import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

export default function UserBooksPage() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("ALL");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/books/my-books", {
          headers: { Authorization: `Bearer ${token}` },
        });

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

      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book");
    }
  };

  const genres = [
    "ALL",
    ...new Set(books.map((book) => book.genre).filter(Boolean)),
  ];

  const filteredBooks =
    selectedGenre === "ALL"
      ? books
      : books.filter((book) => book.genre === selectedGenre);

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
      {genres.length > 1 && (
        <div className="mb-4">
          <h6 className="fw-semibold mb-2">Filter by genre</h6>

          <div className="d-flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                className={`btn btn-sm ${
                  selectedGenre === genre
                    ? "btn-dark"
                    : "btn-outline-dark"
                }`}
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredBooks.length === 0 ? (
        <div className="text-center py-5">
          <h3 className="fw-semibold mb-3">No books found</h3>
          <p className="text-muted">
            There are no books in this genre yet.
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
                {filteredBooks.map((book) => (
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
