import { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAccentColor } from '../hooks/useAccentColor';
import Button from '../components/Button';
import Modal from '../components/Modal';
import AddTrainingExerciseForm from '../components/AddTrainingExerciseForm';
import EditTrainingExerciseForm from '../components/EditTrainingExerciseForm';
import { Check, Plus, PlusCircle, GripVertical, ChevronDown, ChevronRight, Trash2, Edit } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
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
  const { trainings, trainingExercises, exercises, trainingPlannedSets, addLog, updateTrainingExercise, deleteTrainingExercise } = useData();
  const { text } = useAccentColor();
  const navigate = useNavigate();

  // Always call hooks first
  const [, setCurrentLogs] = useState<Record<number, WorkoutLog[]>>({});
  const [completedSets, setCompletedSets] = useState<Record<string, CompletedSet>>({});
  const [extraSets, setExtraSets] = useState<Record<number, ExtraSetData[]>>({});
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);
  const [expandedExercises, setExpandedExercises] = useState<Set<number>>(new Set());
  const [localExerciseOrder, setLocalExerciseOrder] = useState<any[]>([]);
  const [isEditTrainingExerciseModalOpen, setIsEditTrainingExerciseModalOpen] = useState(false);
  const [editingTrainingExercise, setEditingTrainingExercise] = useState<any>(null);

  // Early returns after all hooks
  const training = trainings.find(t => t.id === parseInt(id || ''));
  if (!training) {
    return <div className="p-4 text-white">Training not found.</div>;
  }

  // Initialize exercisesInTraining with proper ordering
  const exercisesInTraining = useMemo(() => {
    const baseExercises = trainingExercises.filter(te => te.training_id === training.id)
      .map(te => ({
        ...te,
        exercise_name: exercises.find(ex => ex.id === te.exercise_id)?.name || 'Unbekannte Übung',
        plannedSets: trainingPlannedSets.filter(tps => tps.training_exercise_id === te.id).sort((a, b) => a.set_number - b.set_number),
      })).sort((a, b) => a.order - b.order);

    // Use local order if available, otherwise use base exercises
    if (localExerciseOrder.length > 0 && localExerciseOrder.length === baseExercises.length) {
      return localExerciseOrder;
    }
    return baseExercises;
  }, [trainingExercises, training.id, exercises, trainingPlannedSets, localExerciseOrder]);

  // Update local order when data changes
  useEffect(() => {
    if (training?.id) {
      const baseExercises = trainingExercises.filter(te => te.training_id === training.id)
        .map(te => ({
          ...te,
          exercise_name: exercises.find(ex => ex.id === te.exercise_id)?.name || 'Unbekannte Übung',
          plannedSets: trainingPlannedSets.filter(tps => tps.training_exercise_id === te.id).sort((a, b) => a.set_number - b.set_number),
        })).sort((a, b) => a.order - b.order);
      
      setLocalExerciseOrder(baseExercises);
    }
  }, [trainingExercises, training?.id, exercises, trainingPlannedSets]);

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

  const removeExtraSet = useCallback((trainingExerciseId: number, setId: string) => {
    if (!window.confirm('Möchtest du diesen Extra-Satz wirklich löschen?')) {
      return;
    }
    
    setExtraSets(prev => {
      const currentSets = prev[trainingExerciseId] || [];
      const updatedSets = currentSets.filter(set => set.id !== setId);
      
      // Renumber the remaining sets
      const plannedSetsCount = exercisesInTraining.find(te => te.id === trainingExerciseId)?.plannedSets.length || 0;
      const renumberedSets = updatedSets.map((set, index) => ({
        ...set,
        setNumber: plannedSetsCount + index + 1
      }));
      
      return {
        ...prev,
        [trainingExerciseId]: renumberedSets
      };
    });
    
    // Remove from completed sets if it was completed
    setCompletedSets(prev => {
      const setKey = getSetKey(trainingExerciseId, setId, true);
      const newCompleted = { ...prev };
      delete newCompleted[setKey];
      return newCompleted;
    });
  }, [exercisesInTraining]);

  const handleDeleteTrainingExercise = async (trainingExerciseId: number, exerciseName: string) => {
    if (window.confirm(`Möchtest du die Übung "${exerciseName}" wirklich aus dem Training entfernen?`)) {
      await deleteTrainingExercise(trainingExerciseId);
      // Clean up any extra sets and completed sets for this exercise
      setExtraSets(prev => {
        const newSets = { ...prev };
        delete newSets[trainingExerciseId];
        return newSets;
      });
      setCompletedSets(prev => {
        const newCompleted = { ...prev };
        Object.keys(newCompleted).forEach(key => {
          if (key.startsWith(`${trainingExerciseId}-`)) {
            delete newCompleted[key];
          }
        });
        return newCompleted;
      });
    }
  };

  const handleEditTrainingExercise = (trainingExercise: any) => {
    setEditingTrainingExercise(trainingExercise);
    setIsEditTrainingExerciseModalOpen(true);
  };

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
          <div className="flex items-center space-x-2">
            {isCompleted && completedData && (
              <span className="text-green-500 text-sm">
                ✓ {completedData.reps} Wdh. × {completedData.weight} kg
              </span>
            )}
            {isExtra && (
              <button
                onClick={() => removeExtraSet(trainingExerciseId, setId as string)}
                className="text-red-400 hover:text-red-300 p-1"
                title="Extra-Satz löschen"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Wiederholungen"
            defaultValue={plannedReps || ''}
            disabled={isCompleted}
            className={`w-1/3 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-red-600 ${isCompleted ? 'opacity-50' : ''}`}
            id={`reps-${inputId}`}
          />
          <input
            type="number"
            inputMode="decimal"
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
    if (window.confirm('Möchtest du das Training wirklich beenden? Alle eingetragenen Sätze wurden bereits gespeichert.')) {
      navigate('/');
    }
  };

  const toggleExerciseExpansion = (exerciseId: number) => {
    const newExpanded = new Set(expandedExercises);
    if (newExpanded.has(exerciseId)) {
      newExpanded.delete(exerciseId);
    } else {
      newExpanded.add(exerciseId);
    }
    setExpandedExercises(newExpanded);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(exercisesInTraining);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update local state immediately for UI responsiveness
    setLocalExerciseOrder(items);

    // Update each training exercise with new order via DataContext
    try {
      for (let index = 0; index < items.length; index++) {
        const item = items[index];
        const originalFromContext = trainingExercises.find(te => te.id === item.id);
        if (originalFromContext) {
          const updatedItem = {
            ...originalFromContext,
            order: index
          };
          await updateTrainingExercise(updatedItem);
        }
      }
    } catch (error) {
      console.error('Fehler beim Neuordnen der Übungen:', error);
      alert('Fehler beim Neuordnen der Übungen.');
      // Reset to original order on error
      const originalOrder = trainingExercises.filter(te => te.training_id === training?.id)
        .map(te => ({
          ...te,
          exercise_name: exercises.find(ex => ex.id === te.exercise_id)?.name || 'Unbekannte Übung',
          plannedSets: trainingPlannedSets.filter(tps => tps.training_exercise_id === te.id).sort((a, b) => a.set_number - b.set_number),
        })).sort((a, b) => a.order - b.order);
      setLocalExerciseOrder(originalOrder);
    }
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
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="exercises">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {exercisesInTraining.map((te, index) => (
                  <Draggable key={te.id} draggableId={te.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-gray-900 rounded-lg p-4 space-y-4 ${snapshot.isDragging ? 'shadow-lg rotate-1' : ''}`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3 flex-1">
                            <div {...provided.dragHandleProps} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-grab active:cursor-grabbing">
                              <GripVertical size={20} />
                            </div>
                            <button 
                              onClick={() => toggleExerciseExpansion(te.id)}
                              className="flex items-center space-x-2 flex-1 text-left hover:bg-gray-800 rounded p-1 -m-1 transition-colors"
                            >
                              {expandedExercises.has(te.id) ? (
                                <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
                              ) : (
                                <ChevronRight size={20} className="text-gray-500 dark:text-gray-400" />
                              )}
                              <h2 className={`font-bold text-lg ${text}`}>{te.exercise_name}</h2>
                              <span className="text-gray-600 dark:text-gray-400 text-sm ml-auto">
                                {te.planned_sets + (extraSets[te.id]?.length || 0)} Sätze
                              </span>
                            </button>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditTrainingExercise(te)}
                              className="text-blue-400 hover:text-blue-300 p-1"
                              title="Übung bearbeiten"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteTrainingExercise(te.id, te.exercise_name)}
                              className="text-red-400 hover:text-red-300 p-1"
                              title="Übung aus Training entfernen"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        
                        {expandedExercises.has(te.id) && (
                          <>
                            {/* Geplante Sätze */}
                            {te.plannedSets.map((ps: any) => 
                              renderSet(te.id, ps.id, ps.set_number, ps.planned_reps, ps.planned_weight, ps.planned_unit, false)
                            )}
                            
                            {/* Extra Sätze */}
                            {(extraSets[te.id] || []).map((extraSet: ExtraSetData) => 
                              renderSet(te.id, extraSet.id, extraSet.setNumber, null, null, 'kg', true)
                            )}

                            {/* Satz hinzufügen Button */}
                            <div className="pt-2">
                              <button
                                onClick={() => addExtraSet(te.id)}
                                className="w-full flex items-center justify-center space-x-2 py-2 border-2 border-dashed border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition-colors"
                                title="Weiteren Satz hinzufügen"
                              >
                                <Plus size={18} />
                                <span>Satz hinzufügen</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <div className="pt-4">
        <Button onClick={handleFinishTraining}>Training beenden</Button>
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

      {/* Modal für Übung bearbeiten */}
      {editingTrainingExercise && (
        <Modal 
          isOpen={isEditTrainingExerciseModalOpen} 
          onClose={() => setIsEditTrainingExerciseModalOpen(false)} 
          title="Übung bearbeiten"
        >
          <EditTrainingExerciseForm 
            trainingExercise={editingTrainingExercise} 
            onClose={() => setIsEditTrainingExerciseModalOpen(false)} 
          />
        </Modal>
      )}
    </div>
  );
};

export default TrackingPage;