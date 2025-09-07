import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAccentColor } from '../hooks/useAccentColor';
import Button from '../components/Button';
import Modal from '../components/Modal';
import AddExerciseForm from '../components/AddExerciseForm';
import EditExerciseForm from '../components/EditExerciseForm';
import ExerciseDetailModal from '../components/ExerciseDetailModal';
import type { Exercise } from '../interfaces';
import { Edit3, Trash2, Search, Filter } from 'lucide-react';

const Uebungen = () => {
  const { exercises, deleteExercise } = useData();
  const { heading } = useAccentColor();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');

  // Get all unique muscle groups and equipment types
  const muscleGroups = useMemo(() => 
    [...new Set(exercises.map(e => e.muscle_group))].sort(),
    [exercises]
  );

  const equipmentTypes = useMemo(() => 
    [...new Set(exercises.map(e => e.equipment).filter(Boolean))].sort(),
    [exercises]
  );

  // Filter exercises based on search and filters
  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMuscleGroup = !selectedMuscleGroup || exercise.muscle_group === selectedMuscleGroup;
      const matchesEquipment = !selectedEquipment || exercise.equipment === selectedEquipment;
      return matchesSearch && matchesMuscleGroup && matchesEquipment;
    });
  }, [exercises, searchTerm, selectedMuscleGroup, selectedEquipment]);

  // Group filtered exercises by muscle group
  const filteredMuscleGroups = useMemo(() => {
    if (selectedMuscleGroup) {
      return [selectedMuscleGroup];
    }
    return [...new Set(filteredExercises.map(e => e.muscle_group))].sort();
  }, [filteredExercises, selectedMuscleGroup]);

  const handleEditExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsEditModalOpen(true);
  };

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsDetailModalOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedMuscleGroup('');
    setSelectedEquipment('');
  };

  const handleDeleteExercise = async (exercise: Exercise) => {
    if (window.confirm(`Möchten Sie die Übung "${exercise.name}" wirklich löschen?`)) {
      const { error } = await deleteExercise(exercise.id);
      if (error) {
        alert(`Fehler beim Löschen der Übung: ${error.message}`);
      }
    }
  };

  const canEditExercise = (exercise: Exercise) => {
    // Only allow editing user-created exercises (user_id is not null)
    return exercise.user_id !== null;
  };

  return (
    <div className="p-4 space-y-6">

      {/* Search and Filter Section */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Übungen durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={selectedMuscleGroup}
              onChange={(e) => setSelectedMuscleGroup(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="">Alle Muskelgruppen</option>
              {muscleGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="">Alle Geräte</option>
              {equipmentTypes.map(equipment => (
                <option key={equipment} value={equipment}>{equipment}</option>
              ))}
            </select>
          </div>
          {(searchTerm || selectedMuscleGroup || selectedEquipment) && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors"
            >
              Filter zurücksetzen
            </button>
          )}
        </div>
      </div>

      <Button onClick={() => setIsAddModalOpen(true)} variant="secondary">
        Eigene Übung hinzufügen
      </Button>

      {/* Results */}
      {filteredExercises.length === 0 ? (
        <div className="text-center py-12">
          <Search size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            Keine Übungen gefunden
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            Versuche andere Suchbegriffe oder Filter.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredMuscleGroups.map((group) => {
            const groupExercises = filteredExercises
              .filter(ex => ex.muscle_group === group)
              .sort((a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base' }));
            if (groupExercises.length === 0) return null;
            
            return (
              <div key={group}>
                <h2 className={`text-xl font-semibold mb-3 ${heading}`}>
                  {group} ({groupExercises.length})
                </h2>
                <div className="bg-gray-100 dark:bg-gray-900 rounded-lg">
                  {groupExercises.map((exercise, index, arr) => (
                    <div
                      key={exercise.id}
                      className={`p-4 flex justify-between items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${
                        index < arr.length - 1 ? 'border-b border-gray-200 dark:border-gray-800' : ''
                      }`}
                      onClick={() => handleExerciseClick(exercise)}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{exercise.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {exercise.equipment && (
                            <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                              {exercise.equipment}
                            </span>
                          )}
                          {exercise.user_id === null && (
                            <span className="text-xs text-gray-500 dark:text-gray-500">Standard-Übung</span>
                          )}
                        </div>
                      </div>
                      {canEditExercise(exercise) && (
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditExercise(exercise);
                            }}
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-500 p-1"
                            title="Übung bearbeiten"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteExercise(exercise);
                            }}
                            className="text-gray-600 dark:text-gray-400 hover:text-red-500 p-1"
                            title="Übung löschen"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Neue Übung hinzufügen"
      >
        <AddExerciseForm onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedExercise(null);
        }} 
        title="Übung bearbeiten"
      >
        {selectedExercise && (
          <EditExerciseForm 
            exercise={selectedExercise} 
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedExercise(null);
            }} 
          />
        )}
      </Modal>

      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedExercise(null);
        }} 
        title="Übung Details"
      >
        {selectedExercise && (
          <ExerciseDetailModal 
            exercise={selectedExercise} 
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedExercise(null);
            }} 
          />
        )}
      </Modal>
    </div>
  );
};

export default Uebungen;
