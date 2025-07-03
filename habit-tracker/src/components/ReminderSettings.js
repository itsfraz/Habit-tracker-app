
import React, { useState } from 'react';

const ReminderSettings = ({ habit, setReminder }) => {
  const [time, setTime] = useState(habit.reminderTime || '');

  const handleSetReminder = () => {
    setReminder(habit.id, time);
  };

  return (
    <div className="card card-body mt-3 shadow-sm">
      <h6 className="card-title">Set Reminder</h6>
      <div className="input-group mt-2">
        <input
          type="time"
          className="form-control"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSetReminder}>
          Set Reminder
        </button>
      </div>
    </div>
  );
};

export default ReminderSettings;
