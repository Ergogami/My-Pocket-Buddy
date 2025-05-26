import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Play, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Exercise, Playlist } from "@shared/schema";
import { useLocation } from "wouter";
import { VideoPlayerModal } from "@/components/video-player-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface CategoryPageProps {
  category: string;
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const [, setLocation] = useLocation();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const { toast } = useToast();

  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  const { data: activePlaylist } = useQuery<Playlist>({
    queryKey: ["/api/playlists/active"],
  });

  const categoryExercises = exercises.filter(exercise => exercise.category === category);

  const addToPlaylistMutation = useMutation({
    mutationFn: async (exerciseId: number) => {
      if (!activePlaylist) {
        throw new Error("No active playlist found");
      }
      const currentExercises = activePlaylist.exerciseIds || [];
      if (currentExercises.includes(exerciseId)) {
        throw new Error("Exercise already in playlist");
      }
      const updatedExercises = [...currentExercises, exerciseId];
      
      const response = await fetch(`/api/playlists/${activePlaylist.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exerciseIds: updatedExercises }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update playlist");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists/active"] });
      toast({
        title: "Added to playlist!",
        description: "Exercise added to your workout playlist.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add exercise to playlist",
        variant: "destructive",
      });
    },
  });

  const handlePlayVideo = (exercise: Exercise) => {
    const exerciseIndex = categoryExercises.findIndex(ex => ex.id === exercise.id);
    setSelectedExercise(exercise);
    setCurrentVideoIndex(exerciseIndex);
    setShowVideoModal(true);
  };

  const handleNextExercise = () => {
    if (currentVideoIndex < categoryExercises.length - 1) {
      const nextIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(nextIndex);
      setSelectedExercise(categoryExercises[nextIndex]);
    }
  };

  const handlePreviousExercise = () => {
    if (currentVideoIndex > 0) {
      const prevIndex = currentVideoIndex - 1;
      setCurrentVideoIndex(prevIndex);
      setSelectedExercise(categoryExercises[prevIndex]);
    }
  };

  const handleAddToPlaylist = (exerciseId: number) => {
    addToPlaylistMutation.mutate(exerciseId);
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
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      onClick={() => handlePlayVideo(exercise)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Play
                    </Button>
                    <Button
                      onClick={() => handleAddToPlaylist(exercise.id)}
                      disabled={addToPlaylistMutation.isPending}
                      size="sm"
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-2"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add to Playlist
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
        onNext={handleNextExercise}
        onPrevious={handlePreviousExercise}
        hasNext={currentVideoIndex < categoryExercises.length - 1}
        hasPrevious={currentVideoIndex > 0}
      />
    </div>
  );
}