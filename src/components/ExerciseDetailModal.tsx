import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Button from './Button';
import type { Exercise } from '../interfaces';
import { Dumbbell, Plus, Target, Settings } from 'lucide-react';

interface ExerciseDetailModalProps {
  exercise: Exercise;
  onClose: () => void;
}

const ExerciseDetailModal = ({ exercise, onClose }: ExerciseDetailModalProps) => {
  const { trainings } = useData();
  const [selectedTrainingId, setSelectedTrainingId] = useState<string>('');
  const [isAddingToTraining, setIsAddingToTraining] = useState(false);

  const handleAddToTraining = async () => {
    if (!selectedTrainingId) {
      alert('Bitte wählen Sie ein Training aus.');
      return;
    }

    setIsAddingToTraining(true);
    
    try {
      // Navigate to training detail page with exercise pre-selected
      window.location.href = `/trainings/${selectedTrainingId}?addExercise=${exercise.id}`;
    } catch (error) {
      console.error('Fehler beim Hinzufügen zur Training:', error);
      alert('Fehler beim Hinzufügen zur Training.');
    } finally {
      setIsAddingToTraining(false);
    }
  };

  const getMuscleGroupColor = (muscleGroup: string) => {
    const colors = {
      'Brust': 'bg-red-500',
      'Rücken': 'bg-blue-500',
      'Schultern': 'bg-yellow-500',
      'Bizeps': 'bg-green-500',
      'Trizeps': 'bg-purple-500',
      'Beine': 'bg-orange-500',
      'Waden': 'bg-pink-500',
      'Bauch': 'bg-indigo-500',
      'Ganzkörper': 'bg-gray-500',
      'Cardio': 'bg-cyan-500',
      'Beweglichkeit': 'bg-teal-500'
    };
    return colors[muscleGroup as keyof typeof colors] || 'bg-gray-500';
  };

  const getEquipmentIcon = (equipment: string) => {
    const icons = {
      'Langhantel': '🏋️',
      'Kurzhantel': '💪',
      'Kettlebell': '⚖️',
      'Maschine': '🤖',
      'Kabel': '🔗',
      'Körpergewicht': '🧍',
      'Equipment': '🛠️'
    };
    return icons[equipment as keyof typeof icons] || '🏃';
  };

  return (
    <div className="space-y-6">
      {/* Exercise Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full">
          <Dumbbell size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">{exercise.name}</h2>
        
        {/* Exercise Badges */}
        <div className="flex justify-center space-x-2 flex-wrap gap-2">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${getMuscleGroupColor(exercise.muscle_group)}`}>
            <Target size={14} className="mr-1" />
            {exercise.muscle_group}
          </div>
          {exercise.equipment && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-700 text-white text-sm font-medium">
              <span className="mr-1">{getEquipmentIcon(exercise.equipment)}</span>
              {exercise.equipment}
            </div>
          )}
          {exercise.user_id === null && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-medium">
              <Settings size={14} className="mr-1" />
              Standard
            </div>
          )}
        </div>
      </div>

      {/* Exercise Details */}
      <div className="bg-gray-800 rounded-lg p-4 space-y-3">
        <h3 className="text-lg font-semibold text-white mb-2">Übungsdetails</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Muskelgruppe:</span>
            <p className="text-white font-medium">{exercise.muscle_group}</p>
          </div>
          {exercise.equipment && (
            <div>
              <span className="text-gray-400">Equipment:</span>
              <p className="text-white font-medium">{exercise.equipment}</p>
            </div>
          )}
          <div>
            <span className="text-gray-400">Typ:</span>
            <p className="text-white font-medium">
              {exercise.user_id === null ? 'Standard-Übung' : 'Eigene Übung'}
            </p>
          </div>
        </div>
      </div>

      {/* Add to Training Section */}
      {trainings.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Plus size={20} className="mr-2 text-red-500" />
            Zu Training hinzufügen
          </h3>
          <div className="space-y-3">
            <select
              value={selectedTrainingId}
              onChange={(e) => setSelectedTrainingId(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="">Training auswählen...</option>
              {trainings.map(training => (
                <option key={training.id} value={training.id.toString()}>
                  {training.name}
                </option>
              ))}
            </select>
            <Button
              onClick={handleAddToTraining}
              disabled={!selectedTrainingId || isAddingToTraining}
              className="w-full"
            >
              {isAddingToTraining ? 'Wird hinzugefügt...' : 'Zu Training hinzufügen'}
            </Button>
          </div>
        </div>
      )}

      {/* No Trainings Message */}
      {trainings.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-gray-400 mb-2">
            <Plus size={32} className="mx-auto mb-2 opacity-50" />
            <p>Keine Trainings vorhanden</p>
            <p className="text-sm">Erstelle erst ein Training, um Übungen hinzuzufügen.</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button onClick={onClose} variant="secondary" className="flex-1">
          Schließen
        </Button>
      </div>
    </div>
  );
};

export default ExerciseDetailModal;