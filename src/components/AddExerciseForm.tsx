import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Button from './Button';

const muscleGroups = ['Brust', 'Rücken', 'Beine', 'Schultern', 'Arme', 'Bauch'];

interface AddExerciseFormProps {
  onClose: () => void;
}

const AddExerciseForm = ({ onClose }: AddExerciseFormProps) => {
  const { addExercise } = useData();
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState(muscleGroups[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter an exercise name.');
      return;
    }
    setLoading(true);
    const { error } = await addExercise({ name, muscle_group: muscleGroup });
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
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Exercise Name</label>
        <input
          id="name"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="muscleGroup" className="block text-sm font-medium text-gray-300 mb-1">Muscle Group</label>
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
      <div className="pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Exercise'}
        </Button>
      </div>
    </form>
  );
};

export default AddExerciseForm;
