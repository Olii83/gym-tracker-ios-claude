import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAccentColor } from '../hooks/useAccentColor';
import Button from '../components/Button';
import Modal from '../components/Modal';
import AddTrainingExerciseForm from '../components/AddTrainingExerciseForm';
import { Check, Plus, PlusCircle } from 'lucide-react';
import type { WorkoutLog } from '../interfaces';

interface CompletedSet {
  reps: number;
  weight: number;
  completed: boolean;
}

interface ExtraSetData {
  id: string;
  setNumber: number;
  reps: string;
  weight: string;
  completed: boolean;
}

const TrackingPage = () => {
  const { id } = useParams<{ id: string }>();
  const { trainings, trainingExercises, exercises, trainingPlannedSets, addLog } = useData();
  const { text } = useAccentColor();
  const navigate = useNavigate();

  // Always call hooks first
  const [, setCurrentLogs] = useState<Record<number, WorkoutLog[]>>({});
  const [completedSets, setCompletedSets] = useState<Record<string, CompletedSet>>({});
  const [extraSets, setExtraSets] = useState<Record<number, ExtraSetData[]>>({});
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);

  // Early returns after all hooks
  const training = trainings.find(t => t.id === parseInt(id || ''));
  if (!training) {
    return <div className="p-4 text-white">Training not found.</div>;
  }

  const exercisesInTraining = trainingExercises
    .filter(te => te.training_id === training.id)
    .map(te => ({
      ...te,
      exercise_name: exercises.find(ex => ex.id === te.exercise_id)?.name || 'Unknown Exercise',
      plannedSets: trainingPlannedSets
        .filter(tps => tps.training_exercise_id === te.id)
        .sort((a, b) => a.set_number - b.set_number),
    }))
    .sort((a, b) => a.order - b.order);

  const getSetKey = (trainingExerciseId: number, setId: number | string, isExtra: boolean = false) => {
    return `${trainingExerciseId}-${setId}-${isExtra ? 'extra' : 'planned'}`;
  };

  const toggleSetCompletion = useCallback(async (
    trainingExerciseId: number, 
    setId: number | string, 
    _setNumber: number, 
    isExtra: boolean = false
  ) => {
    const setKey = getSetKey(trainingExerciseId, setId, isExtra);
    const currentSet = completedSets[setKey];
    
    if (!currentSet?.completed) {
      // Get input values
      const repsInput = document.getElementById(`reps-${setKey}`) as HTMLInputElement;
      const weightInput = document.getElementById(`weight-${setKey}`) as HTMLInputElement;
      
      const reps = parseInt(repsInput?.value || '0');
      const weight = parseFloat(weightInput?.value || '0');
      
      if (!reps || !weight) {
        alert('Bitte geben Sie Wiederholungen und Gewicht ein.');
        return;
      }

      // Log to database
      const exerciseId = exercisesInTraining.find(te => te.id === trainingExerciseId)?.exercise_id;
      if (!exerciseId) return;

      const newLog: Omit<WorkoutLog, 'id' | 'user_id' | 'created_at'> = {
        exercise_id: exerciseId,
        reps,
        weight,
      };

      const { data, error } = await addLog(newLog);
      if (error) {
        alert(error.message);
        return;
      }

      // Update state
      setCompletedSets(prev => ({
        ...prev,
        [setKey]: { reps, weight, completed: true }
      }));

      if (data) {
        setCurrentLogs(prev => ({
          ...prev,
          [trainingExerciseId]: [...(prev[trainingExerciseId] || []), data[0]],
        }));
      }
    } else {
      // Mark as uncompleted
      setCompletedSets(prev => ({
        ...prev,
        [setKey]: { ...currentSet, completed: false }
      }));
    }
  }, [completedSets, exercisesInTraining, addLog]);

  const addExtraSet = useCallback((trainingExerciseId: number) => {
    setExtraSets(prev => {
      const currentExtraSets = prev[trainingExerciseId] || [];
      const newSetNumber = (exercisesInTraining.find(te => te.id === trainingExerciseId)?.plannedSets.length || 0) + currentExtraSets.length + 1;
      const newSet: ExtraSetData = {
        id: `extra-${trainingExerciseId}-${Date.now()}`,
        setNumber: newSetNumber,
        reps: '',
        weight: '',
        completed: false
      };
      
      return {
        ...prev,
        [trainingExerciseId]: [...currentExtraSets, newSet]
      };
    });
  }, [exercisesInTraining]);

  const renderSet = (
    trainingExerciseId: number,
    setId: number | string,
    setNumber: number,
    plannedReps: number | null,
    plannedWeight: number | null,
    plannedUnit: string | null,
    isExtra: boolean = false
  ) => {
    const setKey = getSetKey(trainingExerciseId, setId, isExtra);
    const isCompleted = completedSets[setKey]?.completed || false;
    const completedData = completedSets[setKey];
    const inputId = `${setKey}`;

    return (
      <div key={setKey} className="space-y-2">
        <div className="flex justify-between items-center text-white">
          <span className={isCompleted ? 'line-through text-gray-500' : ''}>
            Satz {setNumber}: {plannedReps || '?'} Wdh. × {plannedWeight || '?'} {plannedUnit || 'kg'} 
            {isExtra ? ' (Extra)' : ' (Geplant)'}
          </span>
          {isCompleted && completedData && (
            <span className="text-green-500 text-sm">
              ✓ {completedData.reps} Wdh. × {completedData.weight} kg
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Wiederholungen"
            defaultValue={plannedReps || ''}
            disabled={isCompleted}
            className={`w-1/3 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-red-600 ${isCompleted ? 'opacity-50' : ''}`}
            id={`reps-${inputId}`}
          />
          <input
            type="number"
            step="0.25"
            placeholder="Gewicht"
            defaultValue={plannedWeight || ''}
            disabled={isCompleted}
            className={`w-1/3 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-red-600 ${isCompleted ? 'opacity-50' : ''}`}
            id={`weight-${inputId}`}
          />
          <button
            onClick={() => toggleSetCompletion(trainingExerciseId, setId, setNumber, isExtra)}
            className={`flex items-center justify-center w-10 h-10 rounded-lg border-2 transition-all ${
              isCompleted 
                ? 'bg-green-600 border-green-600 text-white' 
                : 'border-gray-600 text-gray-400 hover:border-green-500 hover:text-green-500'
            }`}
            title={isCompleted ? 'Satz als nicht erledigt markieren' : 'Satz als erledigt markieren'}
          >
            <Check size={20} />
          </button>
        </div>
      </div>
    );
  };

  const handleFinishTraining = () => {
    navigate('/');
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Tracking: {training.name}</h1>
        <button
          onClick={() => setIsAddExerciseModalOpen(true)}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
          title="Spontan Übung hinzufügen"
        >
          <PlusCircle size={18} />
          <span>Übung hinzufügen</span>
        </button>
      </div>

      {exercisesInTraining.length === 0 ? (
        <div className="text-center py-10 px-4 bg-gray-900 rounded-lg">
          <p className="text-gray-400">Noch keine Übungen in diesem Training.</p>
          <p className="text-gray-500 text-sm">Füge Übungen hinzu, um dein Training zu starten.</p>
        </div>
      ) : (
        exercisesInTraining.map((te) => (
          <div key={te.id} className="bg-gray-900 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className={`font-bold text-lg ${text}`}>{te.exercise_name}</h2>
              <button
                onClick={() => addExtraSet(te.id)}
                className="flex items-center space-x-1 text-blue-500 hover:text-blue-400 text-sm"
                title="Weiteren Satz hinzufügen"
              >
                <Plus size={16} />
                <span>Satz hinzufügen</span>
              </button>
            </div>
            
            {/* Geplante Sätze */}
            {te.plannedSets.map((ps) => 
              renderSet(te.id, ps.id, ps.set_number, ps.planned_reps, ps.planned_weight, ps.planned_unit, false)
            )}
            
            {/* Extra Sätze */}
            {(extraSets[te.id] || []).map((extraSet) => 
              renderSet(te.id, extraSet.id, extraSet.setNumber, null, null, 'kg', true)
            )}
          </div>
        ))
      )}

      <div className="pt-4">
        <Button onClick={handleFinishTraining}>Fertig</Button>
      </div>

      {/* Modal für Übung hinzufügen */}
      <Modal 
        isOpen={isAddExerciseModalOpen} 
        onClose={() => setIsAddExerciseModalOpen(false)} 
        title="Übung zum Training hinzufügen"
      >
        <AddTrainingExerciseForm 
          trainingId={training.id} 
          onClose={() => setIsAddExerciseModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default TrackingPage;