import { useState } from 'react'
import { Clock, Users, Target, Play, CheckCircle, Circle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { programs } from '@/data/programs'
import { formatDuration, getDifficultyColor } from '@/lib/utils'

export default function ProgramsPage() {
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null)
  const [completedPrograms, setCompletedPrograms] = useState<Set<number>>(new Set())
  const [showCompleted, setShowCompleted] = useState(false)

  const toggleProgramCompletion = (programId: number) => {
    setCompletedPrograms(prev => {
      const newSet = new Set(prev)
      if (newSet.has(programId)) {
        newSet.delete(programId)
      } else {
        newSet.add(programId)
      }
      return newSet
    })
  }

  const activePrograms = programs.filter(program => !completedPrograms.has(program.id))
  const completedProgramsList = programs.filter(program => completedPrograms.has(program.id))

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <section className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bubble text-gray-900 dark:text-white mb-4">
              Exercise Programs
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Structured workout programs designed to help children develop specific skills through fun, engaging activities. 
              Each program combines multiple exercises for a complete fitness experience.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Results and toggle */}
          <div className="mb-8 flex justify-between items-center">
            <p className="text-muted-foreground">
              {programs.length} program{programs.length !== 1 ? 's' : ''} available
              {completedPrograms.size > 0 && (
                <span className="ml-2 text-green-600 dark:text-green-400">
                  • {completedPrograms.size} completed
                </span>
              )}
            </p>
            
            {completedPrograms.size > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCompleted(!showCompleted)}
              >
                {showCompleted ? 'Hide' : 'Show'} All Done Zone ({completedPrograms.size})
              </Button>
            )}
          </div>

          {/* Active Programs */}
          {activePrograms.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bubble text-gray-900 dark:text-white mb-4">
                Available Programs
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {activePrograms.map((program) => (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    isCompleted={false}
                    isSelected={selectedProgram === program.id}
                    onSelect={() => setSelectedProgram(selectedProgram === program.id ? null : program.id)}
                    onToggleCompletion={() => toggleProgramCompletion(program.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Done Zone */}
          {showCompleted && completedProgramsList.length > 0 && (
            <div className="mb-8">
              <div className="bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
                  <h3 className="text-xl font-bubble text-green-800 dark:text-green-200">
                    All Done Zone! 🎉
                  </h3>
                </div>
                <p className="text-green-700 dark:text-green-300 mb-4">
                  Fantastic! You've completed {completedProgramsList.length} program{completedProgramsList.length !== 1 ? 's' : ''}. 
                  You're building amazing healthy habits!
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {completedProgramsList.map((program) => (
                    <ProgramCard
                      key={program.id}
                      program={program}
                      isCompleted={true}
                      isSelected={selectedProgram === program.id}
                      onSelect={() => setSelectedProgram(selectedProgram === program.id ? null : program.id)}
                      onToggleCompletion={() => toggleProgramCompletion(program.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bubble text-gray-900 dark:text-white mb-4">
              Program Benefits
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our structured programs offer targeted development and progressive skill building.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Structured Learning</h3>
              <p className="text-sm text-muted-foreground">
                Carefully sequenced exercises that build upon each other for optimal skill development.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Time Efficient</h3>
              <p className="text-sm text-muted-foreground">
                Complete workouts in 10-20 minutes, perfect for busy family schedules.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Age Appropriate</h3>
              <p className="text-sm text-muted-foreground">
                Programs designed specifically for different developmental stages and abilities.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-6 w-6 text-orange-600 dark:text-orange-300" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Progressive</h3>
              <p className="text-sm text-muted-foreground">
                Programs gradually increase in complexity to challenge and engage children.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Program Card Component
interface ProgramCardProps {
  program: typeof programs[0]
  isCompleted: boolean
  isSelected: boolean
  onSelect: () => void
  onToggleCompletion: () => void
}

function ProgramCard({ program, isCompleted, isSelected, onSelect, onToggleCompletion }: ProgramCardProps) {
  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-300 cursor-pointer h-full ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${isCompleted ? 'opacity-75 bg-green-50 dark:bg-green-950' : ''}`}
      onClick={onSelect}
    >
      <CardHeader>
        <div className="flex items-start space-x-3 mb-4">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleCompletion()
            }}
            className="mt-1 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label={isCompleted ? 'Mark as not completed' : 'Mark as completed'}
          >
            {isCompleted ? (
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            ) : (
              <Circle className="h-6 w-6 text-gray-400 dark:text-gray-500 hover:text-primary" />
            )}
          </button>
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${program.color} flex items-center justify-center text-2xl`}>
            {program.icon}
          </div>
        </div>
        
        <CardTitle className={`text-xl font-bubble ${
          isCompleted 
            ? 'text-green-800 dark:text-green-200 line-through' 
            : 'text-gray-900 dark:text-white'
        }`}>
          {program.title}
        </CardTitle>
        <CardDescription className={`text-sm ${
          isCompleted ? 'text-green-700 dark:text-green-300' : ''
        }`}>
          {program.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Program Details */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{formatDuration(program.duration * 60)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs">{program.ageGroup}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="h-4 w-4 text-muted-foreground" />
            <Badge className={getDifficultyColor(program.difficulty)}>
              {program.difficulty}
            </Badge>
          </div>
        </div>

        {/* Exercise Count */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {program.exercises.length} exercise{program.exercises.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Expanded Content */}
        {isSelected && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Included Exercises:</h4>
            <div className="space-y-2">
              {program.exercises.map((exercise, index) => (
                <div key={exercise.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{exercise.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDuration(exercise.duration)} • {exercise.difficulty}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button 
          className="w-full" 
          size="sm"
          variant={isCompleted ? "outline" : "default"}
          onClick={(e) => e.stopPropagation()}
        >
          <Play className="mr-2 h-4 w-4" />
          {isCompleted ? 'Completed! Start Again' : 'Start Program'}
        </Button>
      </CardContent>
    </Card>
  )
}
