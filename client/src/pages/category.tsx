import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Play, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Exercise } from "@shared/schema";
import { useLocation } from "wouter";
import { VideoPlayerModal } from "@/components/video-player-modal";

interface CategoryPageProps {
  category: string;
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const [, setLocation] = useLocation();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  const categoryExercises = exercises.filter(exercise => exercise.category === category);

  const handlePlayVideo = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowVideoModal(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Balance": return "from-sky-400 to-sky-600";
      case "Strength": return "from-red-400 to-red-600";
      case "Ball Skills": return "from-orange-400 to-orange-600";
      case "Coordination": return "from-teal-400 to-teal-600";
      case "Flexibility": return "from-purple-400 to-purple-600";
      case "Cardio": return "from-yellow-400 to-yellow-600";
      default: return "from-blue-400 to-blue-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2 rounded-full bg-gray-100"
          onClick={() => setLocation("/search")}
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Button>
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-gray-800">{category.toUpperCase()}</h1>
        </div>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Category Hero */}
      <div className={`bg-gradient-to-r ${getCategoryColor(category)} p-6 text-white`}>
        <h2 className="text-2xl font-bold text-center">{category} Exercises</h2>
        <p className="text-center mt-2 opacity-90">
          {categoryExercises.length} exercises to improve your {category.toLowerCase()} skills
        </p>
      </div>

      {/* Exercises List */}
      <div className="px-4 py-6">
        {categoryExercises.length > 0 ? (
          <div className="space-y-4">
            {categoryExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg mb-2">{exercise.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">{exercise.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <span className="font-medium">Duration:</span>
                        <span className="ml-1">{exercise.duration}</span>
                      </span>
                      <span className="flex items-center">
                        <span className="font-medium">Ages:</span>
                        <span className="ml-1">{exercise.ageGroups.join(", ")}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      onClick={() => handlePlayVideo(exercise)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Play
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2"
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No exercises found for {category}</p>
            <p className="text-gray-400 text-sm mt-2">Check back soon for new exercises!</p>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        exercise={selectedExercise}
      />
    </div>
  );
}