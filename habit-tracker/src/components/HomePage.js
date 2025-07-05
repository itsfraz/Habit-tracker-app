
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container text-center mt-5">
      <h1>Welcome to Habit Tracker!</h1>
      <p className="lead">Your personal companion for building and tracking healthy habits.</p>
      <div className="mt-4">
        <Link to="/register" className="btn btn-primary btn-lg me-3">Get Started</Link>
        <Link to="/login" className="btn btn-outline-secondary btn-lg">Login</Link>
      </div>
      <div className="row mt-5">
        <div className="col-md-4">
          <h3>Track Your Progress</h3>
          <p>Monitor your habits daily, weekly, or monthly with intuitive charts and statistics.</p>
        </div>
        <div className="col-md-4">
          <h3>Stay Motivated</h3>
          <p>Receive motivational quotes and achieve new levels as you build consistent habits.</p>
        </div>
        <div className="col-md-4">
          <h3>Personalized Experience</h3>
          <p>Customize your habits, set reminders, and get suggestions tailored to your goals.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
