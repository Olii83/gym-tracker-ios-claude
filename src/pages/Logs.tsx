import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAccentColor } from '../hooks/useAccentColor';
import { ScrollText, Calendar, Clock, Dumbbell, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import type { WorkoutLog } from '../interfaces';

const Logs = () => {
  const { logs, exercises, deleteLog } = useData();
  const { text, primary, hover } = useAccentColor();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'week' | 'month'>('all');
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState<Set<number>>(new Set());
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  // Group logs by date and training session
  const groupedLogs = logs.reduce((acc: Record<string, WorkoutLog[]>, log: WorkoutLog) => {
    const date = new Date(log.created_at).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {} as Record<string, WorkoutLog[]>);

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedLogs).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  // Filter logs based on selected time period
  const filterLogs = (date: string) => {
    const logDate = new Date(date);
    const now = new Date();
    
    switch (selectedFilter) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return logDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return logDate >= monthAgo;
      default:
        return true;
    }
  };

  const filteredDates = sortedDates.filter(filterLogs);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getExerciseName = (exerciseId: number) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    return exercise?.name || 'Unbekannte Übung';
  };

  const handleDeleteSelectedLogs = async () => {
    if (selectedLogs.size === 0) return;

    const confirmed = window.confirm(
      `Möchtest du ${selectedLogs.size} Log-Einträge wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`
    );

    if (!confirmed) return;

    try {
      for (const logId of selectedLogs) {
        await deleteLog(logId);
      }
      setSelectedLogs(new Set());
      setDeleteMode(false);
    } catch (error) {
      alert('Fehler beim Löschen der Logs.');
    }
  };

  const handleDeleteWorkoutSession = async (date: string) => {
    const logsForDate = groupedLogs[date];
    const confirmed = window.confirm(
      `Möchtest du das komplette Training vom ${formatDate(date)} löschen? (${logsForDate.length} Einträge)`
    );

    if (!confirmed) return;

    try {
      for (const log of logsForDate) {
        await deleteLog(log.id);
      }
    } catch (error) {
      alert('Fehler beim Löschen des Trainings.');
    }
  };

  const toggleLogSelection = (logId: number) => {
    const newSelection = new Set(selectedLogs);
    if (newSelection.has(logId)) {
      newSelection.delete(logId);
    } else {
      newSelection.add(logId);
    }
    setSelectedLogs(newSelection);
  };

  const selectAllLogsForDate = (date: string) => {
    const logsForDate = groupedLogs[date];
    const newSelection = new Set(selectedLogs);
    const allSelected = logsForDate.every(log => selectedLogs.has(log.id));
    
    if (allSelected) {
      logsForDate.forEach(log => newSelection.delete(log.id));
    } else {
      logsForDate.forEach(log => newSelection.add(log.id));
    }
    setSelectedLogs(newSelection);
  };

  const toggleDateExpansion = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-end mb-6">
        <div className="flex items-center space-x-2">
          {!deleteMode ? (
            <button
              onClick={() => setDeleteMode(true)}
              className={`flex items-center space-x-1 px-3 py-2 ${primary} ${hover} text-white text-sm rounded-lg transition-colors`}
            >
              <Trash2 size={16} />
              <span>Löschen</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setDeleteMode(false);
                  setSelectedLogs(new Set());
                }}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDeleteSelectedLogs}
                disabled={selectedLogs.size === 0}
                className={`flex items-center space-x-1 px-3 py-2 ${primary} ${hover} disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors`}
              >
                <Trash2 size={16} />
                <span>Löschen ({selectedLogs.size})</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedFilter === 'all'
              ? `${primary} text-white`
              : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          Alle
        </button>
        <button
          onClick={() => setSelectedFilter('week')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedFilter === 'week'
              ? `${primary} text-white`
              : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          Diese Woche
        </button>
        <button
          onClick={() => setSelectedFilter('month')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedFilter === 'month'
              ? `${primary} text-white`
              : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          Dieser Monat
        </button>
      </div>

      {/* Logs Display */}
      {filteredDates.length === 0 ? (
        <div className="text-center py-12">
          <ScrollText size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">
            Keine Training Logs gefunden
          </h3>
          <p className="text-gray-500">
            Beginne ein Training, um deine ersten Logs zu erstellen.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredDates.map(date => {
            const logsForDate = groupedLogs[date];
            const uniqueExercises = [...new Set(logsForDate.map(log => log.exercise_id))];
            
            return (
              <div key={date} className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3">
                {/* Date Header */}
                <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-800">
                  <button
                    onClick={() => toggleDateExpansion(date)}
                    className="flex items-center space-x-2 flex-1 text-left hover:bg-gray-200 dark:hover:bg-gray-800 rounded p-1 -m-1 transition-colors"
                  >
                    {expandedDates.has(date) ? (
                      <ChevronDown size={18} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={18} className="text-gray-400" />
                    )}
                    <Calendar size={18} className={text} />
                    <h2 className="text-base font-medium text-white">
                      {formatDate(date)}
                    </h2>
                    <span className="text-gray-400 text-xs ml-auto">
                      {logsForDate.length} Einträge
                    </span>
                  </button>
                  <div className="flex items-center space-x-2 ml-2">
                    {deleteMode && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => selectAllLogsForDate(date)}
                          className="text-xs text-gray-400 hover:text-white transition-colors"
                        >
                          {logsForDate.every(log => selectedLogs.has(log.id)) ? 'Alle abwählen' : 'Alle auswählen'}
                        </button>
                        <button
                          onClick={() => handleDeleteWorkoutSession(date)}
                          className={`flex items-center space-x-1 px-1 py-0.5 ${primary} ${hover} text-white text-xs rounded transition-colors`}
                        >
                          <Trash2 size={10} />
                          <span>Löschen</span>
                        </button>
                      </div>
                    )}
                    <div className="flex items-center space-x-1 text-gray-400 text-xs">
                      <Clock size={14} />
                      <span>{formatTime(logsForDate[0].created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Exercise Summary */}
                {expandedDates.has(date) && (
                  <div className="grid gap-2">
                  {uniqueExercises.map(exerciseId => {
                    const exerciseLogs = logsForDate.filter((log: WorkoutLog) => log.exercise_id === exerciseId);
                    const totalSets = exerciseLogs.length;
                    const totalReps = exerciseLogs.reduce((sum: number, log: WorkoutLog) => sum + log.reps, 0);
                    const maxWeight = Math.max(...exerciseLogs.map((log: WorkoutLog) => log.weight));

                    return (
                      <div key={exerciseId} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <Dumbbell size={14} className={text} />
                            <h3 className="font-medium text-white text-sm">
                              {getExerciseName(exerciseId)}
                            </h3>
                          </div>
                          <div className="text-xs text-gray-400">
                            {totalSets} Satz{totalSets !== 1 ? 'e' : ''}
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-xs text-gray-300">
                          <span>Gesamt: <strong>{totalReps}</strong> Wdh.</span>
                          <span>Max: <strong>{maxWeight}kg</strong></span>
                        </div>

                        {/* Individual Sets */}
                        <div className="mt-1 grid grid-cols-2 sm:grid-cols-4 gap-1">
                          {exerciseLogs.map((log: WorkoutLog, index: number) => (
                            <div 
                              key={log.id} 
                              className={`rounded px-1 py-0.5 text-xs relative ${
                                deleteMode 
                                  ? 'cursor-pointer border-2 transition-all ' + 
                                    (selectedLogs.has(log.id) 
                                      ? `${primary} border-red-400 text-white` 
                                      : 'bg-gray-700 border-gray-600 hover:border-gray-500')
                                  : 'bg-gray-700'
                              }`}
                              onClick={deleteMode ? () => toggleLogSelection(log.id) : undefined}
                            >
                              {deleteMode && selectedLogs.has(log.id) && (
                                <div className={`absolute -top-1 -right-1 w-3 h-3 ${primary} rounded-full flex items-center justify-center`}>
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                              <span className="text-gray-400 text-xs">{index + 1}:</span>
                              <span className="text-white text-xs ml-0.5">
                                {log.reps}×{log.weight}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Logs;