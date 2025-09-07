import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAccentColor } from '../hooks/useAccentColor';
import Button from '../components/Button';
import Modal from '../components/Modal';
import AddTrainingExerciseForm from '../components/AddTrainingExerciseForm';
import PlannedSetForm from '../components/PlannedSetForm';
import type { TrainingExercise, TrainingPlannedSet } from '../interfaces';
import { PlusCircle, Edit, Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';

const TrainingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { trainings, trainingExercises, exercises, trainingPlannedSets, deleteTrainingExercise, deleteTrainingPlannedSet, addTrainingExercise, updateTrainingExercise } = useData();
  const { text } = useAccentColor();
  const navigate = useNavigate();
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);
  const [isPlannedSetModalOpen, setIsPlannedSetModalOpen] = useState(false);
  const [selectedTrainingExercise, setSelectedTrainingExercise] = useState<TrainingExercise | null>(null);
  const [selectedPlannedSet, setSelectedPlannedSet] = useState<TrainingPlannedSet | null>(null);
  const [plannedSetNumber, setPlannedSetNumber] = useState(0);
  const [localExerciseOrder, setLocalExerciseOrder] = useState<any[]>([]);
  const [expandedExercises, setExpandedExercises] = useState<Set<number>>(new Set());

  const training = trainings.find(t => t.id === parseInt(id || ''));

  // Initialize exercisesInTraining with proper ordering
  const exercisesInTraining = useMemo(() => {
    const baseExercises = trainingExercises.filter(te => te.training_id === training?.id)
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

  const handleAddExerciseFromUrl = async (exerciseId: number) => {
    if (!training) return;
    
    try {
      const currentExercises = trainingExercises.filter(te => te.training_id === training.id);
      const order = currentExercises.length > 0 
        ? Math.max(...currentExercises.map(te => te.order)) + 1 
        : 0;

      await addTrainingExercise(
        {
          training_id: training.id,
          exercise_id: exerciseId,
          planned_sets: 1,
          order: order,
        },
        [{ 
          training_exercise_id: 0,
          set_number: 1, 
          planned_reps: null, 
          planned_weight: null, 
          planned_unit: 'kg' 
        }]
      );

      // Remove the parameter after adding
      setSearchParams({});
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Übung:', error);
      alert('Fehler beim Hinzufügen der Übung zum Training.');
    }
  };

  // Handle adding exercise from URL parameter
  useEffect(() => {
    const addExerciseId = searchParams.get('addExercise');
    if (addExerciseId && training && !isAddExerciseModalOpen) {
      handleAddExerciseFromUrl(parseInt(addExerciseId));
    }
  }, [searchParams.get('addExercise'), training?.id]);

  // Show loading state while data is being fetched
  if (!training && trainings.length === 0) {
    return (
      <div className="p-4 text-gray-900 dark:text-white">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
            <p>Training wird geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!training) {
    return <div className="p-4 text-gray-900 dark:text-white">Training nicht gefunden.</div>;
  }


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
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{training.name}</h1>

      <Button onClick={() => setIsAddExerciseModalOpen(true)} variant="secondary">
        <div className="flex items-center justify-center space-x-2">
          <PlusCircle size={18} />
          <span>Übung hinzufügen</span>
        </div>
      </Button>

      <div className="space-y-4">
{exercisesInTraining.length === 0 ? (
          <div className="text-center py-10 px-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">Noch keine Übungen in diesem Training.</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">Füge Übungen hinzu, um dein Training zu planen.</p>
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
                          className={`bg-gray-100 dark:bg-gray-900 rounded-lg p-4 space-y-3 ${snapshot.isDragging ? 'shadow-lg rotate-1' : ''}`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3 flex-1">
                              <div {...provided.dragHandleProps} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-grab active:cursor-grabbing">
                                <GripVertical size={20} />
                              </div>
                              <button 
                                onClick={() => toggleExerciseExpansion(te.id)}
                                className="flex items-center space-x-2 flex-1 text-left hover:bg-gray-200 dark:hover:bg-gray-800 rounded p-1 -m-1 transition-colors"
                              >
                                {expandedExercises.has(te.id) ? (
                                  <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
                                ) : (
                                  <ChevronRight size={20} className="text-gray-500 dark:text-gray-400" />
                                )}
                                <h2 className={`font-bold text-lg ${text}`}>{te.exercise_name}</h2>
                                <span className="text-gray-600 dark:text-gray-400 text-sm ml-auto">
                                  {te.planned_sets} Sätze
                                </span>
                              </button>
                            </div>
                            <div className="flex space-x-2 ml-2">
                              <button onClick={() => handleDeleteTrainingExercise(te.id)} className="text-gray-600 dark:text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                            </div>
                          </div>
                          
                          {expandedExercises.has(te.id) && (
                            <>
                              <div className="space-y-1">
                                {te.plannedSets.map((ps: TrainingPlannedSet) => (
                                  <div key={ps.id} className="flex justify-between items-center text-white py-1">
                                    <span className="text-gray-900 dark:text-white">Satz {ps.set_number}: {ps.planned_reps || '?'} Wdh. × {ps.planned_weight || '?'} {ps.planned_unit || 'kg'}</span>
                                    <div className="flex space-x-2">
                                      <button onClick={() => handleEditPlannedSet(te, ps)} className="text-gray-600 dark:text-gray-400 hover:text-red-500"><Edit size={18} /></button>
                                      <button onClick={() => handleDeletePlannedSet(ps.id)} className="text-gray-600 dark:text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {te.plannedSets.length < te.planned_sets && (
                                <Button onClick={() => handleAddPlannedSet(te)} variant="secondary" className="w-full mt-3">
                                  <div className="flex items-center justify-center space-x-2">
                                    <PlusCircle size={18} />
                                    <span>Satz {te.plannedSets.length + 1} hinzufügen</span>
                                  </div>
                                </Button>
                              )}
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
      </div>

      <div className="pt-4">
        <Button onClick={handleFinishEditing}>Fertig</Button>
      </div>

      <Modal isOpen={isAddExerciseModalOpen} onClose={() => setIsAddExerciseModalOpen(false)} title="Übung zum Training hinzufügen">
        <AddTrainingExerciseForm trainingId={training.id} onClose={() => setIsAddExerciseModalOpen(false)} />
      </Modal>

      {selectedTrainingExercise && (
        <Modal isOpen={isPlannedSetModalOpen} onClose={() => setIsPlannedSetModalOpen(false)} title={selectedPlannedSet ? 'Geplanten Satz bearbeiten' : `Geplanten Satz ${plannedSetNumber} hinzufügen`}>
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
