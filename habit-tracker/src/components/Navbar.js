import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ currentUser, logOut, toggleTheme, theme }) => {
  const location = useLocation();

  return (
    <nav className={`navbar navbar-expand-lg sticky-top navbar-glass mb-4 ${theme === 'dark' ? 'navbar-dark' : 'navbar-light'}`}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-check-circle-fill me-2 text-primary"></i>
          Habit Tracker
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {/* Theme Toggle Button */}
            <li className="nav-item me-lg-3">
              <button 
                className="btn btn-link nav-link p-0 d-flex align-items-center" 
                onClick={toggleTheme}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                <div className={`theme-toggle-icon rounded-circle p-2 d-flex align-items-center justify-content-center ${theme === 'light' ? 'bg-light text-warning' : 'bg-dark-subtle text-light'}`}>
                  <i className={`bi bi-${theme === 'light' ? 'sun-fill' : 'moon-stars-fill'} fs-5`}></i>
                </div>
              </button>
            </li>

            {currentUser ? (
              <>
                <li className="nav-item d-none d-lg-block">
                  <span className="nav-link fw-bold">
                    Hello, <span className="text-primary">{currentUser.username}</span>
                  </span>
                </li>
                <li className="nav-item ms-lg-3">
                  <button 
                    className="btn btn-outline-danger btn-sm px-4 rounded-pill" 
                    onClick={logOut}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link 
                    to="/login" 
                    className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link 
                    to="/register" 
                    className="btn btn-primary btn-sm px-4 rounded-pill shadow-sm"
                  >
                    Get Started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
