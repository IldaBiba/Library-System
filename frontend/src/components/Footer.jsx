import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-4 pb-2 mt-auto ">
      <div className="container text-center text-md-start">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className="text-uppercase">📚 My Library</h5>
            <p>
              Manage your books, track your reading, and explore new genres.
              All your library data at your fingertips.
            </p>
          </div>
          <div className="col-md-4 mb-3">
            <h5 className="text-uppercase">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/books" className="text-light text-decoration-none">My Books</a></li>
              <li><a href="/login" className="text-light text-decoration-none">Login</a></li>
              <li><a href="/register" className="text-light text-decoration-none">Register</a></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5 className="text-uppercase">Contact</h5>
            <p>Email: support@mylibrary.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <div className="d-flex justify-content-start gap-2 mt-2">
              <a href="#" className="text-light fs-5"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-light fs-5"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-light fs-5"><i className="fab fa-instagram"></i></a>
            </div>
          </div>

        </div>

        <hr className="bg-light" />

        <div className="text-center pb-2">
          &copy; {new Date().getFullYear()} My Library. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
