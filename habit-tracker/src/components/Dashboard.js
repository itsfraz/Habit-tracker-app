import React, { useMemo } from 'react';
import HabitList from './HabitList';

const Dashboard = ({ habits, categories, deleteHabit, trackHabit, addNote, user, setReminder, theme }) => {
  const isDark = theme === 'dark';
  
  // --- Enhanced Stats Logic --- //
  const today = new Date().toISOString().slice(0, 10);
  
  const dailyStats = useMemo(() => {
    let completedToday = 0;
    let totalDueToday = 0;
    let streaks = [];
    let pendingHabits = [];
    let completedHabits = [];

    habits.forEach(h => {
        // Simple logic: Assuming all habits are "due" daily for now, 
        // OR check frequency if complex logic exists. 
        // For this UI, let's assume 'daily' intention.
        totalDueToday++;
        
        const isDone = h.history.some(e => e.date === today && e.completions >= h.targetCompletions);
        if (isDone) {
            completedToday++;
            completedHabits.push(h);
        } else {
            pendingHabits.push(h);
        }

        // Streak Calc
        let currentStreak = 0;
        // ... (Simplified streak logic or reuse existing helper if available. 
        // Since we don't have a shared helper file visible, implementing a quick robust one)
        const sortedHistory = [...h.history].sort((a, b) => new Date(b.date) - new Date(a.date));
        let streakDate = new Date();
        streakDate.setHours(0,0,0,0);
        
        // Check if today is done, else check from yesterday
        let dateToCheck = new Date(streakDate); 
        const todayStr = dateToCheck.toISOString().slice(0, 10);
        const hasToday = sortedHistory.some(e => e.date === todayStr && e.completions >= h.targetCompletions);
        
        if (!hasToday) {
             dateToCheck.setDate(dateToCheck.getDate() - 1);
        }

        for (let i = 0; i < sortedHistory.length; i++) {
            const entryDate = new Date(sortedHistory[i].date);
            const entryStr = entryDate.toISOString().slice(0, 10);
            const checkStr = dateToCheck.toISOString().slice(0, 10);
            
            if (entryStr === checkStr && sortedHistory[i].completions >= h.targetCompletions) {
                currentStreak++;
                dateToCheck.setDate(dateToCheck.getDate() - 1);
            } else if (entryDate < dateToCheck) {
                break; // Gap found
            }
        }
        if (currentStreak > 0) streaks.push({ name: h.name, count: currentStreak });
    });

    const progressPercentage = totalDueToday === 0 ? 0 : Math.round((completedToday / totalDueToday) * 100);
    const topStreak = streaks.sort((a,b) => b.count - a.count)[0];

    return { completedToday, totalDueToday, progressPercentage, topStreak, pendingHabits };
  }, [habits, today]);


  return (
    <div className="dashboard-container fade-in">
      {/* --- Intelligent Header --- */}
      <div className="dashboard-header mb-4 p-4 rounded-4 text-white shadow-sm position-relative overflow-hidden" 
           style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
        <div className="position-relative z-1 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
                <h6 className="text-uppercase text-white-50 fw-bold small-tracking mb-1">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h6>
                <h2 className="fw-bold mb-1 display-6">
                    Ready to crush it, {user?.username?.split(' ')[0] || 'Guest'}? 🚀
                </h2>
                <p className="mb-0 text-white-50">
                    You have <strong className="text-white">{dailyStats.pendingHabits.length} habits</strong> remaining today.
                </p>
            </div>
            
            {/* Daily Progress Circle */}
            <div className="d-flex align-items-center gap-3 bg-white bg-opacity-10 p-3 rounded-4 backdrop-blur-sm border border-white border-opacity-10">
                <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                     <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                            className="text-white opacity-25"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                        <path
                            className="text-success"
                            strokeDasharray={`${dailyStats.progressPercentage}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#4ade80"
                            strokeWidth="3"
                        />
                    </svg>
                    <span className="position-absolute small fw-bold text-white">{dailyStats.progressPercentage}%</span>
                </div>
                <div>
                    <div className="small text-white-50 text-uppercase fw-bold">Daily Goal</div>
                    <div className="fw-bold fs-5 text-white">{dailyStats.completedToday} / {dailyStats.totalDueToday}</div>
                </div>
            </div>
        </div>
      </div>

      <div className="row g-4">
        {/* --- Main Action Column --- */}
        <div className="col-lg-8">
            <div className={`section-container ${isDark ? 'text-white' : ''}`}>
               <div className="d-flex align-items-center justify-content-between mb-4 ps-2 border-start border-4 border-primary">
                  <h4 className="section-title mb-0 fw-bold">Today's Focus</h4>
                  <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3">
                    Action Required
                  </span>
               </div>
               
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

        {/* --- Smart Side Widgets --- */}
        <div className="col-lg-4">
            <div className="d-flex flex-column gap-4 sticky-top" style={{ top: '20px' }}>
                
                {/* 1. Streak Spotlight */}
                <div className="modern-card p-4 rounded-4 border-start border-4 border-warning">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="icon-box bg-warning bg-opacity-10 text-warning rounded-circle p-2">
                             <i className="bi bi-fire fs-5"></i>
                        </div>
                        <h6 className="fw-bold mb-0 text-body">Streak Spotlight</h6>
                    </div>
                    {dailyStats.topStreak ? (
                        <div>
                            <h3 className="fw-bold text-primary mb-1">{dailyStats.topStreak.count} Days</h3>
                            <p className="text-muted small mb-0">
                                You're unstoppable on <strong>{dailyStats.topStreak.name}</strong>! Keep the fire burning.
                            </p>
                        </div>
                    ) : (
                        <p className="text-muted small mb-0">Start a habit today to build your first streak!</p>
                    )}
                </div>

                {/* 2. Quick Insight / Suggestion */}
                <div className="modern-card p-4 rounded-4 border-start border-4 border-info">
                   <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="icon-box bg-info bg-opacity-10 text-info rounded-circle p-2">
                             <i className="bi bi-lightbulb-fill fs-5"></i>
                        </div>
                        <h6 className="fw-bold mb-0 text-body">Smart Touch</h6>
                    </div>
                    <p className="text-muted small mb-0 fst-italic">
                        "Small daily improvements are the key to staggering long-term results."
                    </p>
                    <div className="mt-3 pt-3 border-top border-light">
                         <span className="tiny-text text-uppercase fw-bold text-muted small-tracking">Pending Tasks</span>
                         <div className="d-flex flex-wrap gap-2 mt-2">
                             {dailyStats.pendingHabits.slice(0, 3).map(h => (
                                 <span key={h._id} className="badge bg-light text-dark border fw-normal">{h.name}</span>
                             ))}
                             {dailyStats.pendingHabits.length > 3 && (
                                 <span className="badge bg-light text-muted border fw-normal">+{dailyStats.pendingHabits.length - 3} more</span>
                             )}
                              {dailyStats.pendingHabits.length === 0 && (
                                 <span className="text-success small fw-bold">All caught up! 🎉</span>
                             )}
                         </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

