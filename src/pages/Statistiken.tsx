import { useState } from 'react';
import { useData } from '../contexts/DataContext';
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

const Statistiken = () => {
  const { exercises, logs } = useData();
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');

  const selectedExerciseLogs = logs.filter(
    log => log.exercise_id === parseInt(selectedExerciseId)
  ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const chartData = {
    labels: selectedExerciseLogs.map(log => new Date(log.created_at).toLocaleDateString()),
    datasets: [
      {
        label: 'Weight (kg)',
        data: selectedExerciseLogs.map(log => log.weight),
        fill: false,
        borderColor: 'rgb(239, 68, 68)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Progress for ${exercises.find(e => e.id === parseInt(selectedExerciseId))?.name || ''}`,
        color: '#fff',
      },
    },
    scales: {
      y: {
        ticks: { color: '#fff' },
        grid: { color: '#444' }
      },
      x: {
        ticks: { color: '#fff' },
        grid: { color: '#444' }
      }
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-white">Statistiken</h1>
      
      <select
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
        value={selectedExerciseId}
        onChange={(e) => setSelectedExerciseId(e.target.value)}
      >
        <option value="">Select an exercise</option>
        {exercises.map(ex => (
          <option key={ex.id} value={ex.id}>{ex.name}</option>
        ))}
      </select>

      {selectedExerciseId && selectedExerciseLogs.length > 0 ? (
        <div className="bg-gray-900 rounded-lg p-4">
          <Line options={chartOptions} data={chartData} />
        </div>
      ) : (
        <div className="text-center py-20 px-4 bg-gray-900 rounded-lg">
          <p className="text-gray-400">Select an exercise to see your progress.</p>
        </div>
      )}
    </div>
  );
};

export default Statistiken;
