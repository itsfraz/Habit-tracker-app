
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HabitCompletionChart = ({ habit }) => {
  const data = {
    labels: [],
    datasets: [
      {
        label: 'Completion',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  if (habit.history && habit.history.length > 0) {
    const dailyCounts = {};
    habit.history.forEach((entry) => {
      const date = new Date(entry.date);
      const formattedDate = date.toISOString().split('T')[0];
      dailyCounts[formattedDate] = (dailyCounts[formattedDate] || 0) + 1;
    });

    const sortedDates = Object.keys(dailyCounts).sort();
    data.labels = sortedDates;
    data.datasets[0].data = sortedDates.map((date) => dailyCounts[date]);
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${habit.name} Completion Over Time`,
      },
    },
  };

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <h5 className="card-title text-primary mb-3">{habit.name} Completion Over Time</h5>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default HabitCompletionChart;
