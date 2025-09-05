import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Button from './Button';
import type { Exercise } from '../interfaces';

const muscleGroups = ['Brust', 'Rücken', 'Beine', 'Schultern', 'Arme', 'Bauch'];

interface EditExerciseFormProps {
  exercise: Exercise;
  onClose: () => void;
}

const EditExerciseForm = ({ exercise, onClose }: EditExerciseFormProps) => {
  const { updateExercise } = useData();
  const [name, setName] = useState(exercise.name);
  const [muscleGroup, setMuscleGroup] = useState(exercise.muscle_group);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Bitte geben Sie einen Übungsnamen ein.');
      return;
    }
    setLoading(true);
    const { error } = await updateExercise({ 
      ...exercise, 
      name: name.trim(), 
      muscle_group: muscleGroup 
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
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
          Übungsname
        </label>
        <input
          id="name"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="muscleGroup" className="block text-sm font-medium text-gray-300 mb-1">
          Muskelgruppe
        </label>
        <select
          id="muscleGroup"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          value={muscleGroup}
          onChange={(e) => setMuscleGroup(e.target.value)}
        >
          {muscleGroups.map(group => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>
      </div>
      <div className="pt-2 flex gap-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Speichere...' : 'Speichern'}
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onClose} 
          disabled={loading}
          className="flex-1"
        >
          Abbrechen
        </Button>
      </div>
    </form>
  );
};

export default EditExerciseForm;