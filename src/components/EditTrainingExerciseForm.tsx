import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import Button from './Button';
import type { TrainingExercise } from '../interfaces';

interface EditTrainingExerciseFormProps {
  trainingExercise: TrainingExercise;
  onClose: () => void;
}

const EditTrainingExerciseForm = ({ trainingExercise, onClose }: EditTrainingExerciseFormProps) => {
  const { exercises, updateTrainingExercise, addTrainingPlannedSet } = useData();
  const [plannedSetsCount, setPlannedSetsCount] = useState<number | ''>(trainingExercise.planned_sets);
  const [loading, setLoading] = useState(false);

  const exercise = exercises.find(ex => ex.id === trainingExercise.exercise_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validPlannedSetsCount = plannedSetsCount === '' ? trainingExercise.planned_sets : plannedSetsCount;
    
    if (validPlannedSetsCount < 1) {
      alert('Die Anzahl der geplanten Sätze muss mindestens 1 sein.');
      return;
    }

    setLoading(true);

    try {
      // Update the training exercise with new planned sets count (only send database fields)
      const updatedTrainingExercise = {
        id: trainingExercise.id,
        training_id: trainingExercise.training_id,
        exercise_id: trainingExercise.exercise_id,
        planned_sets: validPlannedSetsCount,
        order: trainingExercise.order
      };

      const { error: updateError } = await updateTrainingExercise(updatedTrainingExercise);
      if (updateError) {
        throw new Error(updateError.message);
      }

      // If we increased the planned sets count, add empty planned sets for the new slots
      const currentPlannedSetsCount = trainingExercise.planned_sets;
      if (validPlannedSetsCount > currentPlannedSetsCount) {
        const newSetsToAdd = validPlannedSetsCount - currentPlannedSetsCount;
        
        for (let i = 0; i < newSetsToAdd; i++) {
          const newPlannedSet = {
            training_exercise_id: trainingExercise.id,
            set_number: currentPlannedSetsCount + i + 1,
            planned_reps: null,
            planned_weight: null,
            planned_unit: 'kg' as const,
          };

          const { error: addError } = await addTrainingPlannedSet(newPlannedSet);
          if (addError) {
            console.error('Fehler beim Hinzufügen des geplanten Satzes:', addError);
          }
        }
      }

      onClose();
    } catch (error: any) {
      alert(error.message || 'Fehler beim Bearbeiten der Übung.');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {exercise?.name || 'Übung bearbeiten'}
        </h3>
        {exercise && (
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {exercise.muscle_group} {exercise.equipment && `• ${exercise.equipment}`}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="plannedSets" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Anzahl geplanter Sätze
        </label>
        <input
          type="number"
          id="plannedSets"
          min="1"
          max="20"
          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          value={plannedSetsCount}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '') {
              setPlannedSetsCount('');
            } else {
              const numValue = parseInt(value);
              if (!isNaN(numValue) && numValue >= 1 && numValue <= 20) {
                setPlannedSetsCount(numValue);
              }
            }
          }}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {plannedSetsCount > trainingExercise.planned_sets ? 
            `${plannedSetsCount - trainingExercise.planned_sets} neue Sätze werden hinzugefügt.` :
            plannedSetsCount < trainingExercise.planned_sets ?
            `${trainingExercise.planned_sets - plannedSetsCount} Sätze werden entfernt. (Bereits geplante Sätze bleiben erhalten)` :
            'Keine Änderung der Satz-Anzahl.'
          }
        </p>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
          Abbrechen
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Wird gespeichert...' : 'Änderungen speichern'}
        </Button>
      </div>
    </form>
  );
};

export default EditTrainingExerciseForm;