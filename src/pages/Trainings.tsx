import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Button from '../components/Button';
import Modal from '../components/Modal';
import AddTrainingForm from '../components/AddTrainingForm';
import type { Training } from '../interfaces';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

const Trainings = () => {
  const { trainings, deleteTraining } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleDeleteTraining = async (trainingId: number) => {
    if (window.confirm('Bist du sicher, dass du dieses Training löschen möchtest?')) {
      await deleteTraining(trainingId);
    }
  };

  const handleAddTrainingSuccess = (trainingId: number) => {
    setIsAddModalOpen(false);
    navigate(`/trainings/${trainingId}`);
  };

  return (
    <div className="p-4 space-y-6">
      <Button onClick={() => setIsAddModalOpen(true)}>Neues Training erstellen</Button>

      <div className="space-y-4">
        {trainings.length === 0 ? (
          <div className="text-center py-10 px-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">Noch keine Trainings erstellt.</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">Erstelle ein neues Training, um zu starten.</p>
          </div>
        ) : (
          trainings.map((training: Training) => (
            <div key={training.id} className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3 flex justify-between items-center">
              <Link to={`/trainings/${training.id}`} className="font-medium text-base text-gray-900 dark:text-white hover:text-red-500">
                {training.name}
              </Link>
              <div className="flex space-x-2 items-center">
                <Link to={`/track/${training.id}`}>
                  <Button variant="secondary" className="px-2 py-1 text-xs">Start</Button>
                </Link>
                <button onClick={() => handleDeleteTraining(training.id)} className="text-gray-600 dark:text-gray-400 hover:text-red-500 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Neues Training erstellen">
        <AddTrainingForm onClose={() => setIsAddModalOpen(false)} onSuccess={handleAddTrainingSuccess} />
      </Modal>
    </div>
  );
};

export default Trainings;
