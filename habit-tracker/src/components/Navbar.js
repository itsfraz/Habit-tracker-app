import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = ({ currentUser, logOut }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Habit Tracker</Link>
        <div className="d-flex">
          {currentUser ? (
            <button className="btn btn-outline-secondary" onClick={logOut}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary me-2">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
