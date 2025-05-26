import { useQuery } from "@tanstack/react-query";
import { Exercise } from "@shared/schema";
import { ExerciseCard } from "../components/exercise-card";
import { VideoPlayerModal } from "../components/video-player-modal";
import { CompletionModal } from "../components/completion-modal";
import { useState, useEffect } from "react";
import { Plus, Star, Edit3, Save, X, Trash2, ArrowLeft, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProgramsPage() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingProgram, setEditingProgram] = useState<number | null>(null);
  const [activeProgram, setActiveProgram] = useState<any>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: ['/api/exercises'],
  });

  const handlePlayVideo = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowVideoModal(true);
  };

  const handleCompleteExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowCompletionModal(true);
  };

  const startProgram = (program: any) => {
    const programExercises = getProgramExercises(program);
    if (programExercises.length > 0) {
      setActiveProgram({ ...program, exercises: programExercises });
      setCurrentExerciseIndex(0);
    }
  };

  const handleProgramNext = () => {
    if (activeProgram && currentExerciseIndex < activeProgram.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const handleProgramPrevious = () => {
    if (activeProgram && currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const exitProgram = () => {
    setActiveProgram(null);
    setCurrentExerciseIndex(0);
  };

  // Pre-made program definitions
  const [programs, setPrograms] = useState([
    {
      id: 1,
      title: "Animal Adventures",
      description: "Jump like a kangaroo, balance like a flamingo, and roar like a lion!",
      icon: "🦘",
      color: "from-orange-400 to-red-500",
      exerciseIds: [] as number[]
    },
    {
      id: 2,
      title: "Balance Masters",
      description: "Develop amazing balance and coordination skills",
      icon: "⚖️",
      color: "from-blue-400 to-purple-500",
      exerciseIds: [] as number[]
    },
    {
      id: 3,
      title: "Strength Heroes",
      description: "Build strength through fun, engaging movements",
      icon: "💪",
      color: "from-green-400 to-emerald-500",
      exerciseIds: [] as number[]
    },
  ]);

  // Initialize programs with exercises when exercises are loaded
  useEffect(() => {
    if (exercises.length > 0) {
      setPrograms(prev => prev.map(program => {
        if (program.exerciseIds.length === 0) {
          if (program.id === 1) {
            // Animal Adventures
            return {
              ...program,
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
            };
          } else if (program.id === 2) {
            // Balance Masters
            return {
              ...program,
              exerciseIds: exercises.filter(ex => ex.category === 'Balance').map(ex => ex.id)
            };
          } else if (program.id === 3) {
            // Strength Heroes
            return {
              ...program,
              exerciseIds: exercises.filter(ex => ex.category === 'Strength').map(ex => ex.id)
            };
          }
        }
        return program;
      }));
    }
  }, [exercises]);

  // Get exercises for a program based on their IDs
  const getProgramExercises = (program: any) => {
    return exercises.filter(ex => program.exerciseIds.includes(ex.id));
  };

  const addExerciseToProgram = (programId: number, exerciseId: number) => {
    setPrograms(prev => prev.map(program => 
      program.id === programId 
        ? { ...program, exerciseIds: [...program.exerciseIds, exerciseId] }
        : program
    ));
  };

  const removeExerciseFromProgram = (programId: number, exerciseId: number) => {
    setPrograms(prev => prev.map(program => 
      program.id === programId 
        ? { ...program, exerciseIds: program.exerciseIds.filter(id => id !== exerciseId) }
        : program
    ));
  };

  const updateProgram = (id: number, field: string, value: string) => {
    setPrograms(prev => prev.map(program => 
      program.id === id ? { ...program, [field]: value } : program
    ));
  };

  // Show workout screen when a program is active
  if (activeProgram) {
    const currentExercise = activeProgram.exercises[currentExerciseIndex];
    const isFirst = currentExerciseIndex === 0;
    const isLast = currentExerciseIndex === activeProgram.exercises.length - 1;

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={exitProgram} variant="ghost" className="p-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bubble text-gray-800">{activeProgram.title}</h1>
            <p className="text-sm text-gray-600">
              Exercise {currentExerciseIndex + 1} of {activeProgram.exercises.length}
            </p>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentExerciseIndex + 1) / activeProgram.exercises.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Exercise Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bubble text-gray-800 mb-2">{currentExercise.name}</h2>
            <p className="text-gray-600 text-lg">{currentExercise.description}</p>
            <div className="inline-block bg-purple-100 px-4 py-2 rounded-full mt-4">
              <span className="text-purple-700 font-bold">{currentExercise.duration}</span>
            </div>
          </div>

          {/* Play Button */}
          <div className="text-center mb-6">
            <Button
              onClick={() => handlePlayVideo(currentExercise)}
              className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-8 py-4 rounded-2xl text-lg font-bubble shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              <Play className="h-6 w-6 mr-2" />
              Play Exercise
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handleProgramPrevious}
            disabled={isFirst}
            variant="outline"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl"
          >
            <ChevronLeft className="h-5 w-5" />
            Previous
          </Button>

          <Button
            onClick={() => handleCompleteExercise(currentExercise)}
            className="bg-emerald-400 text-white px-8 py-3 rounded-2xl font-bubble shadow-lg hover:bg-emerald-300 transform hover:scale-105 transition-all"
          >
            Mark Complete
          </Button>

          <Button
            onClick={handleProgramNext}
            disabled={isLast}
            variant="outline"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl"
          >
            Next
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Exercise List */}
        <div className="mt-8 bg-white rounded-3xl shadow-xl p-6">
          <h3 className="text-xl font-bubble text-gray-800 mb-4">Program Exercises</h3>
          <div className="space-y-3">
            {activeProgram.exercises.map((exercise: Exercise, index: number) => (
              <div
                key={exercise.id}
                className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                  index === currentExerciseIndex 
                    ? 'bg-purple-100 border-2 border-purple-300' 
                    : index < currentExerciseIndex 
                      ? 'bg-emerald-100 border-2 border-emerald-300'
                      : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === currentExerciseIndex 
                      ? 'bg-purple-500 text-white' 
                      : index < currentExerciseIndex 
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index < currentExerciseIndex ? '✓' : index + 1}
                  </div>
                  <div>
                    <p className="font-bubble text-gray-800">{exercise.name}</p>
                    <p className="text-sm text-gray-600">{exercise.duration}</p>
                  </div>
                </div>
                {index === currentExerciseIndex && (
                  <span className="text-purple-600 font-bold text-sm">Current</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modals */}
        <VideoPlayerModal
          isOpen={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          exercise={selectedExercise}
          onNext={handleProgramNext}
          onPrevious={handleProgramPrevious}
          hasNext={!isLast}
          hasPrevious={!isFirst}
        />

        <CompletionModal
          isOpen={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          exercise={selectedExercise}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Done for you programs Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">✨</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bubble text-gray-800">Done for you programs</h1>
            <Button
              onClick={() => setEditMode(!editMode)}
              variant={editMode ? "destructive" : "outline"}
              size="sm"
              className="ml-4"
            >
              {editMode ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </div>
          <p className="text-lg text-gray-600 font-rounded font-bold max-w-2xl mx-auto">
            {editMode ? "Click on any program to edit its title, description, or icon" : "Ready-made exercise programs designed to train specific areas and skills. Just pick and play!"}
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div 
              key={program.id} 
              className={`bg-white/90 backdrop-blur-md rounded-3xl border-4 border-purple-100 shadow-xl overflow-hidden transition-all duration-300 ${editMode ? 'ring-4 ring-blue-400 cursor-pointer hover:ring-blue-500' : ''}`}
              onClick={() => editMode && setEditingProgram(program.id)}
            >
              <div className={`bg-gradient-to-br ${program.color} p-6 text-white`}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    {editMode && editingProgram === program.id ? (
                      <Input
                        value={program.icon}
                        onChange={(e) => updateProgram(program.id, 'icon', e.target.value)}
                        className="w-10 h-10 text-center bg-transparent border-none text-white text-xl"
                        maxLength={2}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="text-2xl">{program.icon}</span>
                    )}
                  </div>
                  {editMode && editingProgram === program.id ? (
                    <Input
                      value={program.title}
                      onChange={(e) => updateProgram(program.id, 'title', e.target.value)}
                      className="flex-1 bg-white/20 border-white/30 text-white placeholder-white/70 font-bubble"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <h3 className="text-xl font-bubble">{program.title}</h3>
                  )}
                </div>
                {editMode && editingProgram === program.id ? (
                  <div className="space-y-3">
                    <Input
                      value={program.description}
                      onChange={(e) => updateProgram(program.id, 'description', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder-white/70 font-rounded"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProgram(null);
                      }}
                      size="sm"
                      variant="secondary"
                      className="mt-2"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <p className="text-white/90 font-rounded font-bold">{program.description}</p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-white/80 font-rounded font-bold">
                    {getProgramExercises(program).length} exercises
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  </div>
                </div>
              </div>
              
              {/* Exercise Preview */}
              <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
                {getProgramExercises(program).slice(0, 3).map((exercise) => (
                  <div key={exercise.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-sm">🎯</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bubble text-gray-800">{exercise.name}</p>
                        <p className="text-xs text-gray-500 font-rounded">{exercise.duration}</p>
                      </div>
                    </div>
                    {editMode && editingProgram === program.id && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExerciseFromProgram(program.id, exercise.id);
                        }}
                        size="sm"
                        variant="destructive"
                        className="h-6 w-6 p-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
                
                {/* Add Exercise Section */}
                {editMode && editingProgram === program.id && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-xl border-2 border-dashed border-blue-200">
                    <div className="flex items-center gap-2">
                      <Select onValueChange={(value) => addExerciseToProgram(program.id, parseInt(value))}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Add an exercise" />
                        </SelectTrigger>
                        <SelectContent>
                          {exercises
                            .filter(ex => !program.exerciseIds.includes(ex.id))
                            .map((exercise) => (
                            <SelectItem key={exercise.id} value={exercise.id.toString()}>
                              {exercise.name} ({exercise.category})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Plus className="h-4 w-4 text-blue-500" />
                    </div>
                  </div>
                )}
                
                {getProgramExercises(program).length > 3 && (
                  <div className="text-center py-2">
                    <span className="text-sm text-gray-500 font-rounded font-bold">
                      +{getProgramExercises(program).length - 3} more exercises
                    </span>
                  </div>
                )}
              </div>
              
              {/* Action Button */}
              <div className="p-4 pt-0">
                <button 
                  onClick={() => startProgram(program)}
                  className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white py-3 rounded-2xl font-bubble text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Start Program
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* "Or Choose your adventure" Section */}
        <div className="text-center space-y-6 py-12">
          <div className="flex items-center justify-center space-x-3">
            <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent flex-1"></div>
            <span className="text-2xl font-bubble text-gray-600 px-4">Or</span>
            <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent flex-1"></div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bubble text-gray-800">Choose your adventure</h2>
            <p className="text-lg text-gray-600 font-rounded font-bold max-w-xl mx-auto">
              Want to create your own custom program? Explore all exercises and build something unique!
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <Link href="/search">
              <button className="bg-white/90 text-cyan-700 px-8 py-4 rounded-2xl text-lg font-bubble shadow-xl hover:bg-white transform hover:scale-105 transition-all border-4 border-cyan-200">
                🔍 Browse All Exercises
              </button>
            </Link>
            <Link href="/playlist">
              <button className="bg-yellow-400 text-cyan-800 px-8 py-4 rounded-2xl text-lg font-bubble shadow-xl hover:bg-yellow-300 transform hover:scale-105 transition-all flex items-center gap-2 border-4 border-yellow-300">
                <Plus className="w-5 h-5" />
                Build Custom Program
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      <VideoPlayerModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        exercise={selectedExercise}
      />

      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        exercise={selectedExercise}
      />
    </div>
  );
}