# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Starts Vite development server with hot reload
- **Build**: `npm run build` - Runs TypeScript compilation and Vite build
- **Lint**: `npm run lint` - Runs ESLint on all TypeScript/React files
- **Preview**: `npm run preview` - Preview production build locally

## Architecture Overview

This is a React + TypeScript gym tracking PWA built with Vite and Supabase backend.

### Core Architecture

**Authentication & Data Flow**:
- `AuthContext` manages Supabase authentication session and user state
- `DataContext` provides centralized data management for all entities (exercises, logs, trainings, etc.)
- App renders either `Auth` component (logged out) or main application wrapped in `DataProvider` (logged in)

**Database Schema** (Supabase):
- `profiles`: User preferences (username, unit preference kg/lb)  
- `exercises`: Default + user-created exercises with muscle groups
- `workout_logs`: Individual workout sets (exercise, reps, weight, timestamp)
- `trainings`: User-defined workout routines
- `training_exercises`: Links exercises to trainings with planned sets count
- `training_planned_sets`: Planned reps/weight for each set in training exercises

**Component Structure**:
- `Layout`: Main app shell with bottom navigation
- Pages: `Trainings`, `Uebungen`, `Statistiken`, `Einstellungen`, `TrainingDetail`, `TrackingPage` 
- Forms: Reusable modal-based forms for adding/editing entities
- Contexts handle all CRUD operations and state management

### Key Technical Details

**Routing**: React Router with nested routes under Layout component. German route names used throughout.

**Styling**: Tailwind CSS with dark theme (gray-900 backgrounds, white text, red accents)

**State Management**: React Context pattern - AuthContext for auth, DataContext for all business data

**PWA**: Configured with vite-plugin-pwa for offline capabilities and app-like experience

**Data Relationships**: 
- Training → TrainingExercises → TrainingPlannedSets (hierarchical workout structure)
- TrackingPage uses training structure to guide workout execution
- Statistics analyze WorkoutLogs across time periods

When working with this codebase, follow existing patterns for forms, modals, and data operations through the DataContext.