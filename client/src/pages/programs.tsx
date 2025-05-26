import { useQuery } from "@tanstack/react-query";
import { Exercise } from "@shared/schema";
import { ExerciseCard } from "../components/exercise-card";
import { VideoPlayerModal } from "../components/video-player-modal";
import { CompletionModal } from "../components/completion-modal";
import { useState } from "react";
import { Plus, Star, Edit3, Save, X } from "lucide-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProgramsPage() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingProgram, setEditingProgram] = useState<number | null>(null);

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

  // Pre-made program definitions
  const [programs, setPrograms] = useState([
    {
      id: 1,
      title: "Animal Adventures",
      description: "Jump like a kangaroo, balance like a flamingo, and roar like a lion!",
      icon: "🦘",
      color: "from-orange-400 to-red-500",
      exercises: exercises.filter(ex => 
        ex.name.toLowerCase().includes('animal') ||
        ex.name.toLowerCase().includes('kangaroo') ||
        ex.name.toLowerCase().includes('flamingo') ||
        ex.name.toLowerCase().includes('lion') ||
        ex.name.toLowerCase().includes('dolphin') ||
        ex.name.toLowerCase().includes('kneeling')
      )
    },
    {
      id: 2,
      title: "Balance Masters",
      description: "Develop amazing balance and coordination skills",
      icon: "⚖️",
      color: "from-blue-400 to-purple-500",
      exercises: exercises.filter(ex => ex.category === 'Balance')
    },
    {
      id: 3,
      title: "Strength Heroes",
      description: "Build strength through fun, engaging movements",
      icon: "💪",
      color: "from-green-400 to-emerald-500",
      exercises: exercises.filter(ex => ex.category === 'Strength')
    },
  ]);

  const updateProgram = (id: number, field: string, value: string) => {
    setPrograms(prev => prev.map(program => 
      program.id === id ? { ...program, [field]: value } : program
    ));
  };

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
                    {program.exercises.length} exercises
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
                {program.exercises.slice(0, 3).map((exercise) => (
                  <div key={exercise.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-sm">🎯</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bubble text-gray-800">{exercise.name}</p>
                      <p className="text-xs text-gray-500 font-rounded">{exercise.duration}</p>
                    </div>
                  </div>
                ))}
                {program.exercises.length > 3 && (
                  <div className="text-center py-2">
                    <span className="text-sm text-gray-500 font-rounded font-bold">
                      +{program.exercises.length - 3} more exercises
                    </span>
                  </div>
                )}
              </div>
              
              {/* Action Button */}
              <div className="p-4 pt-0">
                <button className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white py-3 rounded-2xl font-bubble text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
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