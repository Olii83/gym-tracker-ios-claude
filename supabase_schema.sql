-- Supabase Schema for Gym Tracker App

-- 1. Profiles Table
-- Stores user-specific information and preferences.
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  unit TEXT DEFAULT 'kg' NOT NULL CHECK (unit IN ('kg', 'lb')),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Function to create a profile for a new user automatically
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    new.id, 
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Exercises Table
-- Stores default and user-created exercises.
CREATE TABLE public.exercises (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL for default exercises
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Workout Logs Table
-- Stores each workout set logged by a user.
CREATE TABLE public.workout_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id BIGINT NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  reps INT NOT NULL,
  weight DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Trainings Table
-- Stores user-defined workout routines (e.g., Push-Tag, Leg Day).
CREATE TABLE public.trainings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Training Exercises Table
-- Links exercises to specific trainings and stores planned sets.
CREATE TABLE public.training_exercises (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  training_id BIGINT NOT NULL REFERENCES public.trainings(id) ON DELETE CASCADE,
  exercise_id BIGINT NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  planned_sets INT NOT NULL DEFAULT 3,
  "order" INT NOT NULL, -- To maintain the order of exercises within a training
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Training Planned Sets Table
-- Stores planned reps, weight, and unit for each set within a training exercise.
CREATE TABLE public.training_planned_sets (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  training_exercise_id BIGINT NOT NULL REFERENCES public.training_exercises(id) ON DELETE CASCADE,
  set_number INT NOT NULL, -- e.g., 1st set, 2nd set
  planned_reps INT,
  planned_weight DECIMAL(10, 2),
  planned_unit TEXT CHECK (planned_unit IN ('kg', 'lb')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_planned_sets ENABLE ROW LEVEL SECURITY;

-- Policies for 'profiles' table
-- Users can view and update their own profile.
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
-- Allow users to update their own profile
create policy "Can update own profile." on profiles for update using (auth.uid() = id);

-- Allow users to create their own profile
create policy "Can create own profile." on profiles for insert with check (auth.uid() = id);

-- Policies for 'exercises' table
-- Users can view all default exercises and their own custom exercises.
CREATE POLICY "Users can view public and their own exercises." ON public.exercises FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());
-- Users can create new exercises for themselves.
CREATE POLICY "Users can create exercises." ON public.exercises FOR INSERT WITH CHECK (user_id = auth.uid());
-- Users can update their own exercises.
CREATE POLICY "Users can update their own exercises." ON public.exercises FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
-- Users can delete their own exercises.
CREATE POLICY "Users can delete their own exercises." ON public.exercises FOR DELETE USING (user_id = auth.uid());

-- Policies for 'workout_logs' table
-- Users can only view, create, update, or delete their own workout logs.
CREATE POLICY "Users can manage their own workout logs." ON public.workout_logs FOR ALL USING (user_id = auth.uid());

-- Policies for 'trainings' table
-- Users can manage their own trainings.
CREATE POLICY "Users can manage their own trainings." ON public.trainings FOR ALL USING (user_id = auth.uid());

-- Policies for 'training_exercises' table
-- Users can manage training exercises belonging to their trainings.
CREATE POLICY "Users can manage their own training exercises." ON public.training_exercises FOR ALL USING (training_id IN (SELECT id FROM public.trainings WHERE user_id = auth.uid()));

-- Policies for 'training_planned_sets' table
-- Users can manage planned sets belonging to their training exercises.
CREATE POLICY "Users can manage their own training planned sets." ON public.training_planned_sets FOR ALL USING (training_exercise_id IN (SELECT id FROM public.training_exercises WHERE training_id IN (SELECT id FROM public.trainings WHERE user_id = auth.uid())));

-- Insert default exercises (optional, can be run once)
INSERT INTO public.exercises (name, muscle_group)
VALUES
  ('Bankdrücken', 'Brust'),
  ('Schrägbankdrücken mit Kurzhanteln', 'Brust'),
  ('Klimmzüge', 'Rücken'),
  ('Rudern am Kabelzug', 'Rücken'),
  ('Kniebeugen', 'Beine'),
  ('Beinpresse', 'Beine'),
  ('Schulterdrücken', 'Schultern'),
  ('Seitheben', 'Schultern'),
  ('Bizeps-Curls', 'Arme'),
  ('Trizeps-Drücken', 'Arme');