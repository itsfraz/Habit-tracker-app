
import React from 'react';
import Habit from './Habit';

const HabitList = ({ habits, deleteHabit, trackHabit, categories, addNote, setReminder }) => {
  const habitsByCategory = categories.map((category) => ({
    ...category,
    habits: habits.filter((habit) => habit.category === category.name),
  }));

  return (
    <div className="habit-list mt-4">
      {habitsByCategory.map((category) => (
        <div key={category.id} className="mb-4">
          <h3 className="text-primary mb-3">{category.name}</h3>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {category.habits.map((habit) => (
              <div key={habit._id} className="col">
                <Habit
                  habit={habit}
                  deleteHabit={deleteHabit}
                  trackHabit={trackHabit}
                  addNote={addNote}
                  categories={categories}
                  setReminder={setReminder}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HabitList;
