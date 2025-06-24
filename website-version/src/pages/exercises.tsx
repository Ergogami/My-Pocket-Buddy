import { useState, useMemo } from 'react'
import { useRoute } from 'wouter'
import { Search, Clock, Target, Users, CheckCircle, Circle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { exercises } from '@/data/exercises'
import { CATEGORY_DISPLAY_NAMES, type ExerciseCategory } from '@/lib/types'
import { formatDuration, getDifficultyColor, getCategoryColor } from '@/lib/utils'

export default function ExercisesPage() {
  const [, params] = useRoute('/exercises/:category')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all')
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set())
  const [showCompleted, setShowCompleted] = useState(false)

  const category = params?.category as ExerciseCategory | undefined

  const toggleExerciseCompletion = (exerciseId: number) => {
    setCompletedExercises(prev => {
      const newSet = new Set(prev)
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId)
      } else {
        newSet.add(exerciseId)
      }
      return newSet
    })
  }

  // Filter exercises based on category (if specified)
  const categoryExercises = useMemo(() => {
    if (category && CATEGORY_DISPLAY_NAMES[category]) {
      return exercises.filter(exercise => exercise.category === category)
    }
    return exercises
  }, [category])

  // Further filter based on search and filters
  const filteredExercises = useMemo(() => {
    return categoryExercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty.toLowerCase() === selectedDifficulty
      const matchesAge = selectedAgeGroup === 'all' || exercise.ageGroup.includes(selectedAgeGroup)
      
      return matchesSearch && matchesDifficulty && matchesAge
    })
  }, [categoryExercises, searchTerm, selectedDifficulty, selectedAgeGroup])

  // Separate completed and active exercises
  const activeExercises = filteredExercises.filter(exercise => !completedExercises.has(exercise.id))
  const completedExercisesList = filteredExercises.filter(exercise => completedExercises.has(exercise.id))

  const pageTitle = category ? CATEGORY_DISPLAY_NAMES[category] : 'All Exercises'
  const pageDescription = category ? 
    `Explore ${CATEGORY_DISPLAY_NAMES[category].toLowerCase()} exercises designed to help children develop and have fun!` :
    'Discover our complete collection of fun, safe exercises designed for children of all ages and abilities.'

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <section className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bubble text-gray-900 dark:text-white mb-4">
              {pageTitle}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {pageDescription}
            </p>
            {category && (
              <Badge className={`mt-4 text-sm ${getCategoryColor(category)}`}>
                {CATEGORY_DISPLAY_NAMES[category]} Category
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Search exercises"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Filter by difficulty"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <select
                value={selectedAgeGroup}
                onChange={(e) => setSelectedAgeGroup(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Filter by age group"
              >
                <option value="all">All Ages</option>
                <option value="3-5">Ages 3-5</option>
                <option value="6-8">Ages 6-8</option>
                <option value="9-12">Ages 9-12</option>
              </select>
            </div>
          </div>

          {/* Results count and toggle */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-muted-foreground">
              Showing {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''}
              {category && ` in ${CATEGORY_DISPLAY_NAMES[category]}`}
              {completedExercises.size > 0 && (
                <span className="ml-2 text-green-600 dark:text-green-400">
                  • {completedExercises.size} completed
                </span>
              )}
            </p>
            
            {completedExercises.size > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCompleted(!showCompleted)}
                className="ml-4"
              >
                {showCompleted ? 'Hide' : 'Show'} All Done Zone ({completedExercises.size})
              </Button>
            )}
          </div>

          {/* Active Exercises */}
          {activeExercises.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bubble text-gray-900 dark:text-white mb-4">
                Available Exercises
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeExercises.map((exercise) => (
                  <ExerciseCard 
                    key={exercise.id} 
                    exercise={exercise} 
                    isCompleted={false}
                    onToggleCompletion={() => toggleExerciseCompletion(exercise.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Done Zone */}
          {showCompleted && completedExercisesList.length > 0 && (
            <div className="mb-8">
              <div className="bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
                  <h3 className="text-xl font-bubble text-green-800 dark:text-green-200">
                    All Done Zone! 🎉
                  </h3>
                </div>
                <p className="text-green-700 dark:text-green-300 mb-4">
                  Great job! You've completed {completedExercisesList.length} exercise{completedExercisesList.length !== 1 ? 's' : ''}. 
                  Keep up the amazing work!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedExercisesList.map((exercise) => (
                    <ExerciseCard 
                      key={exercise.id} 
                      exercise={exercise} 
                      isCompleted={true}
                      onToggleCompletion={() => toggleExerciseCompletion(exercise.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* No results */}
          {filteredExercises.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No exercises found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button onClick={() => {
                setSearchTerm('')
                setSelectedDifficulty('all')
                setSelectedAgeGroup('all')
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// Exercise Card Component
interface ExerciseCardProps {
  exercise: typeof exercises[0]
  isCompleted: boolean
  onToggleCompletion: () => void
}

function ExerciseCard({ exercise, isCompleted, onToggleCompletion }: ExerciseCardProps) {
  return (
    <Card className={`hover:shadow-lg transition-all duration-300 h-full ${
      isCompleted ? 'opacity-75 bg-green-50 dark:bg-green-950' : ''
    }`}>
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={onToggleCompletion}
              className="mt-1 text-2xl hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              aria-label={isCompleted ? 'Mark as not completed' : 'Mark as completed'}
            >
              {isCompleted ? (
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              ) : (
                <Circle className="h-6 w-6 text-gray-400 dark:text-gray-500 hover:text-primary" />
              )}
            </button>
            <div className="flex-1">
              <CardTitle className={`text-xl font-bubble ${
                isCompleted 
                  ? 'text-green-800 dark:text-green-200 line-through' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {exercise.name}
              </CardTitle>
            </div>
          </div>
          <Badge className={getDifficultyColor(exercise.difficulty)}>
            {exercise.difficulty}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={getCategoryColor(exercise.category)}>
            {CATEGORY_DISPLAY_NAMES[exercise.category as ExerciseCategory]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className={`text-sm ${
          isCompleted ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground'
        }`}>
          {exercise.description}
        </CardDescription>

        {/* Exercise Details */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{formatDuration(exercise.duration)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs">{exercise.ageGroup}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs">{exercise.difficulty}</span>
          </div>
        </div>

        {/* Benefits */}
        {exercise.benefits && exercise.benefits.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Benefits:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              {exercise.benefits.slice(0, 3).map((benefit, index) => (
                <li key={index} className="flex items-start space-x-1">
                  <span className="text-primary">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Equipment */}
        {exercise.equipment && exercise.equipment.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Equipment:</h4>
            <div className="flex flex-wrap gap-1">
              {exercise.equipment.map((item, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Button 
          className="w-full" 
          size="sm"
          variant={isCompleted ? "outline" : "default"}
        >
          {isCompleted ? 'Completed! View Instructions' : 'View Instructions'}
        </Button>
      </CardContent>
    </Card>
  )
}