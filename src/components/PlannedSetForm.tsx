import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Button from './Button';
import type { TrainingPlannedSet } from '../interfaces';

interface PlannedSetFormProps {
  trainingExerciseId: number;
  setNumber: number;
  initialData?: TrainingPlannedSet;
  onClose: () => void;
}

const PlannedSetForm = ({ trainingExerciseId, setNumber, initialData, onClose }: PlannedSetFormProps) => {
  const { addTrainingPlannedSet, updateTrainingPlannedSet } = useData();
  const [plannedReps, setPlannedReps] = useState(initialData?.planned_reps?.toString() || '');
  const [plannedWeight, setPlannedWeight] = useState(initialData?.planned_weight?.toString() || '');
  const [plannedUnit, setPlannedUnit] = useState(initialData?.planned_unit || 'kg');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dataToSave = {
      training_exercise_id: trainingExerciseId,
      set_number: setNumber,
      planned_reps: plannedReps ? parseInt(plannedReps) : null,
      planned_weight: plannedWeight ? parseFloat(plannedWeight) : null,
      planned_unit: plannedUnit as 'kg' | 'lb',
    };

    let error;
    if (initialData) {
      // Update existing planned set
      ({ error } = await updateTrainingPlannedSet({ ...initialData, ...dataToSave }));
    } else {
      // Add new planned set
      ({ error } = await addTrainingPlannedSet(dataToSave));
    }

    if (error) {
      alert(error.message);
    } else {
      onClose();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Set {setNumber}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="plannedReps" className="block text-sm font-medium text-gray-300 mb-1">Planned Reps</label>
          <input
            id="plannedReps"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            type="number"
            value={plannedReps}
            onChange={(e) => setPlannedReps(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="plannedWeight" className="block text-sm font-medium text-gray-300 mb-1">Planned Weight</label>
          <input
            id="plannedWeight"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            type="number"
            step="0.25"
            value={plannedWeight}
            onChange={(e) => setPlannedWeight(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label htmlFor="plannedUnit" className="block text-sm font-medium text-gray-300 mb-1">Unit</label>
        <select
          id="plannedUnit"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          value={plannedUnit}
          onChange={(e) => setPlannedUnit(e.target.value as 'kg' | 'lb')}
        >
          <option value="kg">kg</option>
          <option value="lb">lb</option>
        </select>
      </div>
      <div className="pt-2">
        <Button type="submit" disabled={loading}>
          {initialData ? 'Update Planned Set' : 'Add Planned Set'}
        </Button>
      </div>
    </form>
  );
};

export default PlannedSetForm;
