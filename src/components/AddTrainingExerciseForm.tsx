import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import Button from './Button';
import type { TrainingPlannedSet } from '../interfaces';
import { PlusCircle, Trash2, Filter, Search } from 'lucide-react';

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
  const [plannedSets, setPlannedSets] = useState<Omit<TrainingPlannedSet, 'id' | 'created_at' | 'training_exercise_id'>[]>(
    [{ set_number: 1, planned_reps: null, planned_weight: null, planned_unit: 'kg' }]
  );
  const [loading, setLoading] = useState(false);

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
    });
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
  };

  const handleAddSet = () => {
    setPlannedSets(prev => [...prev, { set_number: prev.length + 1, planned_reps: null, planned_weight: null, planned_unit: 'kg' }]);
  };

  const handleRemoveSet = (index: number) => {
    setPlannedSets(prev => prev.filter((_, i) => i !== index).map((set, i) => ({ ...set, set_number: i + 1 })));
  };

  const handleSetChange = (index: number, field: keyof Omit<TrainingPlannedSet, 'id' | 'created_at' | 'training_exercise_id' | 'set_number'>, value: number | string | null) => {
    setPlannedSets(prev => prev.map((set, i) => (i === index ? { ...set, [field]: value } : set)));
  };

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
    const { error } = await addTrainingExercise(
      {
        training_id: trainingId,
        exercise_id: parseInt(selectedExerciseId),
        planned_sets: plannedSets.length,
        order: order,
      },
      plannedSets.map(ps => ({
        training_exercise_id: 0, // Will be set by the backend
        set_number: ps.set_number,
        planned_reps: ps.planned_reps,
        planned_weight: ps.planned_weight,
        planned_unit: ps.planned_unit,
      }))
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Übung suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
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

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Geplante Sätze</h3>
        {plannedSets.map((set, index) => (
          <div key={index} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex items-center space-x-2">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Set {set.set_number}</span>
            <input
              type="number"
              placeholder="Wdh."
              className="w-1/4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
              value={set.planned_reps || ''}
              onChange={(e) => handleSetChange(index, 'planned_reps', parseInt(e.target.value) || null)}
            />
            <input
              type="number"
              step="0.25"
              placeholder="Gewicht"
              className="w-1/4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
              value={set.planned_weight || ''}
              onChange={(e) => handleSetChange(index, 'planned_weight', parseFloat(e.target.value) || null)}
            />
            <select
              className="w-1/6 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
              value={set.planned_unit || 'kg'}
              onChange={(e) => handleSetChange(index, 'planned_unit', e.target.value as 'kg' | 'lb')}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
            {plannedSets.length > 1 && (
              <button type="button" onClick={() => handleRemoveSet(index)} className="text-gray-600 dark:text-gray-400 hover:text-red-500">
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
        <Button type="button" onClick={handleAddSet} variant="secondary" className="w-full mt-3">
          <div className="flex items-center justify-center space-x-2">
            <PlusCircle size={18} />
            <span>Satz hinzufügen</span>
          </div>
        </Button>
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