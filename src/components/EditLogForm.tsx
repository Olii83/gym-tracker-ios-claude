import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Button from './Button';
import type { WorkoutLog } from '../interfaces';

interface EditLogFormProps {
  onClose: () => void;
  log: WorkoutLog;
}

const EditLogForm = ({ onClose, log }: EditLogFormProps) => {
  const { exercises, updateLog } = useData();
  const [selectedExercise, setSelectedExercise] = useState(log.exercise_id.toString());
  const [reps, setReps] = useState(log.reps.toString());
  const [weight, setWeight] = useState(log.weight.toString());
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExercise || !reps || !weight) {
      alert('Bitte fülle alle Felder aus.');
      return;
    }
    setLoading(true);
    const { error } = await updateLog({
      ...log,
      exercise_id: parseInt(selectedExercise),
      reps: parseInt(reps),
      weight: parseFloat(weight),
    });
    if (error) {
      alert(error.message);
    } else {
      onClose();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="exercise" className="block text-sm font-medium text-gray-300 mb-1">Übung</label>
        <select
          id="exercise"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
        >
          {exercises.map(ex => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="reps" className="block text-sm font-medium text-gray-300 mb-1">Wiederholungen</label>
          <input
            id="reps"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            type="number"
            placeholder='12'
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-1">Gewicht (kg)</label>
          <input
            id="weight"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            type="number"
            step="0.25"
            placeholder='60'
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
      </div>
      <div className="pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Wird aktualisiert...' : 'Log aktualisieren'}
        </Button>
      </div>
    </form>
  );
};

export default EditLogForm;
