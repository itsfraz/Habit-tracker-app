import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StoryAnalytics = ({ habits }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const insights = useMemo(() => {
    if (!habits || habits.length === 0) return [];

    const insightsList = [];

    // 1. Calculate completions by day of week
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const completionsByDay = [0, 0, 0, 0, 0, 0, 0];
    
    habits.forEach(habit => {
      habit.history.forEach(entry => {
        const date = new Date(entry.date);
        completionsByDay[date.getDay()] += entry.completions;
      });
    });

    const maxCompletions = Math.max(...completionsByDay);
    const minCompletions = Math.min(...completionsByDay);
    
    const bestDayIndex = completionsByDay.indexOf(maxCompletions);
    const worstDayIndex = completionsByDay.indexOf(minCompletions);

    // Sparkline for days of week
    const daySparkline = completionsByDay.map((val, i) => ({
      label: daysOfWeek[i],
      value: val,
      height: maxCompletions > 0 ? `${(val / maxCompletions) * 100}%` : '0%',
      highlight: i === bestDayIndex ? 'success' : (i === worstDayIndex ? 'danger' : 'primary')
    }));

    if (maxCompletions > 0) {
      insightsList.push({
        id: 'best-day',
        title: 'Your Power Day',
        description: `You are unstoppable on **${daysOfWeek[bestDayIndex]}s**. Keep scheduling your hardest habits here!`,
        sparkline: daySparkline,
        icon: 'bi-lightning-charge-fill',
        color: 'text-warning'
      });
      
      if (maxCompletions !== minCompletions) {
        insightsList.push({
          id: 'drop-off',
          title: 'Drop-off Window',
          description: `Energy dips on **${daysOfWeek[worstDayIndex]}s**. Try reducing your goals or setting extra reminders.`,
          sparkline: daySparkline,
          icon: 'bi-battery-half',
          color: 'text-danger'
        });
      }
    }

    // 2. Most Resilient Habit
    let mostResilient = null;
    let highestSuccess = -1;

    habits.forEach(habit => {
      if (habit.history.length === 0) return;
      let totalCompletions = 0;
      let targetCompletions = 0;
      habit.history.forEach(h => {
        totalCompletions += Math.min(h.completions, habit.targetCompletions);
        targetCompletions += habit.targetCompletions;
      });
      const successRate = targetCompletions > 0 ? totalCompletions / targetCompletions : 0;
      if (successRate > highestSuccess) {
        highestSuccess = successRate;
        mostResilient = habit;
      }
    });

    if (mostResilient && highestSuccess > 0) {
      // Create a small timeline sparkline for this habit (last 7 days)
      const last7Days = [];
      const today = new Date();
      today.setHours(0,0,0,0);
      let maxDaily = 1;
      
      for(let i=6; i>=0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dStr = d.toISOString().slice(0, 10);
        const entry = mostResilient.history.find(h => h.date === dStr);
        const comps = entry ? entry.completions : 0;
        if(comps > maxDaily) maxDaily = comps;
        last7Days.push({
          label: daysOfWeek[d.getDay()][0],
          value: comps,
        });
      }

      const habitSparkline = last7Days.map(item => ({
        ...item,
        height: `${(item.value / Math.max(mostResilient.targetCompletions, maxDaily)) * 100}%`,
        highlight: item.value >= mostResilient.targetCompletions ? 'success' : 'secondary'
      }));

      insightsList.push({
        id: 'resilient',
        title: 'Most Resilient',
        description: `**${mostResilient.name}** has an amazing ${(highestSuccess * 100).toFixed(0)}% overall success rate.`,
        sparkline: habitSparkline,
        icon: 'bi-shield-check',
        color: 'text-success'
      });
    }

    // If we don't have enough data
    if (insightsList.length === 0) {
      insightsList.push({
        id: 'empty',
        title: 'Just getting started',
        description: 'Keep tracking your habits to unlock personalized insights and trends.',
        sparkline: [],
        icon: 'bi-stars',
        color: 'text-primary'
      });
    }

    return insightsList;
  }, [habits]);

  useEffect(() => {
    if (insights.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % insights.length);
    }, 6000); // Change slide every 6 seconds
    return () => clearInterval(timer);
  }, [insights.length]);

  if (insights.length === 0) return null;

  const currentInsight = insights[currentSlide];

  return (
    <div className="modern-card p-4 rounded-4 mb-4 position-relative overflow-hidden bg-dark text-white shadow-lg border-0" style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
    }}>
      {/* Background Decorative */}
      <div className="position-absolute top-0 end-0 opacity-10 p-4">
        <i className={`bi ${currentInsight.icon}`} style={{ fontSize: '12rem' }}></i>
      </div>

      <div className="d-flex align-items-center mb-3 position-relative z-index-1">
        <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50 rounded-pill px-3 py-2 text-uppercase fw-bold" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>
          <i className="bi bi-play-circle-fill me-2"></i>
          Your Week in 20s
        </span>
      </div>

      <div className="row align-items-center position-relative z-index-1" style={{ minHeight: '140px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentInsight.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="col-12 col-md-7 mb-4 mb-md-0"
          >
            <h3 className="fw-bold mb-2 d-flex align-items-center gap-2">
              <i className={`bi ${currentInsight.icon} ${currentInsight.color}`}></i>
              {currentInsight.title}
            </h3>
            <p className="text-white-50 fs-5 mb-0" dangerouslySetInnerHTML={{ __html: currentInsight.description.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }}></p>
          </motion.div>
        </AnimatePresence>

        <div className="col-12 col-md-5">
          <AnimatePresence mode="wait">
             <motion.div 
               key={currentInsight.id + "-chart"}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               transition={{ duration: 0.5 }}
               className="d-flex align-items-end justify-content-center gap-2 h-100" style={{ height: '80px' }}
             >
                {currentInsight.sparkline && currentInsight.sparkline.map((bar, idx) => (
                  <div key={idx} className="d-flex flex-column align-items-center justify-content-end gap-1" style={{ width: '24px', height: '100px' }}>
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: bar.height }}
                      transition={{ delay: 0.3 + (idx * 0.05), type: "spring" }}
                      className={`w-100 rounded-pill bg-${bar.highlight} ${bar.highlight !== 'primary' && bar.highlight !== 'success' && bar.highlight !== 'danger' ? 'bg-opacity-25' : ''}`}
                      style={{ minHeight: '4px' }}
                      title={`${bar.label}: ${bar.value}`}
                    ></motion.div>
                    <span className="text-white-50" style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>{bar.label}</span>
                  </div>
                ))}
             </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Indicators */}
      {insights.length > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-4 position-relative z-index-1">
          {insights.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`btn p-0 rounded-pill transition-all ${idx === currentSlide ? 'bg-primary' : 'bg-secondary'}`}
              style={{ width: idx === currentSlide ? '24px' : '8px', height: '8px', border: 'none' }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryAnalytics;
