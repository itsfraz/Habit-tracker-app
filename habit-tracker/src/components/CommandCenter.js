import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CommandCenter = ({ habits, trackHabit, addNote }) => {
  const [snoozedIds, setSnoozedIds] = useState(new Set());
  const [activeNotes, setActiveNotes] = useState({});

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const scoredHabits = useMemo(() => {
    return habits.map(habit => {
      let score = 0;
      let reasons = [];
      let streak = 0;

      // Calculate streak and check if yesterday was done
      const history = habit.history || [];
      const doneToday = history.find(h => h.date === todayStr && h.completions >= habit.targetCompletions);
      const doneYesterday = history.find(h => h.date === yesterdayStr && h.completions >= habit.targetCompletions);

      if (doneToday) {
        return { habit, score: -1, streak: 0, doneToday: true }; // Don't show completed
      }

      // Basic calculation for streak (simplified daily check)
      let currentStreak = 0;
      const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
      let dateToCheck = new Date(yesterday);
      
      for (let i = 0; i < sortedHistory.length; i++) {
        const entryDate = new Date(sortedHistory[i].date);
        const entryStr = entryDate.toISOString().slice(0, 10);
        const checkStr = dateToCheck.toISOString().slice(0, 10);
        
        if (entryStr === checkStr && sortedHistory[i].completions >= habit.targetCompletions) {
            currentStreak++;
            dateToCheck.setDate(dateToCheck.getDate() - 1);
        } else if (entryDate < dateToCheck) {
            break;
        }
      }

      if (currentStreak > 0) {
        score += 20 + currentStreak; // Higher streak = slightly higher priority to save it
        reasons.push('🔥 Streak at risk');
      }

      if (!doneYesterday) {
        score += 15;
        reasons.push('🔄 Recovery plan');
      } else {
        score += 5;
        if (currentStreak === 0) reasons.push('📅 Today\'s Focus');
      }

      // Add base priority score if any deadlines/targets
      score += habit.targetCompletions * 2;

      return { habit, score, currentStreak, reasons, doneToday: false };
    }).filter(item => !item.doneToday && !snoozedIds.has(item.habit._id))
      .sort((a, b) => b.score - a.score);
  }, [habits, snoozedIds, todayStr, yesterdayStr]);

  const topHabits = scoredHabits.slice(0, 3);

  const handleSnooze = (id) => {
    setSnoozedIds(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const handleNoteChange = (id, value) => {
    setActiveNotes(prev => ({ ...prev, [id]: value }));
  };

  const submitNote = (id) => {
    if (activeNotes[id] && activeNotes[id].trim() !== '') {
      addNote(id, activeNotes[id]);
      setActiveNotes(prev => ({ ...prev, [id]: '' }));
    }
  };

  if (topHabits.length === 0) {
    return null;
  }

  return (
    <div className="command-center-card modern-card p-4 rounded-4 mb-4" style={{
      background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
      borderLeft: '4px solid #3b82f6',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
    }}>
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom border-secondary pb-3">
        <div>
          <h4 className="fw-bold mb-1 text-white d-flex align-items-center gap-2">
            <i className="bi bi-radar text-primary"></i>
            Command Center
          </h4>
          <p className="text-white-50 small mb-0">Priority Action Queue & Recovery</p>
        </div>
        <div className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-2">
          {topHabits.length} Action{topHabits.length !== 1 ? 's' : ''} Recommended
        </div>
      </div>

      <div className="d-flex flex-column gap-3">
        <AnimatePresence>
          {topHabits.map(({ habit, reasons, currentStreak }, index) => {
            const todayEntry = habit.history?.find(h => h.date === todayStr);
            const completions = todayEntry ? todayEntry.completions : 0;
            
            return (
              <motion.div 
                key={habit._id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="priority-item bg-white bg-opacity-10 rounded-3 p-3 hover-lift"
              >
                <div className="row align-items-center g-3">
                  
                  {/* Left: Info */}
                  <div className="col-12 col-md-5">
                    <div className="d-flex align-items-center gap-3">
                      <div className="flex-shrink-0 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 text-white rounded-circle fs-5 fw-bold border border-secondary" style={{ width: '40px', height: '40px' }}>
                        {index + 1}
                      </div>
                      <div>
                        <h6 className="text-white fw-bold mb-1">{habit.name}</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {reasons.map((r, i) => (
                            <span key={i} className={`badge ${r.includes('Recovery') ? 'bg-danger text-white' : 'bg-warning text-dark'} small`}>
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Quick Note */}
                  <div className="col-12 col-md-4">
                     <div className="input-group input-group-sm bg-dark bg-opacity-50 rounded-pill overflow-hidden border border-secondary">
                        <input 
                          type="text" 
                          className="form-control bg-transparent border-0 text-white shadow-none ps-3" 
                          placeholder="Quick note..."
                          value={activeNotes[habit._id] || ''}
                          onChange={(e) => handleNoteChange(habit._id, e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && submitNote(habit._id)}
                        />
                        <button 
                          className="btn btn-primary px-3 text-white" 
                          type="button"
                          onClick={() => submitNote(habit._id)}
                          disabled={!activeNotes[habit._id]}
                        >
                          <i className="bi bi-send-fill" style={{fontSize: '0.8rem'}}></i>
                        </button>
                     </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="col-12 col-md-3 d-flex justify-content-md-end gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-outline-light btn-sm rounded-pill px-3 py-2 fw-bold flex-grow-1 flex-md-grow-0"
                      onClick={() => handleSnooze(habit._id)}
                    >
                      <i className="bi bi-clock-history me-1"></i> Snooze
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-success btn-sm rounded-pill px-4 py-2 fw-bold text-nowrap flex-grow-1 flex-md-grow-0 shadow-sm"
                      onClick={() => trackHabit(habit._id)}
                    >
                      <i className="bi bi-check2-circle me-1 fs-6"></i> 
                      {completions + 1}/{habit.targetCompletions}
                    </motion.button>
                  </div>
                  
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommandCenter;
