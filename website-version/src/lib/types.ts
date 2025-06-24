export interface Exercise {
  id: number
  name: string
  description: string
  category: string
  duration: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  ageGroup: string
  videoUrl?: string
  imageUrl?: string
  equipment?: string[]
  benefits?: string[]
  instructions?: string[]
}

export interface Program {
  id: number
  title: string
  description: string
  icon: string
  color: string
  exercises: Exercise[]
  duration: number
  ageGroup: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
}

export const EXERCISE_CATEGORIES = [
  'balance',
  'coordination', 
  'strength',
  'ballskills',
  'stretching'
] as const

export const CATEGORY_DISPLAY_NAMES = {
  balance: 'Balance',
  coordination: 'Coordination',
  strength: 'Strength',
  ballskills: 'Ball Skills',
  stretching: 'Stretching'
} as const

export type ExerciseCategory = typeof EXERCISE_CATEGORIES[number]