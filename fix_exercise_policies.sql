-- Fix Exercise Policies for Update and Delete Operations

-- Add missing UPDATE policy for exercises
CREATE POLICY "Users can update their own exercises." ON public.exercises FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Add missing DELETE policy for exercises  
CREATE POLICY "Users can delete their own exercises." ON public.exercises FOR DELETE USING (user_id = auth.uid());

-- Verify existing policies are correct
-- SELECT * FROM pg_policies WHERE tablename = 'exercises';