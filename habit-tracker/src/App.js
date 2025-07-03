import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import HabitList from './components/HabitList';
import AddHabitForm from './components/AddHabitForm';
import Analytics from './components/Analytics';
import Dashboard from './components/Dashboard';
import MotivationalQuote from './components/MotivationalQuote';
import LevelDisplay from './components/LevelDisplay';
import ShareProgress from './components/ShareProgress';
import HabitSuggestions from './components/HabitSuggestions';
import DataManagement from './components/DataManagement';
import Login from './components/Login';
import Register from './components/Register';
import authService from './services/authService';
import habitService from './services/habitService';

const PrivateRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  const [habits, setHabits] = useState([]);
  const [categories] = useState([
    { id: 1, name: 'Health', color: '#28a745' }, // Green
    { id: 2, name: 'Work', color: '#007bff' },   // Blue
    { id: 3, name: 'Personal', color: '#ffc107' }, // Yellow
    { id: 4, name: 'Skill Development', color: '#fd7e14' }, // Orange
    { id: 5, name: 'Uncategorized', color: '#6c757d' }, // Gray
  ]);
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('habits');
  const [layout, setLayout] = useState('default');
  const [isLayoutDropdownOpen, setIsLayoutDropdownOpen] = useState(false);
  const layoutDropdownRef = useRef(null);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [customSuggestedHabits, setCustomSuggestedHabits] = useState([]);
  const XP_PER_LEVEL = 100;
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      habitService.getHabits().then(res => {
        const habitsWithParsedDates = res.data.map(habit => ({
          ...habit,
          history: habit.history.map(entry => ({
            ...entry,
            date: new Date(entry.date)
          }))
        }));
        setHabits(habitsWithParsedDates);
      });
    }
  }, []);


  const allBadges = [
    { id: 1, name: 'First Step', description: 'Track your first habit', icon: 'bi bi-award-fill', condition: (habits) => habits.some(habit => habit.history.length > 0) },
    { id: 2, name: 'Consistent Beginner', description: 'Track a habit for 7 consecutive days', icon: 'bi bi-star-fill', condition: (habits) => habits.some(habit => {
        if (habit.history.length < 7) return false;
        let streak = 0;
        let lastDate = null;
        for (let i = habit.history.length - 1; i >= 0; i--) {
          const currentDate = new Date(habit.history[i].date);
          currentDate.setHours(0, 0, 0, 0);
          if (lastDate && (lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24) === 1) {
            streak++;
          } else if (!lastDate || (lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24) > 1) {
            streak = 1;
          }
          lastDate = currentDate;
          if (streak >= 7) return true;
        }
        return false;
      })
    },
    { id: 3, name: 'Habit Master', description: 'Track 5 different habits', icon: 'bi bi-trophy-fill', condition: (habits) => habits.filter(habit => habit.history.length > 0).length >= 5 },
  ];

  const calculateEarnedBadges = (habits) => {
    return allBadges.filter(badge => badge.condition(habits));
  };

  const setReminder = useCallback((id, time) => {
    const habitToUpdate = habits.find(h => h._id === id);
    if (habitToUpdate) {
      habitService.updateHabit(id, { ...habitToUpdate, reminderTime: time }).then(res => {
        setHabits(prevHabits =>
          prevHabits.map((habit) =>
            habit._id === id
              ? { ...habit, reminderTime: time }
              : habit
          )
        );
      });
    }
  }, [habits]);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
    const storedLevel = parseInt(localStorage.getItem('level')) || 1;
    const storedXp = parseInt(localStorage.getItem('xp')) || 0;
    setLevel(storedLevel);
    setXp(storedXp);

    const storedCustomSuggestions = JSON.parse(localStorage.getItem('customSuggestedHabits'));
    if (storedCustomSuggestions) {
      setCustomSuggestedHabits(storedCustomSuggestions);
    }

    if (!('Notification' in window)) {
      console.log("This browser does not support desktop notification");
    } else if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    const handleClickOutside = (event) => {
      if (layoutDropdownRef.current && !layoutDropdownRef.current.contains(event.target)) {
        setIsLayoutDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('level', level);
    localStorage.setItem('xp', xp);
    localStorage.setItem('customSuggestedHabits', JSON.stringify(customSuggestedHabits));
    document.body.className = theme === 'dark' ? 'bg-dark text-white' : '';

    // Clear existing reminders
    habits.forEach(habit => {
      if (habit.reminderTimeoutId) {
        clearTimeout(habit.reminderTimeoutId);
      }
    });

    // Schedule new reminders
    habits.forEach(habit => {
      if (habit.reminderTime) {
        const [hours, minutes] = habit.reminderTime.split(':').map(Number);
        const now = new Date();
        const reminderDate = new Date();
        reminderDate.setHours(hours, minutes, 0, 0);

        if (reminderDate.getTime() < now.getTime()) {
          reminderDate.setDate(reminderDate.getDate() + 1);
        }

        const delay = reminderDate.getTime() - now.getTime();

        if (delay > 0) {
          const timeoutId = setTimeout(() => {
            if (Notification.permission === "granted") {
              const notification = new Notification('Habit Reminder', {
                body: `Time to ${habit.name}!`, 
                icon: '/logo192.png',
                data: { habitId: habit._id, reminderTime: habit.reminderTime }
              });

              notification.onclick = () => {
                window.focus();
              };

              notification.onclose = (event) => {
                if (event.isTrusted) {
                  const snoozedTime = new Date(now.getTime() + 10 * 60 * 1000);
                  const snoozedHours = snoozedTime.getHours().toString().padStart(2, '0');
                  const snoozedMinutes = snoozedTime.getMinutes().toString().padStart(2, '0');
                  setReminder(habit._id, `${snoozedHours}:${snoozedMinutes}`);
                }
              };
            }
          }, delay);

          setHabits(prevHabits => prevHabits.map(h => 
            h._id === habit._id ? { ...h, reminderTimeoutId: timeoutId } : h
          ));
        }
      }
    });
  }, [habits, theme, level, xp, customSuggestedHabits, setReminder]);

  const addHabit = (habit) => {
    habitService.addHabit(habit).then(res => {
      setHabits([...habits, res.data]);
    });
  };

  const deleteHabit = (id) => {
    habitService.deleteHabit(id).then(() => {
      setHabits(habits.filter((habit) => habit._id !== id));
    });
  };

  const trackHabit = (id, duration = null) => {
    const habitToUpdate = habits.find(h => h._id === id);
    if (habitToUpdate) {
      const updatedHistory = [...habitToUpdate.history, { date: new Date().toISOString(), duration: duration }];
      habitService.updateHabit(id, { ...habitToUpdate, history: updatedHistory }).then(res => {
        setHabits(
          habits.map((habit) =>
            habit._id === id
              ? { ...habit, history: updatedHistory }
              : habit
          )
        );
        setXp(prevXp => {
          const newXp = prevXp + 10;
          if (newXp >= XP_PER_LEVEL) {
            setLevel(prevLevel => prevLevel + 1);
            return newXp - XP_PER_LEVEL;
          }
          return newXp;
        });
      });
    }
  };

  const addNote = (id, note) => {
    const habitToUpdate = habits.find(h => h._id === id);
    if (habitToUpdate) {
      const updatedNotes = [...habitToUpdate.notes, { id: Date.now(), text: note }];
      habitService.updateHabit(id, { ...habitToUpdate, notes: updatedNotes }).then(res => {
        setHabits(
          habits.map((habit) =>
            habit._id === id
              ? { ...habit, notes: updatedNotes }
              : habit
          )
        );
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const addCustomSuggestedHabit = (habitName) => {
    if (habitName.trim() !== '') {
      setCustomSuggestedHabits(prev => [...prev, { name: habitName.trim(), category: 'Uncategorized', frequency: 'daily' }]);
    }
  };

  const removeCustomSuggestedHabit = (index) => {
    setCustomSuggestedHabits(prev => prev.filter((_, i) => i !== index));
  };

  const logOut = () => {
    authService.logout();
    setCurrentUser(undefined);
    setHabits([]);
  };

  return (
    <Router>
      <div className={`container-fluid py-4 ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
        <div className="d-flex justify-content-between align-items-center mb-4 px-3">
          <h1 className="text-center mb-0">Habit Tracker</h1>
          <div>
            {currentUser && (
              <button className="btn btn-outline-secondary me-2" onClick={logOut}>
                Logout
              </button>
            )}
            <button className="btn btn-outline-secondary" onClick={toggleTheme}>
              <i className={`bi bi-${theme === 'light' ? 'moon' : 'sun'}`}></i>
            </button>
          </div>
        </div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MotivationalQuote />

                <ul className="nav nav-pills nav-fill mb-4">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'habits' ? 'active' : ''}`}
                      onClick={() => setActiveTab('habits')}
                    >
                      Habits
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                      onClick={() => setActiveTab('analytics')}
                    >
                      Analytics
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                      onClick={() => setActiveTab('dashboard')}
                    >
                      Dashboard
                    </button>
                  </li>
                  <li className="nav-item dropdown" ref={layoutDropdownRef}>
                    <button
                      className="nav-link dropdown-toggle"
                      onClick={() => setIsLayoutDropdownOpen(!isLayoutDropdownOpen)}
                      aria-expanded={isLayoutDropdownOpen}
                    >
                      Layout
                    </button>
                    <ul className={`dropdown-menu ${isLayoutDropdownOpen ? 'show' : ''}`}>
                      <li>
                        <button className="dropdown-item" onClick={() => {
                          setLayout('default');
                          setIsLayoutDropdownOpen(false);
                        }}>
                          Default
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => {
                          setLayout('analytics-first');
                          setIsLayoutDropdownOpen(false);
                        }}>
                          Analytics First
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => {
                          setLayout('full-width-habits');
                          setIsLayoutDropdownOpen(false);
                        }}>
                          Full Width Habits
                        </button>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'data' ? 'active' : ''}`}
                      onClick={() => setActiveTab('data')}
                    >
                      Data
                    </button>
                  </li>
                </ul>

                {activeTab === 'habits' && (
                  <>
                    <AddHabitForm addHabit={addHabit} categories={categories} customSuggestedHabits={customSuggestedHabits} />
                    <HabitSuggestions habits={habits} addHabit={addHabit} categories={categories} customSuggestedHabits={customSuggestedHabits} />
                    <HabitList
                      habits={habits}
                      deleteHabit={deleteHabit}
                      trackHabit={trackHabit}
                      addNote={addNote}
                      categories={categories}
                      setReminder={setReminder}
                    />
                  </>
                )}

                {activeTab === 'analytics' && (
                  <>
                    <Analytics habits={habits} categories={categories} earnedBadges={calculateEarnedBadges(habits)} />
                    <LevelDisplay level={level} xp={xp} XP_PER_LEVEL={XP_PER_LEVEL} />
                    <ShareProgress habits={habits} level={level} />
                  </>
                )}

                {activeTab === 'dashboard' && (
                  <Dashboard
                    habits={habits}
                    categories={categories}
                    deleteHabit={deleteHabit}
                    trackHabit={trackHabit}
                    addNote={addNote}
                    layout={layout}
                  />
                )}

                {activeTab === 'data' && (
                  <DataManagement
                    habits={habits}
                    categories={categories}
                    setHabits={setHabits}
                    customSuggestedHabits={customSuggestedHabits}
                    addCustomSuggestedHabit={addCustomSuggestedHabit}
                    removeCustomSuggestedHabit={removeCustomSuggestedHabit}
                  />
                )}
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
