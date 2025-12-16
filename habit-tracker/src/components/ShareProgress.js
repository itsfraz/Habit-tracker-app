import React from 'react';

const ShareProgress = ({ habits, level }) => {
  const generateShareMessage = () => {
    const totalHabits = habits.length;
    const completedHabits = habits.filter(habit => habit.history.length > 0).length;
    const message = `I've completed ${completedHabits} out of ${totalHabits} habits and reached Level ${level} in my Habit Tracker! #HabitTracker #Productivity`;
    return message;
  };

  const handleShare = () => {
    const message = generateShareMessage();
    navigator.clipboard.writeText(message).then(() => {
      alert('Progress copied to clipboard! You can now paste it on social media.');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };



  return (
    <div className="modern-card mt-4 p-3 rounded-4 fade-in mb-4">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
         <div className="d-flex align-items-center gap-3">
            <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-share-fill fs-6"></i>
            </div>
            <div>
                <h6 className="fw-bold mb-0 text-dark">Share your journey</h6>
                <p className="text-muted small mb-0" style={{ fontSize: '0.8rem' }}>Inspire friends with your progress!</p>
            </div>
         </div>
         
         <button 
            className="btn btn-sm btn-primary rounded-pill px-4 fw-bold shadow-sm" 
            onClick={handleShare}
            style={{ fontSize: '0.8rem' }}
         >
           <i className="bi bi-clipboard me-2"></i>
           Copy Link
         </button>
      </div>
    </div>
  );

};

export default ShareProgress;
