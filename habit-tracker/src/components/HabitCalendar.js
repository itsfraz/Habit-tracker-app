
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const HabitCalendar = ({ habit }) => {
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ).getTime();
      const historyDates = habit.history.map((entry) => {
        const d = new Date(entry.date);
        return new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate()
        ).getTime();
      });

      if (historyDates.includes(formattedDate)) {
        return 'bg-success text-white';
      }
    }
    return '';
  };

  return (
    <div className="card card-body mt-3 shadow-sm">
      <Calendar tileClassName={tileClassName} />
    </div>
  );
};

export default HabitCalendar;
