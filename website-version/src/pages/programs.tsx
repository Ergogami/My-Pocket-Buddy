import { useState } from 'react'
import { Clock, Users, Target, Play } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { programs } from '@/data/programs'
import { formatDuration, getDifficultyColor } from '@/lib/utils'

export default function ProgramsPage() {
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null)

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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {programs.map((program) => (
              <Card 
                key={program.id} 
                className={`hover:shadow-lg transition-all duration-300 cursor-pointer h-full ${
                  selectedProgram === program.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedProgram(selectedProgram === program.id ? null : program.id)}
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${program.color} flex items-center justify-center text-2xl mb-4`}>
                    {program.icon}
                  </div>
                  <CardTitle className="text-xl font-bubble text-gray-900 dark:text-white">
                    {program.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
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
                  {selectedProgram === program.id && (
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

                  <Button className="w-full" size="sm">
                    <Play className="mr-2 h-4 w-4" />
                    Start Program
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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