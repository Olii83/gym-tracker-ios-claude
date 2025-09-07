import { useState, useMemo, useEffect, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import Button from './Button';
import { Filter, Search } from 'lucide-react';

interface AddTrainingExerciseFormProps {
  trainingId: number;
  onClose: () => void;
}

const AddTrainingExerciseForm = ({ trainingId, onClose }: AddTrainingExerciseFormProps) => {
  const { exercises, trainingExercises, addTrainingExercise } = useData();
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [plannedSetsCount, setPlannedSetsCount] = useState<number | ''>( 3);
  const [loading, setLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Get unique muscle groups
  const muscleGroups = useMemo(() => {
    const groups = [...new Set(exercises.map(ex => ex.muscle_group))].sort();
    return groups;
  }, [exercises]);

  // Get unique equipment types
  const equipmentTypes = useMemo(() => {
    const equipment = [...new Set(exercises.map(ex => ex.equipment).filter(Boolean))].sort();
    return equipment;
  }, [exercises]);

  // Filter exercises by selected muscle group, equipment, and search term
  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => {
      const matchesMuscleGroup = !selectedMuscleGroup || ex.muscle_group === selectedMuscleGroup;
      const matchesEquipment = !selectedEquipment || ex.equipment === selectedEquipment;
      const matchesSearch = !searchTerm || ex.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesMuscleGroup && matchesEquipment && matchesSearch;
    }).sort((a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base' }));
  }, [exercises, selectedMuscleGroup, selectedEquipment, searchTerm]);

  // Reset exercise selection when filters change
  const handleMuscleGroupChange = (muscleGroup: string) => {
    setSelectedMuscleGroup(muscleGroup);
    setSelectedExerciseId('');
  };

  const handleEquipmentChange = (equipment: string) => {
    setSelectedEquipment(equipment);
    setSelectedExerciseId('');
  };

  const clearFilters = () => {
    setSelectedMuscleGroup('');
    setSelectedEquipment('');
    setSearchTerm('');
    setSelectedExerciseId('');
    setShowSearchResults(false);
  };

  const selectExerciseFromSearch = (exercise: any) => {
    setSelectedExerciseId(exercise.id.toString());
    setSearchTerm(exercise.name);
    setShowSearchResults(false);
  };

  // Handle clicking outside the search container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExerciseId) {
      alert('Bitte wähle eine Übung aus.');
      return;
    }

    // Determine the order for the new exercise
    const currentTrainingExercises = trainingExercises.filter(te => te.training_id === trainingId);
    const order = currentTrainingExercises.length > 0 
      ? Math.max(...currentTrainingExercises.map(te => te.order)) + 1 
      : 0;

    setLoading(true);
    
    // Ensure we have a valid plannedSetsCount
    const validPlannedSetsCount = plannedSetsCount === '' ? 1 : plannedSetsCount;
    
    // Create empty planned sets (details will be added later in TrainingDetail)
    const emptyPlannedSets = Array.from({ length: validPlannedSetsCount }, (_, index) => ({
      training_exercise_id: 0, // Will be set by the backend
      set_number: index + 1,
      planned_reps: null,
      planned_weight: null,
      planned_unit: 'kg' as const,
    }));
    
    const { error } = await addTrainingExercise(
      {
        training_id: trainingId,
        exercise_id: parseInt(selectedExerciseId),
        planned_sets: validPlannedSetsCount,
        order: order,
      },
      emptyPlannedSets
    );
    if (error) {
      alert(error.message);
    } else {
      onClose();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Filter Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter & Suche:</span>
        </div>
        
        {/* Search Bar */}
        <div className="relative" ref={searchContainerRef}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Übung suchen..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSearchResults(e.target.value.length > 0);
              if (e.target.value.length === 0) {
                setSelectedExerciseId('');
              }
            }}
            onFocus={() => {
              if (searchTerm.length > 0) {
                setShowSearchResults(true);
              }
            }}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
          
          {/* Live Search Results */}
          {showSearchResults && searchTerm.length > 0 && filteredExercises.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredExercises.slice(0, 8).map(exercise => (
                <button
                  key={exercise.id}
                  type="button"
                  onClick={() => selectExerciseFromSearch(exercise)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600 last:border-b-0 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {exercise.name}
                    </span>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {exercise.muscle_group}
                      </div>
                      {exercise.equipment && (
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {exercise.equipment}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              {filteredExercises.length > 8 && (
                <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-750">
                  {filteredExercises.length - 8} weitere Übungen...
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="muscleGroup" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Körperpartie</label>
            <select
              id="muscleGroup"
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              value={selectedMuscleGroup}
              onChange={(e) => handleMuscleGroupChange(e.target.value)}
            >
              <option value="">Alle Körperpartien</option>
              {muscleGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="equipment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gerät</label>
            <select
              id="equipment"
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              value={selectedEquipment}
              onChange={(e) => handleEquipmentChange(e.target.value)}
            >
              <option value="">Alle Geräte</option>
              {equipmentTypes.map(equipment => (
                <option key={equipment} value={equipment}>{equipment}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(selectedMuscleGroup || selectedEquipment || searchTerm) && (
          <button
            type="button"
            onClick={clearFilters}
            className="px-3 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors"
          >
            Filter zurücksetzen
          </button>
        )}

        {/* Show filtered count */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {filteredExercises.length} Übung(en) verfügbar
          {searchTerm && ` für "${searchTerm}"`}
          {selectedMuscleGroup && ` in ${selectedMuscleGroup}`}
          {selectedEquipment && ` mit ${selectedEquipment}`}
        </p>
      </div>

      <div>
        <label htmlFor="exercise" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Übung auswählen</label>
        <select
          id="exercise"
          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          value={selectedExerciseId}
          onChange={(e) => setSelectedExerciseId(e.target.value)}
          disabled={filteredExercises.length === 0}
        >
          <option value="">Übung auswählen...</option>
          {filteredExercises.map(ex => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="plannedSets" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Anzahl geplanter Sätze
        </label>
        <input
          type="number"
          id="plannedSets"
          min="1"
          max="10"
          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          value={plannedSetsCount}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '') {
              setPlannedSetsCount('');
            } else {
              const numValue = parseInt(value);
              if (!isNaN(numValue) && numValue >= 1 && numValue <= 10) {
                setPlannedSetsCount(numValue);
              }
            }
          }}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Die Details für jeden Satz können nach dem Hinzufügen bearbeitet werden.
        </p>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Wird hinzugefügt...' : 'Übung zu Training hinzufügen'}
        </Button>
      </div>
    </form>
  );
};

export default AddTrainingExerciseForm;