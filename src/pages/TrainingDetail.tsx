import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import Button from '../components/Button';
import Modal from '../components/Modal';
import AddTrainingExerciseForm from '../components/AddTrainingExerciseForm';
import PlannedSetForm from '../components/PlannedSetForm';
import type { TrainingExercise, TrainingPlannedSet } from '../interfaces';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const TrainingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { trainings, trainingExercises, exercises, trainingPlannedSets, deleteTrainingExercise, deleteTrainingPlannedSet } = useData();
  const navigate = useNavigate();
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);
  const [isPlannedSetModalOpen, setIsPlannedSetModalOpen] = useState(false);
  const [selectedTrainingExercise, setSelectedTrainingExercise] = useState<TrainingExercise | null>(null);
  const [selectedPlannedSet, setSelectedPlannedSet] = useState<TrainingPlannedSet | null>(null);
  const [plannedSetNumber, setPlannedSetNumber] = useState(0);

  const training = trainings.find(t => t.id === parseInt(id || ''));

  if (!training) {
    return <div className="p-4 text-white">Training nicht gefunden.</div>;
  }

  const exercisesInTraining = trainingExercises.filter(te => te.training_id === training.id)
    .map(te => ({
      ...te,
      exercise_name: exercises.find(ex => ex.id === te.exercise_id)?.name || 'Unbekannte Übung',
      plannedSets: trainingPlannedSets.filter(tps => tps.training_exercise_id === te.id).sort((a, b) => a.set_number - b.set_number),
    })).sort((a, b) => a.order - b.order);

  const handleDeleteTrainingExercise = async (trainingExerciseId: number) => {
    if (window.confirm('Bist du sicher, dass du diese Übung aus dem Training entfernen möchtest?')) {
      await deleteTrainingExercise(trainingExerciseId);
    }
  };

  const handleDeletePlannedSet = async (plannedSetId: number) => {
    if (window.confirm('Bist du sicher, dass du diesen geplanten Satz löschen möchtest?')) {
      await deleteTrainingPlannedSet(plannedSetId);
    }
  };

  const handleAddPlannedSet = (trainingExercise: TrainingExercise) => {
    setSelectedTrainingExercise(trainingExercise);
    setPlannedSetNumber(trainingExercise.planned_sets + 1);
    setSelectedPlannedSet(null); // Ensure we are adding, not editing
    setIsPlannedSetModalOpen(true);
  };

  const handleEditPlannedSet = (trainingExercise: TrainingExercise, plannedSet: TrainingPlannedSet) => {
    setSelectedTrainingExercise(trainingExercise);
    setPlannedSetNumber(plannedSet.set_number);
    setSelectedPlannedSet(plannedSet);
    setIsPlannedSetModalOpen(true);
  };

  const handleFinishEditing = () => {
    navigate('/'); // Navigate back to the Trainings overview
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-white">{training.name}</h1>

      <Button onClick={() => setIsAddExerciseModalOpen(true)} variant="secondary">
        <div className="flex items-center justify-center space-x-2">
          <PlusCircle size={18} />
          <span>Übung hinzufügen</span>
        </div>
      </Button>

      <div className="space-y-4">
        {exercisesInTraining.length === 0 ? (
          <div className="text-center py-10 px-4 bg-gray-900 rounded-lg">
            <p className="text-gray-400">Noch keine Übungen in diesem Training.</p>
            <p className="text-gray-500 text-sm">Füge Übungen hinzu, um dein Training zu planen.</p>
          </div>
        ) : (
          exercisesInTraining.map((te) => (
            <div key={te.id} className="bg-gray-900 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg text-red-500">{te.exercise_name}</h2>
                <div className="flex space-x-2">
                  <button onClick={() => handleDeleteTrainingExercise(te.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                </div>
              </div>
              
              <p className="text-gray-400">Geplante Sätze: {te.planned_sets}</p>

              <div className="space-y-1">
                {te.plannedSets.map(ps => (
                  <div key={ps.id} className="flex justify-between items-center text-white py-1">
                    <span>Set {ps.set_number}: {ps.planned_reps || '?'} reps x {ps.planned_weight || '?'} {ps.planned_unit || 'kg'}</span>
                    <div className="flex space-x-2">
                      <button onClick={() => handleEditPlannedSet(te, ps)} className="text-gray-400 hover:text-red-500"><Edit size={18} /></button>
                      <button onClick={() => handleDeletePlannedSet(ps.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>

              {te.plannedSets.length < te.planned_sets && (
                <Button onClick={() => handleAddPlannedSet(te)} variant="secondary" className="w-full mt-3">
                  <div className="flex items-center justify-center space-x-2">
                    <PlusCircle size={18} />
                    <span>Add Set {te.plannedSets.length + 1}</span>
                  </div>
                </Button>
              )}
            </div>
          ))
        )}
      </div>

      <div className="pt-4">
        <Button onClick={handleFinishEditing}>Fertig</Button>
      </div>

      <Modal isOpen={isAddExerciseModalOpen} onClose={() => setIsAddExerciseModalOpen(false)} title="Übung zum Training hinzufügen">
        <AddTrainingExerciseForm trainingId={training.id} onClose={() => setIsAddExerciseModalOpen(false)} />
      </Modal>

      {selectedTrainingExercise && (
        <Modal isOpen={isPlannedSetModalOpen} onClose={() => setIsPlannedSetModalOpen(false)} title={selectedPlannedSet ? 'Edit Planned Set' : `Add Planned Set ${plannedSetNumber}`}>
          <PlannedSetForm 
            trainingExerciseId={selectedTrainingExercise.id} 
            setNumber={plannedSetNumber}
            initialData={selectedPlannedSet || undefined}
            onClose={() => setIsPlannedSetModalOpen(false)} 
          />
        </Modal>
      )}
    </div>
  );
};

export default TrainingDetail;
