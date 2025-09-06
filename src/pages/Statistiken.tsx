import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAccentColor } from '../hooks/useAccentColor';
import { Line } from 'react-chartjs-2';
import { Filter, TrendingUp } from 'lucide-react';
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
  const { text } = useAccentColor();
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('');

  // Get all unique muscle groups
  const muscleGroups = useMemo(() => 
    [...new Set(exercises.map(e => e.muscle_group))].sort(),
    [exercises]
  );

  // Filter exercises by selected muscle group
  const filteredExercises = useMemo(() => {
    if (!selectedMuscleGroup) return exercises;
    return exercises.filter(ex => ex.muscle_group === selectedMuscleGroup);
  }, [exercises, selectedMuscleGroup]);

  const selectedExerciseLogs = logs.filter(
    log => log.exercise_id === parseInt(selectedExerciseId)
  ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // Reset exercise selection when muscle group changes
  const handleMuscleGroupChange = (muscleGroup: string) => {
    setSelectedMuscleGroup(muscleGroup);
    setSelectedExerciseId(''); // Reset exercise selection
  };

  const chartData = {
    labels: selectedExerciseLogs.map(log => new Date(log.created_at).toLocaleDateString()),
    datasets: [
      {
        label: 'Gewicht (kg)',
        data: selectedExerciseLogs.map(log => log.weight),
        fill: false,
        borderColor: 'rgb(239, 68, 68)', // Keep red for chart visibility
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
        text: `Fortschritt für ${exercises.find(e => e.id === parseInt(selectedExerciseId))?.name || ''}`,
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
      <div className="flex items-center space-x-3">
        <TrendingUp className={text} size={28} />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Statistiken</h1>
      </div>
      
      {/* Filter Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Muscle Group Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Muskelgruppe
            </label>
            <select
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              value={selectedMuscleGroup}
              onChange={(e) => handleMuscleGroupChange(e.target.value)}
            >
              <option value="">Alle Muskelgruppen</option>
              {muscleGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          {/* Exercise Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Übung
            </label>
            <select
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              value={selectedExerciseId}
              onChange={(e) => setSelectedExerciseId(e.target.value)}
            >
              <option value="">Übung auswählen</option>
              {filteredExercises.map(ex => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
            {selectedMuscleGroup && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {filteredExercises.length} Übung(en) in {selectedMuscleGroup}
              </p>
            )}
          </div>
        </div>

        {/* Clear Filters Button */}
        {(selectedMuscleGroup || selectedExerciseId) && (
          <button
            onClick={() => {
              setSelectedMuscleGroup('');
              setSelectedExerciseId('');
            }}
            className="px-3 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors"
          >
            Filter zurücksetzen
          </button>
        )}
      </div>

      {selectedExerciseId && selectedExerciseLogs.length > 0 ? (
        <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
          <Line options={chartOptions} data={chartData} />
        </div>
      ) : (
        <div className="text-center py-20 px-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">Wähle eine Übung aus, um deinen Fortschritt zu sehen.</p>
        </div>
      )}
    </div>
  );
};

export default Statistiken;
