import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Clock, CheckCircle, Circle, Trash2, GripVertical } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { exercises } from '@/data/exercises'
import { CATEGORY_DISPLAY_NAMES, type ExerciseCategory } from '@/lib/types'
import { formatDuration, getDifficultyColor, getCategoryColor } from '@/lib/utils'

// Sample playlist data - in a real app this would come from state management
const initialPlaylist = [
  exercises.find(ex => ex.id === 1)!,
  exercises.find(ex => ex.id === 3)!,
  exercises.find(ex => ex.id === 5)!,
  exercises.find(ex => ex.id === 7)!,
  exercises.find(ex => ex.id === 9)!,
]

export default function PlaylistPage() {
  const [playlistExercises, setPlaylistExercises] = useState(initialPlaylist)
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set())
  const [draggedOverZone, setDraggedOverZone] = useState<'playlist' | 'completed' | null>(null)

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

  const removeFromPlaylist = (exerciseId: number) => {
    setPlaylistExercises(prev => prev.filter(ex => ex.id !== exerciseId))
    setCompletedExercises(prev => {
      const newSet = new Set(prev)
      newSet.delete(exerciseId)
      return newSet
    })
  }

  const onDragEnd = (result: DropResult) => {
    setDraggedOverZone(null)
    
    if (!result.destination) {
      return
    }

    const sourceId = result.draggableId
    const exerciseId = parseInt(sourceId.replace('exercise-', ''))
    
    // If dropped in the completed zone, mark as completed
    if (result.destination.droppableId === 'completed-zone') {
      setCompletedExercises(prev => new Set([...prev, exerciseId]))
      return
    }

    // If dropped back in playlist zone, mark as not completed
    if (result.destination.droppableId === 'playlist-zone') {
      setCompletedExercises(prev => {
        const newSet = new Set(prev)
        newSet.delete(exerciseId)
        return newSet
      })
      return
    }

    // Handle reordering within playlist
    if (result.source.droppableId === 'playlist-zone' && result.destination.droppableId === 'playlist-zone') {
      const items = Array.from(playlistExercises)
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(result.destination.index, 0, reorderedItem)
      setPlaylistExercises(items)
    }
  }

  const onDragUpdate = (update: any) => {
    if (update.destination?.droppableId === 'completed-zone') {
      setDraggedOverZone('completed')
    } else if (update.destination?.droppableId === 'playlist-zone') {
      setDraggedOverZone('playlist')
    } else {
      setDraggedOverZone(null)
    }
  }

  const activeExercises = playlistExercises.filter(exercise => !completedExercises.has(exercise.id))
  const completedExercisesList = playlistExercises.filter(exercise => completedExercises.has(exercise.id))

  const totalDuration = playlistExercises.reduce((sum, ex) => sum + ex.duration, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bubble mb-4">My Workout Playlist</h1>
            <p className="text-xl mb-6 text-white/90">
              Drag exercises to the All Done Zone when you complete them!
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <span className="font-semibold">{playlistExercises.length} exercises</span>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <span className="font-semibold">{formatDuration(totalDuration)} total</span>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <span className="font-semibold">{completedExercises.size} completed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Active Playlist */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bubble text-gray-900 dark:text-white">
                    Active Exercises
                  </h3>
                  <p className="text-muted-foreground">
                    Drag to reorder or move to All Done Zone
                  </p>
                </div>

                <Droppable droppableId="playlist-zone">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-4 min-h-32 p-4 rounded-xl border-2 border-dashed transition-all ${
                        snapshot.isDraggingOver || draggedOverZone === 'playlist'
                          ? 'border-blue-400 bg-blue-50 dark:bg-blue-950'
                          : 'border-gray-300 bg-gray-50/50 dark:bg-gray-800/50'
                      }`}
                    >
                      {activeExercises.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-4xl mb-2">🎉</div>
                          <p className="text-gray-500">All exercises completed! Great job!</p>
                        </div>
                      ) : (
                        activeExercises.map((exercise, index) => (
                          <Draggable
                            key={exercise.id}
                            draggableId={`exercise-${exercise.id}`}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`transition-all ${
                                  snapshot.isDragging ? 'rotate-2 scale-105 shadow-xl' : ''
                                }`}
                              >
                                <PlaylistExerciseCard
                                  exercise={exercise}
                                  isCompleted={false}
                                  isDragging={snapshot.isDragging}
                                  dragHandleProps={provided.dragHandleProps}
                                  onToggleCompletion={() => toggleExerciseCompletion(exercise.id)}
                                  onRemove={() => removeFromPlaylist(exercise.id)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* All Done Zone */}
              <div className="lg:col-span-1">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bubble text-green-800 dark:text-green-200">
                    All Done Zone! 🎉
                  </h3>
                </div>

                <Droppable droppableId="completed-zone">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-96 p-6 rounded-xl border-2 border-dashed transition-all ${
                        snapshot.isDraggingOver || draggedOverZone === 'completed'
                          ? 'border-green-400 bg-green-100 dark:bg-green-950 scale-105'
                          : 'border-green-300 bg-green-50 dark:bg-green-900/20'
                      }`}
                    >
                      <div className="text-center mb-4">
                        <div className="text-3xl mb-2">🎯</div>
                        <p className="text-green-700 dark:text-green-300 font-semibold">
                          Drop completed exercises here!
                        </p>
                      </div>

                      <div className="space-y-3">
                        {completedExercisesList.map((exercise, index) => (
                          <Draggable
                            key={exercise.id}
                            draggableId={`exercise-${exercise.id}`}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`transition-all ${
                                  snapshot.isDragging ? 'rotate-2 scale-105 shadow-xl' : ''
                                }`}
                              >
                                <PlaylistExerciseCard
                                  exercise={exercise}
                                  isCompleted={true}
                                  isDragging={snapshot.isDragging}
                                  dragHandleProps={provided.dragHandleProps}
                                  onToggleCompletion={() => toggleExerciseCompletion(exercise.id)}
                                  onRemove={() => removeFromPlaylist(exercise.id)}
                                  compact={true}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {completedExercises.size > 0 && (
                  <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 rounded-xl text-center">
                    <p className="text-green-800 dark:text-green-200 font-semibold">
                      Great progress! You've completed {completedExercises.size} out of {playlistExercises.length} exercises.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </DragDropContext>
    </div>
  )
}

// Playlist Exercise Card Component
interface PlaylistExerciseCardProps {
  exercise: typeof exercises[0]
  isCompleted: boolean
  isDragging: boolean
  dragHandleProps: any
  onToggleCompletion: () => void
  onRemove: () => void
  compact?: boolean
}

function PlaylistExerciseCard({ 
  exercise, 
  isCompleted, 
  isDragging,
  dragHandleProps,
  onToggleCompletion, 
  onRemove,
  compact = false
}: PlaylistExerciseCardProps) {
  return (
    <Card className={`transition-all duration-300 ${
      isCompleted ? 'bg-green-50 dark:bg-green-950 opacity-90' : 'bg-white dark:bg-gray-800'
    } ${isDragging ? 'shadow-2xl ring-2 ring-blue-400' : 'hover:shadow-lg'}
    ${compact ? 'p-2' : ''}`}>
      <CardHeader className={compact ? 'p-3' : ''}>
        <div className="flex items-start space-x-3">
          {/* Drag Handle */}
          <div
            {...dragHandleProps}
            className="mt-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>

          {/* Checkbox */}
          <button
            onClick={onToggleCompletion}
            className="mt-1 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label={isCompleted ? 'Mark as not completed' : 'Mark as completed'}
          >
            {isCompleted ? (
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-primary" />
            )}
          </button>

          {/* Exercise Info */}
          <div className="flex-1 min-w-0">
            <CardTitle className={`${compact ? 'text-sm' : 'text-lg'} font-bubble ${
              isCompleted 
                ? 'text-green-800 dark:text-green-200 line-through' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {exercise.name}
            </CardTitle>
            
            {!compact && (
              <CardDescription className={`text-xs mt-1 ${
                isCompleted ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground'
              }`}>
                {exercise.description}
              </CardDescription>
            )}

            <div className="flex items-center space-x-3 mt-2 text-xs">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{formatDuration(exercise.duration)}</span>
              </div>
              <Badge variant="outline" className={`text-xs ${getCategoryColor(exercise.category)}`}>
                {CATEGORY_DISPLAY_NAMES[exercise.category as ExerciseCategory]}
              </Badge>
              <Badge className={`text-xs ${getDifficultyColor(exercise.difficulty)}`}>
                {exercise.difficulty}
              </Badge>
            </div>
          </div>

          {/* Remove Button */}
          <button
            onClick={onRemove}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            aria-label="Remove from playlist"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
    </Card>
  )
}