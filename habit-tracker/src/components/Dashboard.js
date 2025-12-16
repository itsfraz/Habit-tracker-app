
import React from 'react';
import HabitList from './HabitList';
import Analytics from './Analytics';

const Dashboard = ({ habits, categories, deleteHabit, trackHabit, addNote, layout, user, setReminder }) => {
  const totalHabits = habits.length;
  const activeCategories = new Set(habits.map(h => h.category)).size;
  const totalCompletions = habits.reduce((total, habit) => {
    return total + habit.history.reduce((hTotal, entry) => hTotal + entry.completions, 0);
  }, 0);

  return (
    <div className="dashboard-container fade-in">
      {/* Welcome Header */}
      <div className="dashboard-header mb-5 p-4 rounded-4 text-white shadow-sm bg-gradient-primary">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h1 className="fw-bold mb-1">
              Welcome back, {user?.username || 'Guest'}!
            </h1>
            <p className="mb-0 opacity-75 fs-5">Here's what's happening with your habits today.</p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <span className="badge bg-white text-primary fs-6 px-3 py-2 rounded-pill shadow-sm">
              <i className="bi bi-calendar-event me-2"></i>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="stat-card p-4 rounded-4 shadow-sm h-100 bg-white border-0 card-hover-effect">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-uppercase text-muted fw-bold mb-1 small-tracking">Total Habits</p>
                <h2 className="display-6 fw-bold mb-0 text-dark">{totalHabits}</h2>
              </div>
              <div className="icon-box bg-light-primary text-primary rounded-circle p-3">
                <i className="bi bi-list-check fs-3"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card p-4 rounded-4 shadow-sm h-100 bg-white border-0 card-hover-effect">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-uppercase text-muted fw-bold mb-1 small-tracking">Active Categories</p>
                <h2 className="display-6 fw-bold mb-0 text-dark">{activeCategories}</h2>
              </div>
              <div className="icon-box bg-light-success text-success rounded-circle p-3">
                <i className="bi bi-tags fs-3"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card p-4 rounded-4 shadow-sm h-100 bg-white border-0 card-hover-effect">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-uppercase text-muted fw-bold mb-1 small-tracking">Total Completions</p>
                <h2 className="display-6 fw-bold mb-0 text-dark">{totalCompletions}</h2>
              </div>
              <div className="icon-box bg-light-warning text-warning rounded-circle p-3">
                <i className="bi bi-trophy fs-3"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        {layout === 'default' && (
          <div className="row g-4">
            <div className="col-lg-7 mb-4">
              <div className="section-container">
                <h4 className="section-title mb-4 ps-2 border-start border-4 border-primary">My Habits</h4>
                <HabitList
                  habits={habits}
                  deleteHabit={deleteHabit}
                  trackHabit={trackHabit}
                  addNote={addNote}
                  categories={categories}
                  setReminder={setReminder}
                />
              </div>
            </div>
            <div className="col-lg-5 mb-4">
              <div className="section-container sticky-top" style={{ top: '20px', zIndex: 1 }}>
                 <Analytics habits={habits} categories={categories} />
              </div>
            </div>
          </div>
        )}

        {layout === 'analytics-first' && (
          <div className="row g-4">
            <div className="col-lg-5 mb-4 order-lg-1 order-2">
              <div className="section-container sticky-top" style={{ top: '20px', zIndex: 1 }}>
                <Analytics habits={habits} categories={categories} />
              </div>
            </div>
            <div className="col-lg-7 mb-4 order-lg-2 order-1">
              <div className="section-container">
                <h4 className="section-title mb-4 ps-2 border-start border-4 border-primary">My Habits</h4>
                <HabitList
                  habits={habits}
                  deleteHabit={deleteHabit}
                  trackHabit={trackHabit}
                  addNote={addNote}
                  categories={categories}
                  setReminder={setReminder}
                />
              </div>
            </div>
          </div>
        )}

        {layout === 'full-width-habits' && (
          <div className="row g-4">
            <div className="col-12 mb-5">
              <div className="section-container">
                <h4 className="section-title mb-4 ps-2 border-start border-4 border-primary">My Habits</h4>
                <HabitList
                  habits={habits}
                  deleteHabit={deleteHabit}
                  trackHabit={trackHabit}
                  addNote={addNote}
                  categories={categories}
                  setReminder={setReminder}
                />
              </div>
            </div>
            <div className="col-12 mb-4">
               <Analytics habits={habits} categories={categories} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
