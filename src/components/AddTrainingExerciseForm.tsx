import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Button from './Button';
import type { TrainingPlannedSet } from '../interfaces';
import { PlusCircle, Trash2 } from 'lucide-react';

interface AddTrainingExerciseFormProps {
  trainingId: number;
  onClose: () => void;
}

const AddTrainingExerciseForm = ({ trainingId, onClose }: AddTrainingExerciseFormProps) => {
  const { exercises, trainingExercises, addTrainingExercise } = useData();
  const [selectedExerciseId, setSelectedExerciseId] = useState(exercises[0]?.id.toString() || '');
  const [plannedSets, setPlannedSets] = useState<Omit<TrainingPlannedSet, 'id' | 'created_at' | 'training_exercise_id'>[]>(
    [{ set_number: 1, planned_reps: null, planned_weight: null, planned_unit: 'kg' }]
  );
  const [loading, setLoading] = useState(false);

  const handleAddSet = () => {
    setPlannedSets(prev => [...prev, { set_number: prev.length + 1, planned_reps: null, planned_weight: null, planned_unit: 'kg' }]);
  };

  const handleRemoveSet = (index: number) => {
    setPlannedSets(prev => prev.filter((_, i) => i !== index).map((set, i) => ({ ...set, set_number: i + 1 })));
  };

  const handleSetChange = (index: number, field: keyof Omit<TrainingPlannedSet, 'id' | 'created_at' | 'training_exercise_id' | 'set_number'>, value: any) => {
    setPlannedSets(prev => prev.map((set, i) => (i === index ? { ...set, [field]: value } : set)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExerciseId) {
      alert('Bitte wähle eine Übung aus.');
      return;
    }

    // Determine the order for the new exercise
    const currentTrainingExercises = trainingExercises.filter(te => te.training_id === trainingId);
    const order = currentTrainingExercises.length > 0 
      ? Math.max(...currentTrainingExercises.map(te => te.order)) + 1 
      : 0;

    setLoading(true);
    const { error } = await addTrainingExercise(
      {
        training_id: trainingId,
        exercise_id: parseInt(selectedExerciseId),
        planned_sets: plannedSets.length,
        order: order,
      },
      plannedSets.map(ps => ({
        training_exercise_id: 0, // Will be set by the backend
        set_number: ps.set_number,
        planned_reps: ps.planned_reps,
        planned_weight: ps.planned_weight,
        planned_unit: ps.planned_unit,
      }))
    );
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
          value={selectedExerciseId}
          onChange={(e) => setSelectedExerciseId(e.target.value)}
        >
          {exercises.map(ex => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Geplante Sätze</h3>
        {plannedSets.map((set, index) => (
          <div key={index} className="bg-gray-800 p-3 rounded-lg flex items-center space-x-2">
            <span className="text-gray-300 font-medium">Set {set.set_number}</span>
            <input
              type="number"
              placeholder="Wdh."
              className="w-1/4 bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
              value={set.planned_reps || ''}
              onChange={(e) => handleSetChange(index, 'planned_reps', parseInt(e.target.value) || null)}
            />
            <input
              type="number"
              step="0.25"
              placeholder="Gewicht"
              className="w-1/4 bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
              value={set.planned_weight || ''}
              onChange={(e) => handleSetChange(index, 'planned_weight', parseFloat(e.target.value) || null)}
            />
            <select
              className="w-1/6 bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
              value={set.planned_unit || 'kg'}
              onChange={(e) => handleSetChange(index, 'planned_unit', e.target.value as 'kg' | 'lb')}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
            {plannedSets.length > 1 && (
              <button type="button" onClick={() => handleRemoveSet(index)} className="text-gray-400 hover:text-red-500">
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
        <Button type="button" onClick={handleAddSet} variant="secondary" className="w-full mt-3">
          <div className="flex items-center justify-center space-x-2">
            <PlusCircle size={18} />
            <span>Satz hinzufügen</span>
          </div>
        </Button>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Wird hinzugefügt...' : 'Übung zu Training hinzufügen'}
        </Button>
      </div>
    </form>
  );
};

export default AddTrainingExerciseForm;