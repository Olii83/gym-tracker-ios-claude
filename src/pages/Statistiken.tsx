import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAccentColor } from '../hooks/useAccentColor';
import { Line } from 'react-chartjs-2';
import { Filter } from 'lucide-react';
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

  // Get exercises that have log data
  const exercisesWithData = useMemo(() => {
    const exerciseIdsWithLogs = [...new Set(logs.map(log => log.exercise_id))];
    return exercises.filter(ex => exerciseIdsWithLogs.includes(ex.id));
  }, [exercises, logs]);

  // Get muscle groups that have exercises with log data
  const muscleGroups = useMemo(() => 
    [...new Set(exercisesWithData.map(e => e.muscle_group))].sort(),
    [exercisesWithData]
  );

  // Filter exercises by selected muscle group (only show exercises with data)
  const filteredExercises = useMemo(() => {
    if (!selectedMuscleGroup) return exercisesWithData;
    return exercisesWithData.filter(ex => ex.muscle_group === selectedMuscleGroup);
  }, [exercisesWithData, selectedMuscleGroup]);

  const selectedExerciseLogs = logs.filter(
    log => log.exercise_id === parseInt(selectedExerciseId)
  ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // Calculate Personal Records (PRs)
  const personalRecords = useMemo(() => {
    if (selectedExerciseLogs.length === 0) return null;

    const maxWeight = Math.max(...selectedExerciseLogs.map(log => log.weight));
    const maxReps = Math.max(...selectedExerciseLogs.map(log => log.reps));
    const maxWeightLog = selectedExerciseLogs.find(log => log.weight === maxWeight);
    const maxRepsLog = selectedExerciseLogs.find(log => log.reps === maxReps);

    // Calculate volume (weight × reps) for each log
    const logsWithVolume = selectedExerciseLogs.map(log => ({
      ...log,
      volume: log.weight * log.reps
    }));
    const maxVolume = Math.max(...logsWithVolume.map(log => log.volume));
    const maxVolumeLog = logsWithVolume.find(log => log.volume === maxVolume);

    return {
      maxWeight: {
        weight: maxWeight,
        reps: maxWeightLog?.reps || 0,
        date: maxWeightLog?.created_at || ''
      },
      maxReps: {
        weight: maxRepsLog?.weight || 0,
        reps: maxReps,
        date: maxRepsLog?.created_at || ''
      },
      maxVolume: {
        weight: maxVolumeLog?.weight || 0,
        reps: maxVolumeLog?.reps || 0,
        volume: maxVolume,
        date: maxVolumeLog?.created_at || ''
      }
    };
  }, [selectedExerciseLogs]);

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
        <div className="space-y-6">
          {/* Personal Records Section */}
          {personalRecords && (
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Persönliche Bestleistungen (PRs)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Max Weight */}
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className={`font-medium mb-2 ${text}`}>Höchstgewicht</h3>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {personalRecords.maxWeight.weight}kg
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {personalRecords.maxWeight.reps} Wdh.
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {new Date(personalRecords.maxWeight.date).toLocaleDateString('de-DE')}
                  </div>
                </div>

                {/* Max Reps */}
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className={`font-medium mb-2 ${text}`}>Meiste Wiederholungen</h3>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {personalRecords.maxReps.reps} Wdh.
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {personalRecords.maxReps.weight}kg
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {new Date(personalRecords.maxReps.date).toLocaleDateString('de-DE')}
                  </div>
                </div>

                {/* Max Volume */}
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className={`font-medium mb-2 ${text}`}>Höchstes Volumen</h3>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {personalRecords.maxVolume.volume}kg
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {personalRecords.maxVolume.reps} × {personalRecords.maxVolume.weight}kg
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {new Date(personalRecords.maxVolume.date).toLocaleDateString('de-DE')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chart Section */}
          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
            <Line options={chartOptions} data={chartData} />
          </div>
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
