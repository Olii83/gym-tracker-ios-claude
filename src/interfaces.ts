export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  unit: 'kg' | 'lb';
}

export interface Exercise {
  id: number;
  name: string;
  muscle_group: string;
  equipment?: string;
  user_id: string | null;
  preferred_unit?: 'kg' | 'lb';
}

export interface WorkoutLog {
  id: number;
  user_id: string;
  exercise_id: number;
  reps: number;
  weight: number;
  created_at: string;
}

export interface Training {
  id: number;
  user_id: string;
  name: string;
  created_at: string;
}

export interface TrainingExercise {
  id: number;
  training_id: number;
  exercise_id: number;
  planned_sets: number;
  order: number;
  created_at: string;
}

export interface TrainingPlannedSet {
  id: number;
  training_exercise_id: number;
  set_number: number;
  planned_reps: number | null;
  planned_weight: number | null;
  planned_unit: 'kg' | 'lb' | null;
  created_at: string;
}