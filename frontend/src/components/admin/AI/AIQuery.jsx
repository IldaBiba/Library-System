import React, { useState } from "react";
import api from "../../../api/axios";

const AIQuery = () => {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/admin/ai-query",
        { question },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResult(res.data);
    } catch (err) {
      console.error("AI query failed", err);
      setError("Failed to process query");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4">🤖 AI Query Assistant</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <label className="form-label fw-semibold">
            Ask a question about the library
          </label>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="e.g. Who owns the most books?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button
            className="btn btn-dark"
            onClick={handleAsk}
            disabled={loading}
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>
      </div>

      {/* RESULT */}
      {error && <div className="alert alert-danger">{error}</div>}

      {result && result.type === "text" && (
        <div className="alert alert-info">
          <strong>Answer:</strong> {result.answer}
        </div>
      )}

      {result && result.type === "table" && (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <table className="table table-bordered mb-0">
              <thead className="table-light">
                <tr>
                  {result.columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row, index) => (
                  <tr key={index}>
                    {row.map((cell, i) => (
                      <td key={i}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIQuery;
