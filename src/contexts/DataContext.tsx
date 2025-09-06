import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';
import type { Exercise, WorkoutLog, Profile, Training, TrainingExercise, TrainingPlannedSet } from '../interfaces';

interface DataContextType {
  profile: Profile | null;
  exercises: Exercise[];
  logs: WorkoutLog[];
  trainings: Training[];
  trainingExercises: TrainingExercise[];
  trainingPlannedSets: TrainingPlannedSet[];
  addExercise: (exercise: Omit<Exercise, 'id' | 'user_id'>) => Promise<any>;
  updateExercise: (exercise: Exercise) => Promise<any>;
  deleteExercise: (exerciseId: number) => Promise<any>;
  addLog: (log: Omit<WorkoutLog, 'id' | 'user_id' | 'created_at'>) => Promise<any>;
  updateProfile: (profile: Omit<Profile, 'id'>) => Promise<any>;
  updateUserEmail: (email: string) => Promise<any>;
  updateUserPassword: (password: string) => Promise<any>;
  deleteLog: (logId: number) => Promise<any>;
  updateLog: (log: WorkoutLog) => Promise<any>;
  addTraining: (training: Omit<Training, 'id' | 'user_id' | 'created_at'>) => Promise<any>;
  deleteTraining: (trainingId: number) => Promise<any>;
  addTrainingExercise: (trainingExercise: Omit<TrainingExercise, 'id' | 'created_at'>, plannedSets: Omit<TrainingPlannedSet, 'id' | 'created_at'>[]) => Promise<any>;
  updateTrainingExercise: (trainingExercise: TrainingExercise) => Promise<any>;
  deleteTrainingExercise: (trainingExerciseId: number) => Promise<any>;
  addTrainingPlannedSet: (plannedSet: Omit<TrainingPlannedSet, 'id' | 'created_at'>) => Promise<any>;
  updateTrainingPlannedSet: (plannedSet: TrainingPlannedSet) => Promise<any>;
  deleteTrainingPlannedSet: (plannedSetId: number) => Promise<any>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [trainingExercises, setTrainingExercises] = useState<TrainingExercise[]>([]);
  const [trainingPlannedSets, setTrainingPlannedSets] = useState<TrainingPlannedSet[]>([]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchExercises();
      fetchLogs();
      fetchTrainings();
      fetchTrainingExercises();
      fetchTrainingPlannedSets();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      // First attempt: try to fetch existing profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" which is expected
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      if (data) {
        setProfile(data as Profile);
        return;
      }

      // If no profile found, create one using RPC function (bypasses RLS)
      // No profile found, create one using RPC function
      
      // Try to get full name from user metadata
      const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
      
      const { error: rpcError } = await supabase.rpc('create_user_profile', {
        user_id: user!.id,
        user_email: user!.email || 'User',
        user_full_name: fullName
      });

      if (rpcError) {
        console.error('RPC failed:', rpcError);
        const { data: insertData, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user!.id,
            username: user!.email?.split('@')[0] || 'User',
            full_name: user?.user_metadata?.full_name || user!.email?.split('@')[0] || 'User',
            unit: 'kg'
          })
          .select()
          .single();

        if (insertError) {
          console.error('Insert also failed:', insertError);
          // Create local profile as final fallback
          const localProfile: Profile = {
            id: user!.id,
            username: user!.email?.split('@')[0] || 'User',
            full_name: user?.user_metadata?.full_name || user!.email?.split('@')[0] || 'User',
            unit: 'kg'
          };
          setProfile(localProfile);
          return;
        } else {
          setProfile(insertData as Profile);
          return;
        }
      }

      // RPC succeeded, now fetch the created profile
      const { data: createdProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (fetchError || !createdProfile) {
        console.error('Failed to fetch created profile:', fetchError);
        // Create local fallback
        const localProfile: Profile = {
          id: user!.id,
          username: user!.email?.split('@')[0] || 'User',
          full_name: user?.user_metadata?.full_name || user!.email?.split('@')[0] || 'User',
          unit: 'kg'
        };
        setProfile(localProfile);
      } else {
        setProfile(createdProfile as Profile);
      }
    } catch (error) {
      console.error('Profile fetch/create failed completely:', error);
      // Emergency fallback - create local profile
      const emergencyProfile: Profile = {
        id: user!.id,
        username: user!.email || 'User',
        full_name: user?.user_metadata?.full_name || user!.email || 'User',
        unit: 'kg'
      };
      setProfile(emergencyProfile);
    }
  };

  const fetchExercises = async () => {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .or(`user_id.is.null,user_id.eq.${user!.id}`);
    if (error) console.error('Error fetching exercises:', error);
    else setExercises(data as Exercise[]);
  };

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching logs:', error);
    else setLogs(data as WorkoutLog[]);
  };

  const fetchTrainings = async () => {
    const { data, error } = await supabase
      .from('trainings')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching trainings:', error);
    else setTrainings(data as Training[]);
  };

  const fetchTrainingExercises = async () => {
    const { data, error } = await supabase
      .from('training_exercises')
      .select('*')
      .order('order', { ascending: true });
    if (error) console.error('Error fetching training exercises:', error);
    else setTrainingExercises(data as TrainingExercise[]);
  };

  const fetchTrainingPlannedSets = async () => {
    const { data, error } = await supabase
      .from('training_planned_sets')
      .select('*')
      .order('set_number', { ascending: true });
    if (error) console.error('Error fetching training planned sets:', error);
    else setTrainingPlannedSets(data as TrainingPlannedSet[]);
  };

  const addExercise = async (exercise: Omit<Exercise, 'id' | 'user_id'>) => {
    if (!user) throw new Error('User not logged in');
    const newExercise = { ...exercise, user_id: user.id };
    const { data, error } = await supabase.from('exercises').insert(newExercise).select();
    if (error) {
      console.error('Error adding exercise:', error);
    } else if (data) {
      setExercises(prev => [...prev, data[0]]);
    }
    return { data, error };
  };

  const updateExercise = async (exercise: Exercise) => {
    const { data, error } = await supabase
      .from('exercises')
      .update({ name: exercise.name, muscle_group: exercise.muscle_group })
      .eq('id', exercise.id)
      .select();
    if (error) {
      console.error('Error updating exercise:', error);
    } else if (data) {
      setExercises(prev => prev.map(ex => ex.id === exercise.id ? data[0] : ex));
    }
    return { data, error };
  };

  const deleteExercise = async (exerciseId: number) => {
    
    const { error, count } = await supabase
      .from('exercises')
      .delete()
      .eq('id', exerciseId)
      .eq('user_id', user?.id); // Only allow deleting user's own exercises
    
    if (error) {
      console.error('Error deleting exercise:', error);
      return { error };
    } 
    
    // Check if anything was actually deleted
    
    if (count === 0) {
      const noDeleteError = { 
        message: 'Übung konnte nicht gelöscht werden. Möglicherweise haben Sie keine Berechtigung oder die Übung existiert nicht.' 
      };
      console.error('No rows were deleted');
      return { error: noDeleteError };
    }
    
    // Only update local state if deletion was successful
    setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
    return { error: null };
  };

  const addLog = async (log: Omit<WorkoutLog, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) throw new Error('User not logged in');
    const newLog = { ...log, user_id: user.id };
    const { data, error } = await supabase.from('workout_logs').insert(newLog).select();
    if (error) {
      console.error('Error adding log:', error);
    } else if (data) {
      setLogs(prev => [data[0], ...prev]);
    }
    return { data, error };
  };

  const updateProfile = async (updatedProfile: Omit<Profile, 'id'>) => {
    if (!user) throw new Error('User not logged in');
    const { data, error } = await supabase
      .from('profiles')
      .update(updatedProfile)
      .eq('id', user.id)
      .select();
    if (error) {
      console.error('Error updating profile:', error);
    } else if (data) {
      setProfile(data[0]);
    }
    return { data, error };
  };

  const updateUserEmail = async (email: string) => {
    const { data, error } = await supabase.auth.updateUser({ email });
    if (error) {
      console.error('Error updating email:', error);
    } else if (data.user) {
      // Also update the profile username to match the new email
      if (profile) {
        await updateProfile({ ...profile, username: email });
      }
    }
    return { data, error };
  };

  const updateUserPassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) {
      console.error('Error updating password:', error);
    }
    return { data, error };
  };

  const deleteLog = async (logId: number) => {
    const { error } = await supabase.from('workout_logs').delete().eq('id', logId);
    if (error) {
      console.error('Error deleting log:', error);
    } else {
      setLogs(prev => prev.filter(log => log.id !== logId));
    }
    return { error };
  };

  const updateLog = async (log: WorkoutLog) => {
    const { data, error } = await supabase.from('workout_logs').update(log).eq('id', log.id).select();
    if (error) {
      console.error('Error updating log:', error);
    } else if (data) {
      setLogs(prev => prev.map(l => (l.id === log.id ? data[0] : l)));
    }
    return { data, error };
  };

  const addTraining = async (training: Omit<Training, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) throw new Error('User not logged in');
    const newTraining = { ...training, user_id: user.id };
    const { data, error } = await supabase.from('trainings').insert(newTraining).select();
    if (error) {
      console.error('Error adding training:', error);
    } else if (data) {
      setTrainings(prev => [...prev, data[0]]);
    }
    return { data, error };
  };

  const deleteTraining = async (trainingId: number) => {
    const { error } = await supabase.from('trainings').delete().eq('id', trainingId);
    if (error) {
      console.error('Error deleting training:', error);
    } else {
      setTrainings(prev => prev.filter(t => t.id !== trainingId));
    }
    return { error };
  };

  const addTrainingExercise = async (trainingExercise: Omit<TrainingExercise, 'id' | 'created_at'>, plannedSets: Omit<TrainingPlannedSet, 'id' | 'created_at'>[]) => {
    const { data, error } = await supabase.from('training_exercises').insert(trainingExercise).select();
    if (error) {
      console.error('Error adding training exercise:', error);
      return { data, error };
    } else if (data) {
      const newTrainingExercise = data[0];
      setTrainingExercises(prev => [...prev, newTrainingExercise]);

      // Add planned sets
      if (plannedSets.length > 0) {
        const setsToInsert = plannedSets.map(ps => ({ ...ps, training_exercise_id: newTrainingExercise.id }));
        const { data: newSetsData, error: newSetsError } = await supabase.from('training_planned_sets').insert(setsToInsert).select();
        if (newSetsError) {
          console.error('Error adding planned sets:', newSetsError);
        } else if (newSetsData) {
          setTrainingPlannedSets(prev => [...prev, ...newSetsData]);
        }
      }
    }
    return { data, error };
  };

  const updateTrainingExercise = async (trainingExercise: TrainingExercise) => {
    // Remove id from update data to avoid "GENERATED ALWAYS" error
    const { id, ...updateData } = trainingExercise;
    const { data, error } = await supabase.from('training_exercises').update(updateData).eq('id', id).select();
    if (error) {
      console.error('Error updating training exercise:', error);
    } else if (data) {
      setTrainingExercises(prev => prev.map(te => (te.id === id ? data[0] : te)));
    }
    return { data, error };
  };

  const deleteTrainingExercise = async (trainingExerciseId: number) => {
    const { error } = await supabase.from('training_exercises').delete().eq('id', trainingExerciseId);
    if (error) {
      console.error('Error deleting training exercise:', error);
    } else {
      setTrainingExercises(prev => prev.filter(te => te.id !== trainingExerciseId));
    }
    return { error };
  };

  const addTrainingPlannedSet = async (plannedSet: Omit<TrainingPlannedSet, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('training_planned_sets').insert(plannedSet).select();
    if (error) {
      console.error('Error adding planned set:', error);
    } else if (data) {
      setTrainingPlannedSets(prev => [...prev, data[0]]);
    }
    return { data, error };
  };

  const updateTrainingPlannedSet = async (plannedSet: TrainingPlannedSet) => {
    const { data, error } = await supabase.from('training_planned_sets').update(plannedSet).eq('id', plannedSet.id).select();
    if (error) {
      console.error('Error updating planned set:', error);
    } else if (data) {
      setTrainingPlannedSets(prev => prev.map(tps => (tps.id === plannedSet.id ? data[0] : tps)));
    }
    return { data, error };
  };

  const deleteTrainingPlannedSet = async (plannedSetId: number) => {
    const { error } = await supabase.from('training_planned_sets').delete().eq('id', plannedSetId);
    if (error) {
      console.error('Error deleting planned set:', error);
    } else {
      setTrainingPlannedSets(prev => prev.filter(tps => tps.id !== plannedSetId));
    }
    return { error };
  };

  const value = {
    profile,
    exercises,
    logs,
    trainings,
    trainingExercises,
    trainingPlannedSets,
    addExercise,
    updateExercise,
    deleteExercise,
    addLog,
    updateProfile,
    updateUserEmail,
    updateUserPassword,
    deleteLog,
    updateLog,
    addTraining,
    deleteTraining,
    addTrainingExercise,
    updateTrainingExercise,
    deleteTrainingExercise,
    addTrainingPlannedSet,
    updateTrainingPlannedSet,
    deleteTrainingPlannedSet,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
