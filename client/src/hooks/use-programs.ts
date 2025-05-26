import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Exercise } from "@shared/schema";

export interface Program {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  exerciseIds: number[];
}

// Global state for programs that can be shared across components
let globalPrograms: Program[] = [];
let programListeners: Array<(programs: Program[]) => void> = [];

export function usePrograms() {
  const [programs, setPrograms] = useState<Program[]>(globalPrograms);
  
  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: ['/api/exercises'],
  });

  // Initialize programs when exercises are loaded
  useEffect(() => {
    if (exercises.length > 0 && globalPrograms.length === 0) {
      const initialPrograms: Program[] = [
        {
          id: 1,
          title: "Animal Adventures",
          description: "Jump like a kangaroo, balance like a flamingo, and roar like a lion!",
          icon: "🦘",
          color: "from-orange-400 to-red-500",
          exerciseIds: exercises
            .filter(ex => 
              ex.name.toLowerCase().includes('animal') ||
              ex.name.toLowerCase().includes('kangaroo') ||
              ex.name.toLowerCase().includes('flamingo') ||
              ex.name.toLowerCase().includes('lion') ||
              ex.name.toLowerCase().includes('dolphin') ||
              ex.name.toLowerCase().includes('kneeling')
            )
            .map(ex => ex.id)
        },
        {
          id: 2,
          title: "Balance Masters",
          description: "Develop amazing balance and coordination skills",
          icon: "⚖️",
          color: "from-blue-400 to-purple-500",
          exerciseIds: exercises.filter(ex => ex.category === 'Balance').map(ex => ex.id)
        },
        {
          id: 3,
          title: "Strength Heroes",
          description: "Build strength through fun, engaging movements",
          icon: "💪",
          color: "from-green-400 to-emerald-500",
          exerciseIds: exercises.filter(ex => ex.category === 'Strength').map(ex => ex.id)
        },
      ];
      
      globalPrograms = initialPrograms;
      setPrograms(initialPrograms);
      programListeners.forEach(listener => listener(initialPrograms));
    }
  }, [exercises]);

  // Subscribe to program changes
  useEffect(() => {
    const listener = (newPrograms: Program[]) => {
      setPrograms([...newPrograms]);
    };
    
    programListeners.push(listener);
    
    return () => {
      programListeners = programListeners.filter(l => l !== listener);
    };
  }, []);

  const updatePrograms = (newPrograms: Program[]) => {
    globalPrograms = newPrograms;
    programListeners.forEach(listener => listener(newPrograms));
  };

  const updateProgram = (id: number, field: string, value: string) => {
    const newPrograms = globalPrograms.map(program => 
      program.id === id ? { ...program, [field]: value } : program
    );
    updatePrograms(newPrograms);
  };

  const addExerciseToProgram = (programId: number, exerciseId: number) => {
    const newPrograms = globalPrograms.map(program => 
      program.id === programId 
        ? { ...program, exerciseIds: [...program.exerciseIds, exerciseId] }
        : program
    );
    updatePrograms(newPrograms);
  };

  const removeExerciseFromProgram = (programId: number, exerciseId: number) => {
    const newPrograms = globalPrograms.map(program => 
      program.id === programId 
        ? { ...program, exerciseIds: program.exerciseIds.filter(id => id !== exerciseId) }
        : program
    );
    updatePrograms(newPrograms);
  };

  const getProgramExercises = (program: Program) => {
    return exercises.filter(ex => program.exerciseIds.includes(ex.id));
  };

  return {
    programs,
    updateProgram,
    addExerciseToProgram,
    removeExerciseFromProgram,
    getProgramExercises,
    exercises
  };
}