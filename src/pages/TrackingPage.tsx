import { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAccentColor } from '../hooks/useAccentColor';
import { useTracking } from '../contexts/TrackingContext';
import Button from '../components/Button';
import Modal from '../components/Modal';
import AddTrainingExerciseForm from '../components/AddTrainingExerciseForm';
import EditTrainingExerciseForm from '../components/EditTrainingExerciseForm';
import { Check, Plus, PlusCircle, GripVertical, ChevronDown, ChevronRight, Trash2, Edit } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import type { WorkoutLog, TrainingExercise } from '../interfaces';

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

interface ExtendedTrainingExercise extends TrainingExercise {
  exercise_name: string;
  plannedSets: any[];
}

const TrackingPage = () => {
  const { id } = useParams<{ id: string }>();
  const { trainings, trainingExercises, exercises, trainingPlannedSets, logs, addLog, updateTrainingExercise, deleteTrainingExercise, profile } = useData();
  const { text } = useAccentColor();
  const navigate = useNavigate();
  const { startTraining, stopTraining } = useTracking();

  // Always call hooks first
  const [completedSets, setCompletedSets] = useState<Record<string, CompletedSet>>({});
  const [extraSets, setExtraSets] = useState<Record<number, ExtraSetData[]>>({});
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);
  const [expandedExercises, setExpandedExercises] = useState<Set<number>>(new Set());
  const [localExerciseOrder, setLocalExerciseOrder] = useState<ExtendedTrainingExercise[]>([]);
  const [isEditTrainingExerciseModalOpen, setIsEditTrainingExerciseModalOpen] = useState(false);
  const [editingTrainingExercise, setEditingTrainingExercise] = useState<ExtendedTrainingExercise | null>(null);
  // Session storage for workout logs (not saved to DB until training is finished)
  const [sessionLogs, setSessionLogs] = useState<Array<Omit<WorkoutLog, 'id' | 'user_id' | 'created_at'>>>([]);
  
  // Weight unit per exercise (exercise_id -> unit)
  const [exerciseWeightUnits, setExerciseWeightUnits] = useState<Record<number, 'kg' | 'lb'>>({});

  const training = trainings.find(t => t.id === parseInt(id || ''));

  // Start training when component mounts
  useEffect(() => {
    if (training?.id) {
      startTraining(training.id);
    }
    
    // Cleanup function to stop training when component unmounts
    return () => {
      stopTraining();
    };
  }, [training?.id, startTraining, stopTraining]);

  // Initialize exercisesInTraining with proper ordering
  const exercisesInTraining = useMemo(() => {
    if (!training) return [];
    
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
  }, [trainingExercises, training?.id, exercises, trainingPlannedSets, localExerciseOrder]);

  // Initialize exercise weight units (only for exercises without user override)
  useEffect(() => {
    exercisesInTraining.forEach(te => {
      // Only initialize if no user override exists
      if (!exerciseWeightUnits[te.exercise_id]) {
        const exercise = exercises.find(ex => ex.id === te.exercise_id);
        const preferredUnit = exercise?.preferred_unit || profile?.unit || 'kg';
        
        setExerciseWeightUnits(prev => ({
          ...prev,
          [te.exercise_id]: preferredUnit
        }));
      }
    });
  }, [exercisesInTraining, exercises, profile?.unit, exerciseWeightUnits]);

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

      // Get exercise ID
      const exerciseId = exercisesInTraining.find(te => te.id === trainingExerciseId)?.exercise_id;
      if (!exerciseId) return;

      // Convert weight back to kg for session storage and later database storage
      const exerciseUnit = getExerciseWeightUnit(exerciseId);
      const weightInKg = convertWeight(weight, exerciseUnit, 'kg');

      // Store in session (not in database yet)
      const newSessionLog: Omit<WorkoutLog, 'id' | 'user_id' | 'created_at'> = {
        exercise_id: exerciseId,
        reps,
        weight: weightInKg,
      };

      setSessionLogs(prev => [...prev, newSessionLog]);

      // Update state - store the original weight in current unit for display
      setCompletedSets(prev => ({
        ...prev,
        [setKey]: { reps, weight, completed: true }
      }));
    } else {
      // Mark as uncompleted and remove from session logs
      const exerciseId = exercisesInTraining.find(te => te.id === trainingExerciseId)?.exercise_id;
      if (exerciseId && currentSet) {
        // Remove the corresponding session log
        const exerciseUnit = getExerciseWeightUnit(exerciseId);
        setSessionLogs(prev => {
          const indexToRemove = prev.findIndex(log => 
            log.exercise_id === exerciseId && 
            log.reps === currentSet.reps && 
            log.weight === convertWeight(currentSet.weight, exerciseUnit, 'kg')
          );
          if (indexToRemove !== -1) {
            return prev.filter((_, index) => index !== indexToRemove);
          }
          return prev;
        });
      }

      setCompletedSets(prev => ({
        ...prev,
        [setKey]: { ...currentSet, completed: false }
      }));
    }
  }, [completedSets, exercisesInTraining, addLog, exerciseWeightUnits]);

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
    
    // Remove from completed sets and session logs if it was completed
    const setKey = getSetKey(trainingExerciseId, setId, true);
    const completedSet = completedSets[setKey];
    
    if (completedSet?.completed) {
      // Remove from session logs
      const exerciseId = exercisesInTraining.find(te => te.id === trainingExerciseId)?.exercise_id;
      if (exerciseId) {
        const exerciseUnit = getExerciseWeightUnit(exerciseId);
        setSessionLogs(prev => {
          const indexToRemove = prev.findIndex(log => 
            log.exercise_id === exerciseId && 
            log.reps === completedSet.reps && 
            log.weight === convertWeight(completedSet.weight, exerciseUnit, 'kg')
          );
          if (indexToRemove !== -1) {
            return prev.filter((_, index) => index !== indexToRemove);
          }
          return prev;
        });
      }
    }
    
    setCompletedSets(prev => {
      const newCompleted = { ...prev };
      delete newCompleted[setKey];
      return newCompleted;
    });
  }, [exercisesInTraining, completedSets, exerciseWeightUnits]);

  const deleteSet = useCallback((trainingExerciseId: number, setId: number | string, setNumber: number) => {
    if (!window.confirm(`Möchtest du Satz ${setNumber} wirklich löschen?`)) {
      return;
    }

    const setKey = getSetKey(trainingExerciseId, setId, false);
    const completedSet = completedSets[setKey];

    // Remove from session logs if completed
    if (completedSet?.completed) {
      const exerciseId = exercisesInTraining.find(te => te.id === trainingExerciseId)?.exercise_id;
      if (exerciseId) {
        const exerciseUnit = getExerciseWeightUnit(exerciseId);
        setSessionLogs(prev => {
          const indexToRemove = prev.findIndex(log => 
            log.exercise_id === exerciseId && 
            log.reps === completedSet.reps && 
            log.weight === convertWeight(completedSet.weight, exerciseUnit, 'kg')
          );
          if (indexToRemove !== -1) {
            return prev.filter((_, index) => index !== indexToRemove);
          }
          return prev;
        });
      }
    }

    // Remove from completed sets
    setCompletedSets(prev => {
      const newCompleted = { ...prev };
      delete newCompleted[setKey];
      return newCompleted;
    });
  }, [exercisesInTraining, completedSets, exerciseWeightUnits]);

  const handleDeleteTrainingExercise = async (trainingExerciseId: number, exerciseName: string) => {
    if (window.confirm(`Möchtest du die Übung "${exerciseName}" wirklich aus dem Training entfernen?`)) {
      // Get exercise ID to remove related session logs
      const exerciseId = exercisesInTraining.find(te => te.id === trainingExerciseId)?.exercise_id;
      
      await deleteTrainingExercise(trainingExerciseId);
      
      // Clean up session logs for this exercise
      if (exerciseId) {
        setSessionLogs(prev => prev.filter(log => log.exercise_id !== exerciseId));
      }
      
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

  const handleEditTrainingExercise = (trainingExercise: ExtendedTrainingExercise) => {
    setEditingTrainingExercise(trainingExercise);
    setIsEditTrainingExerciseModalOpen(true);
  };

  // Get the last tracked values for a specific exercise and set number
  const getLastTrackedValuesForSet = (exerciseId: number, setNumber: number) => {
    // Find all logs for this exercise, grouped by date
    const exerciseLogs = logs
      .filter(log => log.exercise_id === exerciseId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (exerciseLogs.length === 0) {
      return { lastReps: null, lastWeight: null };
    }

    // Group logs by date (training session) to get the most recent complete workout
    const logsByDate: Record<string, typeof exerciseLogs> = {};
    exerciseLogs.forEach(log => {
      const dateKey = new Date(log.created_at).toDateString();
      if (!logsByDate[dateKey]) {
        logsByDate[dateKey] = [];
      }
      logsByDate[dateKey].push(log);
    });

    // Get the most recent training session
    const dates = Object.keys(logsByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    if (dates.length === 0) {
      return { lastReps: null, lastWeight: null };
    }

    const lastSessionLogs = logsByDate[dates[0]];
    
    // Try to find the specific set number from the last session
    // Since we don't have set numbers in logs, we'll use the chronological order
    // The first log of the day = set 1, second = set 2, etc.
    const sortedSessionLogs = lastSessionLogs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    if (setNumber <= sortedSessionLogs.length) {
      const targetLog = sortedSessionLogs[setNumber - 1]; // setNumber is 1-based
      return {
        lastReps: targetLog.reps,
        lastWeight: targetLog.weight
      };
    }

    // Fallback to last set of that session if setNumber is higher than available sets
    const lastLog = sortedSessionLogs[sortedSessionLogs.length - 1];
    return {
      lastReps: lastLog.reps,
      lastWeight: lastLog.weight
    };
  };

  const renderSet = (
    trainingExerciseId: number,
    exerciseId: number,
    setId: number | string,
    setNumber: number,
    plannedReps: number | null,
    plannedWeight: number | null,
    plannedUnit: string | null,
    isExtra: boolean = false
  ) => {
    const currentUnit = getExerciseWeightUnit(exerciseId);
    const setKey = getSetKey(trainingExerciseId, setId, isExtra);
    const isCompleted = completedSets[setKey]?.completed || false;
    const completedData = completedSets[setKey];
    const inputId = `${setKey}`;

    // Get last tracked values for this specific set
    const { lastReps, lastWeight } = getLastTrackedValuesForSet(exerciseId, setNumber);

    return (
      <div key={setKey} className="space-y-2">
        <div className="flex justify-between items-center text-white">
          <div className={isCompleted ? 'line-through text-gray-500' : ''}>
            <div className="text-xs">
              <span className="font-medium">Satz {setNumber}:</span>
              {!isExtra && (plannedReps || plannedWeight) && (
                <span className="text-gray-400 ml-1">
                  Geplant: {plannedReps || '?'} Wdh. × {
                    plannedWeight 
                      ? convertWeight(plannedWeight, (plannedUnit as 'kg' | 'lb') || 'kg', currentUnit)
                      : '?'
                  } {currentUnit}
                </span>
              )}
              {lastReps && lastWeight && (
                <span className="text-blue-400 ml-1">
                  {isExtra ? 'Letztes Mal: ' : ' | Letztes Mal: '}{lastReps} Wdh. × {convertWeight(lastWeight, 'kg', currentUnit)} {currentUnit}
                </span>
              )}
              {isExtra && !lastReps && !lastWeight && (
                <span className="text-gray-400 ml-1">(Extra)</span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isCompleted && completedData && (
              <span className="text-green-500 text-sm">
                ✓ {completedData.reps} Wdh. × {completedData.weight} {currentUnit}
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
        <div className="flex space-x-1">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Wdh."
            disabled={isCompleted}
            className={`w-16 bg-gray-800 border border-gray-700 rounded px-1 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-600 ${isCompleted ? 'opacity-50' : ''}`}
            id={`reps-${inputId}`}
          />
          <input
            type="number"
            inputMode="decimal"
            step="0.25"
            placeholder="Gewicht"
            disabled={isCompleted}
            className={`w-20 bg-gray-800 border border-gray-700 rounded px-1 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-600 ${isCompleted ? 'opacity-50' : ''}`}
            id={`weight-${inputId}`}
          />
          <button
            onClick={() => toggleExerciseWeightUnit(exerciseId)}
            disabled={isCompleted}
            className={`px-1 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors font-mono w-8 ${isCompleted ? 'opacity-50' : ''}`}
            title="Gewichtseinheit umschalten"
          >
            {currentUnit}
          </button>
          <button
            onClick={() => toggleSetCompletion(trainingExerciseId, setId, setNumber, isExtra)}
            className={`flex items-center justify-center w-7 h-7 rounded border-2 transition-all flex-shrink-0 ${
              isCompleted 
                ? 'bg-green-600 border-green-600 text-white' 
                : 'border-gray-600 text-gray-400 hover:border-green-500 hover:text-green-500'
            }`}
            title={isCompleted ? 'Satz als nicht erledigt markieren' : 'Satz als erledigt markieren'}
          >
            <Check size={14} />
          </button>
          {!isCompleted && (
            <button
              onClick={() => isExtra ? removeExtraSet(trainingExerciseId, setId as string) : deleteSet(trainingExerciseId, setId, setNumber)}
              className="flex items-center justify-center w-6 h-6 rounded text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all flex-shrink-0"
              title="Satz löschen"
            >
              <Trash2 size={10} />
            </button>
          )}
        </div>
      </div>
    );
  };

  const handleFinishTraining = async () => {
    if (window.confirm('Möchtest du das Training wirklich beenden? Alle eingetragenen Sätze werden jetzt gespeichert.')) {
      // Save all session logs to database
      const savePromises = sessionLogs.map(log => addLog(log));
      
      try {
        const results = await Promise.allSettled(savePromises);
        const failedSaves = results.filter(result => result.status === 'rejected');
        
        if (failedSaves.length > 0) {
          alert(`Warnung: ${failedSaves.length} Sätze konnten nicht gespeichert werden. Bitte versuche es erneut.`);
          return;
        }
        
        // All saves successful
        stopTraining();
        navigate('/');
      } catch (error) {
        alert('Fehler beim Speichern der Trainingsdaten. Bitte versuche es erneut.');
        console.error('Error saving session logs:', error);
      }
    }
  };

  const handleCancelTraining = () => {
    const completedSetsCount = Object.values(completedSets).filter(set => set.completed).length;
    const message = completedSetsCount > 0 
      ? `⚠️ Möchtest du das Training wirklich abbrechen?\n\n${completedSetsCount} eingetragene Sätze gehen dabei VERLOREN und werden NICHT gespeichert!`
      : '⚠️ Möchtest du das Training wirklich abbrechen?';
      
    if (window.confirm(message)) {
      // Clear all session data
      setSessionLogs([]);
      setCompletedSets({});
      setExtraSets({});
      stopTraining();
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

  // Check if all sets of an exercise are completed
  const areAllSetsCompleted = (trainingExerciseId: number) => {
    const exercise = exercisesInTraining.find(te => te.id === trainingExerciseId);
    if (!exercise) return false;
    
    const totalPlannedSets = exercise.plannedSets.length;
    const extraSetsCount = extraSets[trainingExerciseId]?.length || 0;
    const totalSets = totalPlannedSets + extraSetsCount;
    
    if (totalSets === 0) return false;
    
    let completedCount = 0;
    
    // Check planned sets
    exercise.plannedSets.forEach((ps: any) => {
      const setKey = getSetKey(trainingExerciseId, ps.id, false);
      if (completedSets[setKey]?.completed) {
        completedCount++;
      }
    });
    
    // Check extra sets
    (extraSets[trainingExerciseId] || []).forEach((extraSet: ExtraSetData) => {
      const setKey = getSetKey(trainingExerciseId, extraSet.id, true);
      if (completedSets[setKey]?.completed) {
        completedCount++;
      }
    });
    
    return completedCount === totalSets;
  };

  // Convert weight between kg and lb
  const convertWeight = (weight: number, fromUnit: 'kg' | 'lb', toUnit: 'kg' | 'lb'): number => {
    if (fromUnit === toUnit) return weight;
    if (fromUnit === 'kg' && toUnit === 'lb') {
      return Math.round(weight * 2.20462 * 4) / 4; // Round to nearest 0.25
    }
    if (fromUnit === 'lb' && toUnit === 'kg') {
      return Math.round(weight / 2.20462 * 4) / 4; // Round to nearest 0.25
    }
    return weight;
  };

  // Get weight unit for specific exercise
  const getExerciseWeightUnit = (exerciseId: number): 'kg' | 'lb' => {
    // First check user's manual override
    if (exerciseWeightUnits[exerciseId]) {
      return exerciseWeightUnits[exerciseId];
    }
    
    // Then check exercise's preferred unit
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise?.preferred_unit) {
      return exercise.preferred_unit;
    }
    
    // Finally fallback to profile default
    return profile?.unit || 'kg';
  };

  // Toggle weight unit for specific exercise
  const toggleExerciseWeightUnit = (exerciseId: number) => {
    const currentUnit = getExerciseWeightUnit(exerciseId);
    const newUnit = currentUnit === 'kg' ? 'lb' : 'kg';
    setExerciseWeightUnits(prev => ({
      ...prev,
      [exerciseId]: newUnit
    }));
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

  // Early return after all hooks are defined
  if (!training) {
    return <div className="p-4 text-white">Training not found.</div>;
  }

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
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <div {...provided.dragHandleProps} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-grab active:cursor-grabbing flex-shrink-0">
                              <GripVertical size={18} />
                            </div>
                            <button 
                              onClick={() => toggleExerciseExpansion(te.id)}
                              className="flex items-center space-x-2 flex-1 text-left hover:bg-gray-800 rounded p-1 -m-1 transition-colors min-w-0"
                            >
                              {expandedExercises.has(te.id) ? (
                                <ChevronDown size={18} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                              ) : (
                                <ChevronRight size={18} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                              )}
                              <h2 className={`font-medium text-sm ${text} flex-1 truncate`}>{te.exercise_name}</h2>
                            </button>
                            {/* Grüner Haken wenn alle Sätze abgeschlossen */}
                            {areAllSetsCompleted(te.id) && (
                              <div className="flex-shrink-0 text-green-500" title="Alle Sätze abgeschlossen">
                                <Check size={20} />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <button
                              onClick={() => handleEditTrainingExercise(te)}
                              className="text-blue-400 hover:text-blue-300 p-1"
                              title="Übung bearbeiten"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteTrainingExercise(te.id, te.exercise_name)}
                              className="text-red-400 hover:text-red-300 p-1"
                              title="Übung aus Training entfernen"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        
                        {expandedExercises.has(te.id) && (
                          <>
                            {/* Geplante Sätze */}
                            {te.plannedSets.map((ps: any) => 
                              renderSet(te.id, te.exercise_id, ps.id, ps.set_number, ps.planned_reps, ps.planned_weight, ps.planned_unit, false)
                            )}
                            
                            {/* Extra Sätze */}
                            {(extraSets[te.id] || []).map((extraSet: ExtraSetData) => 
                              renderSet(te.id, te.exercise_id, extraSet.id, extraSet.setNumber, null, null, 'kg', true)
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

      <div className="pt-4 flex flex-col space-y-3">
        <Button onClick={handleFinishTraining}>Training beenden</Button>
        <button
          onClick={handleCancelTraining}
          className="w-full px-4 py-3 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-medium"
        >
          Abbrechen
        </button>
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