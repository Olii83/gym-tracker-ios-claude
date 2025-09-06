import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Button from './Button';

interface AddTrainingFormProps {
  onClose: () => void;
  onSuccess?: (trainingId: number) => void; // New prop
}

const AddTrainingForm = ({ onClose, onSuccess }: AddTrainingFormProps) => {
  const { addTraining } = useData();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Bitte gib einen Trainingsnamen ein.');
      return;
    }
    setLoading(true);
    const { data, error } = await addTraining({ name });
    if (error) {
      alert(error.message);
    } else if (data) {
      onClose();
      if (onSuccess) {
        onSuccess(data[0].id); // Pass the new training ID
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Trainingsname</label>
        <input
          id="name"
          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Wird hinzugefügt...' : 'Training hinzufügen'}
        </Button>
      </div>
    </form>
  );
};

export default AddTrainingForm;
