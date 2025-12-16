import React, { useState, useRef, useEffect } from 'react';
import HabitCalendar from './HabitCalendar';
import ReminderSettings from './ReminderSettings';

const Habit = ({ habit, deleteHabit, trackHabit, addNote, categories, setReminder }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [note, setNote] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showReminderSettings, setShowReminderSettings] = useState(false);

  const calendarRef = useRef(null);
  const calendarButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showCalendar &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        (!calendarButtonRef.current || !calendarButtonRef.current.contains(event.target))
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  const today = new Date().toISOString().slice(0, 10);
  const historyEntry = habit.history.find(entry => entry.date === today);
  const completionsToday = historyEntry ? historyEntry.completions : 0;
  const remainingCompletions = habit.targetCompletions - completionsToday;

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
        const entryDate = new Date(habit.history[i].date);
        entryDate.setHours(0, 0, 0, 0);

        const currentDayCompletions = habit.history[i].completions || 0;

        if (today.getTime() === entryDate.getTime() && currentDayCompletions >= habit.targetCompletions) {
          streak++;
          today.setDate(today.getDate() - increment);
        } else if (today.getTime() > entryDate.getTime()) {
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

  const categoryColor = categories.find(cat => cat.name === habit.category)?.color || '#6c757d'; // Default to gray if not found

  return (
    <div className={`modern-card mb-4 rounded-4 ${isAnimating ? 'habit-completed' : ''} card-hover-effect position-relative overflow-hidden`}>
      <div 
        className="position-absolute start-0 top-0 bottom-0" 
        style={{ width: '6px', backgroundColor: categoryColor }}
      ></div>
      
      <div className="card-body p-3 ms-2">
        {/* Header: Icon, Title, Streak */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center" style={{ minWidth: 0 }}>
             <div className="icon-box bg-light text-secondary rounded-circle me-3 p-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '42px', height: '42px' }}>
                <i className="bi bi-activity fs-5 text-primary"></i>
             </div>
             <div className="text-truncate">
               <h6 className="card-title fw-bold mb-0 text-dark text-truncate" title={habit.name}>{habit.name}</h6>
               <span className="badge bg-light text-secondary fw-normal border mt-1" style={{ fontSize: '0.7rem' }}>
                 {habit.category}
               </span>
             </div>
          </div>
          
          <div className="text-end ms-2 flex-shrink-0">
            <h4 className="mb-0 fw-bold text-primary">{getStreak()}</h4>
            <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Streak</small>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-3 bg-light rounded-3 p-3">
           <div className="d-flex justify-content-between align-items-end mb-2">
              <span className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Daily Goal</span>
              <span className="text-muted small">{Math.round((completionsToday / habit.targetCompletions) * 100)}%</span>
           </div>
           
           <div className="progress" style={{ height: '6px' }}>
             <div 
               className="progress-bar bg-primary rounded-pill" 
               role="progressbar" 
               style={{ width: `${Math.min((completionsToday / habit.targetCompletions) * 100, 100)}%` }}
               aria-valuenow={completionsToday} 
               aria-valuemin="0" 
               aria-valuemax={habit.targetCompletions}
             ></div>
           </div>
           <div className="d-flex justify-content-between mt-1">
             <span className="small fw-bold text-dark">{completionsToday} / {habit.targetCompletions}</span>
           </div>
        </div>

        {/* Action Toolbar */}
        <div className="d-flex align-items-center justify-content-between gap-2">
           <div className="d-flex gap-1">
              <button
                ref={calendarButtonRef}
                className="btn btn-light btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center text-secondary hover-primary"
                onClick={() => setShowCalendar(!showCalendar)}
                title="View Calendar"
                style={{ width: '32px', height: '32px' }}
              >
                <i className="bi bi-calendar-event" style={{ fontSize: '0.9rem' }}></i>
              </button>
              <button
                className="btn btn-light btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center text-secondary hover-info"
                onClick={() => setShowReminderSettings(!showReminderSettings)}
                title="Set Reminder"
                 style={{ width: '32px', height: '32px' }}
              >
                <i className="bi bi-bell" style={{ fontSize: '0.9rem' }}></i>
              </button>
              <button
                className="btn btn-light btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center text-secondary hover-danger"
                onClick={() => deleteHabit(habit._id)}
                title="Delete Habit"
                 style={{ width: '32px', height: '32px' }}
              >
                <i className="bi bi-trash" style={{ fontSize: '0.9rem' }}></i>
              </button>
           </div>

           <button
              className={`btn ${remainingCompletions <= 0 ? 'btn-success' : 'btn-primary'} rounded-pill px-3 py-1 fw-bold shadow-sm transition-all d-flex align-items-center justify-content-center`}
              style={{ fontSize: '0.85rem', height: '36px' }}
              onClick={() => {
                trackHabit(habit._id);
                setIsAnimating(true);
                setTimeout(() => setIsAnimating(false), 500);
              }}
              disabled={remainingCompletions <= 0}
            >
              {remainingCompletions <= 0 ? (
                <>
                  <i className="bi bi-check-lg fs-6"></i>
                </>
              ) : (
                <>
                  <i className="bi bi-plus-lg me-1"></i>
                  <span>Do It</span>
                </>
              )}
            </button>
        </div>

        {/* Collapsible Sections */}
        {showCalendar && (
          <div className="mt-4 fade-in">
            <HabitCalendar habit={habit} />
          </div>
        )}
        
        {showReminderSettings && (
          <div className="mt-4 fade-in">
             <ReminderSettings habit={habit} setReminder={setReminder} />
          </div>
        )}

        {/* Quick Notes Inline */}
        <div className="mt-4 pt-3 border-top border-light">
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-transparent border-0 ps-0 text-muted">
              <i className="bi bi-journal-text"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 bg-transparent shadow-none"
              placeholder="Add a quick note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddNote() }}
            />
            {note && (
              <button
                className="btn btn-link text-primary text-decoration-none fw-bold"
                type="button"
                onClick={handleAddNote}
              >
                Save
              </button>
            )}
          </div>
          
          {/* Recent Note Preview (Last one) */}
          {habit.notes && habit.notes.length > 0 && (
             <div className="mt-2 ms-4 text-muted small fst-italic">
                "{habit.notes[habit.notes.length - 1].text}"
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Habit;
