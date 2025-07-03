
import React from 'react';
import HabitList from './HabitList';
import Analytics from './Analytics';

const Dashboard = ({ habits, categories, deleteHabit, trackHabit, addNote, layout }) => {
  return (
    <div className="dashboard-layout mt-4">
      {layout === 'default' && (
        <div className="row">
          <div className="col-lg-6 mb-4">
            <HabitList
              habits={habits}
              deleteHabit={deleteHabit}
              trackHabit={trackHabit}
              addNote={addNote}
              categories={categories}
            />
          </div>
          <div className="col-lg-6 mb-4">
            <Analytics habits={habits} categories={categories} />
          </div>
        </div>
      )}
      {layout === 'analytics-first' && (
        <div className="row">
          <div className="col-lg-6 mb-4">
            <Analytics habits={habits} categories={categories} />
          </div>
          <div className="col-lg-6 mb-4">
            <HabitList
              habits={habits}
              deleteHabit={deleteHabit}
              trackHabit={trackHabit}
              addNote={addNote}
              categories={categories}
            />
          </div>
        </div>
      )}
      {layout === 'full-width-habits' && (
        <div className="row">
          <div className="col-12 mb-4">
            <HabitList
              habits={habits}
              deleteHabit={deleteHabit}
              trackHabit={trackHabit}
              addNote={addNote}
              categories={categories}
            />
          </div>
          <div className="col-12 mb-4">
            <Analytics habits={habits} categories={categories} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
