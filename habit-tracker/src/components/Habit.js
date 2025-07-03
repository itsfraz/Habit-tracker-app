
import React, { useState } from 'react';
import HabitCalendar from './HabitCalendar';
import ReminderSettings from './ReminderSettings';

const Habit = ({ habit, deleteHabit, trackHabit, addNote, categories, setReminder }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [note, setNote] = useState('');
  const [duration, setDuration] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showReminderSettings, setShowReminderSettings] = useState(false);

  const getStreak = () => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (typeof habit.frequency === 'object' && habit.frequency.type === 'custom') {
      const { count, period } = habit.frequency;
      let periodStartDate = new Date(today);

      if (period === 'week') {
        periodStartDate.setDate(today.getDate() - today.getDay()); // Start of the current week (Sunday)
      } else if (period === 'month') {
        periodStartDate.setDate(1); // Start of the current month
      }
      periodStartDate.setHours(0, 0, 0, 0);

      const completionsInPeriod = habit.history.filter(entry => {
        const date = new Date(entry.date);
        date.setHours(0, 0, 0, 0);
        return date.getTime() >= periodStartDate.getTime() && date.getTime() <= today.getTime();
      }).length;

      return `${completionsInPeriod} / ${count} per ${period}`;

    } else {
      let increment;
      switch (habit.frequency) {
        case 'weekly':
          increment = 7;
          break;
        case 'monthly':
          increment = 30; // Approximation
          break;
        default:
          increment = 1;
      }

      for (let i = habit.history.length - 1; i >= 0; i--) {
        const date = new Date(habit.history[i].date);
        date.setHours(0, 0, 0, 0);

        if (today.getTime() === date.getTime()) {
          streak++;
          today.setDate(today.getDate() - increment);
        } else if (today.getTime() > date.getTime()) {
          break;
        }
      }
    }

    return streak;
  };

  const handleAddNote = () => {
    if (note) {
      addNote(habit._id, note);
      setNote('');
    }
  };

  const isDueTodayAndNotCompleted = () => {
    if (habit.frequency !== 'daily') return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastCompletion = habit.history.length > 0
      ? new Date(habit.history[habit.history.length - 1].date)
      : null;

    if (!lastCompletion) return true; // Never completed

    lastCompletion.setHours(0, 0, 0, 0);

    return today.getTime() !== lastCompletion.getTime();
  };

  const categoryColor = categories.find(cat => cat.name === habit.category)?.color || '#6c757d'; // Default to gray if not found

  return (
    <div className={`card shadow-sm mb-4 ${isAnimating ? 'habit-completed' : ''}`} style={{ borderLeft: `5px solid ${categoryColor}` }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title text-primary">{habit.name}</h5>
            <p className="card-text mb-1"><strong>Category:</strong> {habit.category}</p>
            <p className="card-text mb-1"><strong>Frequency:</strong> {typeof habit.frequency === 'object' ? `${habit.frequency.count} times per ${habit.frequency.period}` : habit.frequency}</p>
            <p className="card-text mb-1"><strong>Streak:</strong> {getStreak()}</p>
            {isDueTodayAndNotCompleted() && (
              <p className="text-danger fw-bold">Due today!</p>
            )}
          </div>
          <div className="d-flex flex-column align-items-end">
            <div className="d-flex mb-2">
              <button
                className="btn btn-success btn-sm me-2"
                onClick={() => {
                  trackHabit(habit._id, habit.isTimeBased ? duration : null);
                  setIsAnimating(true);
                  setTimeout(() => setIsAnimating(false), 500); // Animation duration
                }}
                title="Mark as Complete"
              >
                <i className="bi bi-check-lg"></i>
              </button>
              <button
                className="btn btn-outline-primary btn-sm me-2"
                onClick={() => setShowCalendar(!showCalendar)}
                title="View Calendar"
              >
                <i className="bi bi-calendar-event"></i>
              </button>
              <button
                className="btn btn-outline-info btn-sm me-2"
                onClick={() => setShowReminderSettings(!showReminderSettings)}
                title="Set Reminder"
              >
                <i className="bi bi-bell"></i>
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => deleteHabit(habit._id)}
                title="Delete Habit"
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
            {habit.isTimeBased && (
              <div className="input-group input-group-sm w-75">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                  min="0"
                />
                <span className="input-group-text">Min</span>
              </div>
            )}
          </div>
        </div>
        {showCalendar && <HabitCalendar habit={habit} />}
        {showReminderSettings && <ReminderSettings habit={habit} setReminder={setReminder} />}
        <div className="mt-3 pt-3 border-top">
          <h6 className="text-secondary">Notes</h6>
          {habit.notes && habit.notes.length > 0 ? (
            <ul className="list-group list-group-flush mb-3">
              {habit.notes.map((n) => (
                <li key={n.id} className="list-group-item px-0 bg-transparent d-flex justify-content-between align-items-center">
                  {n.text}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No notes yet.</p>
          )}
          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary btn-sm"
              type="button"
              onClick={handleAddNote}
            >
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Habit;
