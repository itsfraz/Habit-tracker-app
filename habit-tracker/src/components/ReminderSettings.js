import React, { useState } from 'react';

const ReminderSettings = ({ habit, setReminder }) => {
  const [time, setTime] = useState(habit.reminderTime || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSetReminder = () => {
    setReminder(habit._id, time);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleClearReminder = () => {
    setTime('');
    setReminder(habit._id, null);
  };

  return (
    <div className="reminder-widget p-3 rounded-4 fade-in">
      <div className="d-flex align-items-center justify-content-between mb-3">
         <h6 className="fw-bold text-dark mb-0">
           <i className="bi bi-alarm-fill text-warning me-2"></i>
           Daily Reminder
         </h6>
         {habit.reminderTime && (
            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2">
              active
            </span>
         )}
      </div>

      <div className="p-3 bg-white rounded-3 border">
          <label className="form-label small text-muted fw-bold text-uppercase mb-2">
             Set Time
          </label>
          
          <div className="time-picker-wrapper mb-3">
             <i className="bi bi-clock time-picker-icon"></i>
             <input
               type="time"
               className="form-control form-control-lg rounded-3 border-light bg-light shadow-none"
               value={time}
               onChange={(e) => {
                 setTime(e.target.value);
                 setIsSaved(false);
               }}
             />
          </div>

          <div className="d-flex gap-2">
             <button 
               className={`btn flex-grow-1 rounded-3 fw-bold transition-all ${isSaved ? 'btn-success' : 'btn-primary'}`}
               onClick={handleSetReminder}
               disabled={!time}
             >
               {isSaved ? (
                 <>
                   <i className="bi bi-check2 me-1"></i>
                   Saved!
                 </>
               ) : 'Save Reminder'}
             </button>
             
             {habit.reminderTime && (
               <button 
                 className="btn btn-light text-danger border-0 rounded-3"
                 onClick={handleClearReminder}
                 title="Remove Reminder"
               >
                 <i className="bi bi-trash"></i>
               </button>
             )}
          </div>
      </div>
      
      <p className="text-muted small mt-2 mb-0 ms-1">
        <i className="bi bi-info-circle me-1"></i>
        We'll send you a notification at this time.
      </p>
    </div>
  );
};

export default ReminderSettings;
