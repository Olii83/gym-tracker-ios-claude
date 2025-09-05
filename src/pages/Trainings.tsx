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
    if (window.confirm('Are you sure you want to delete this training?')) {
      await deleteTraining(trainingId);
    }
  };

  const handleAddTrainingSuccess = (trainingId: number) => {
    setIsAddModalOpen(false);
    navigate(`/trainings/${trainingId}`);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Trainings</h1>
      </div>

      <Button onClick={() => setIsAddModalOpen(true)}>Neues Training erstellen</Button>

      <div className="space-y-4">
        {trainings.length === 0 ? (
          <div className="text-center py-10 px-4 bg-gray-900 rounded-lg">
            <p className="text-gray-400">Noch keine Trainings erstellt.</p>
            <p className="text-gray-500 text-sm">Erstelle ein neues Training, um zu starten.</p>
          </div>
        ) : (
          trainings.map((training: Training) => (
            <div key={training.id} className="bg-gray-900 rounded-lg p-4 flex justify-between items-center">
              <Link to={`/trainings/${training.id}`} className="font-bold text-lg text-white hover:text-red-500">
                {training.name}
              </Link>
              <div className="flex space-x-2">
                <Link to={`/track/${training.id}`}>
                  <Button variant="secondary" className="px-3 py-1 text-sm">Start Training</Button>
                </Link>
                <button onClick={() => handleDeleteTraining(training.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
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
