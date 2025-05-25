import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Play, X, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoPlayerModal } from "@/components/video-player-modal";
import { CompletionModal } from "@/components/completion-modal";
import { Exercise, Playlist } from "@shared/schema";
import { useSwipe } from "@/hooks/use-swipe";
import { Link } from "wouter";

export default function PlaylistPage() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const queryClient = useQueryClient();

  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  const { data: activePlaylist } = useQuery<Playlist>({
    queryKey: ["/api/playlists/active"],
  });

  const { data: todayProgress = [] } = useQuery<any[]>({
    queryKey: ["/api/progress/today"],
  });

  const playlistExercises = activePlaylist 
    ? exercises.filter(ex => activePlaylist.exerciseIds.includes(ex.id))
    : [];

  const completeMutation = useMutation({
    mutationFn: async (exerciseId: number) => {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exerciseId,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to record progress");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/progress/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/progress/streak"] });
    },
  });

  const handlePlayVideo = (exercise: Exercise, index: number) => {
    setSelectedExercise(exercise);
    setCurrentVideoIndex(index);
    setShowVideoModal(true);
  };

  const handleCompleteExercise = (exercise: Exercise) => {
    completeMutation.mutate(exercise.id);
    setSelectedExercise(exercise);
    setShowCompletionModal(true);
  };

  const isCompleted = (exerciseId: number) => {
    return todayProgress.some((p: any) => p.exerciseId === exerciseId);
  };

  const ExerciseCard = ({ exercise, index }: { exercise: Exercise, index: number }) => {
    const swipeHandlers = useSwipe({
      onSwipeLeft: () => handleCompleteExercise(exercise),
    });

    const completed = isCompleted(exercise.id);

    return (
      <div
        className="bg-white rounded-lg border border-border p-4 mb-4 relative"
        {...swipeHandlers}
      >
        {/* Drag Handle */}
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
          <div className="flex flex-col space-y-1">
            <div className="w-1 h-1 bg-medium-gray rounded-full"></div>
            <div className="w-1 h-1 bg-medium-gray rounded-full"></div>
            <div className="w-1 h-1 bg-medium-gray rounded-full"></div>
          </div>
        </div>

        <div className="flex items-center space-x-4 ml-6">
          {/* Play Button */}
          <button
            onClick={() => handlePlayVideo(exercise, index)}
            className="w-12 h-12 bg-light-gray rounded-lg flex items-center justify-center"
          >
            <Play className="w-5 h-5 text-pink" />
          </button>

          {/* Exercise Info */}
          <div className="flex-1">
            <h3 className="font-medium text-dark-gray text-sm">{exercise.name}</h3>
            <p className="text-xs text-medium-gray">{exercise.description}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-medium-gray">{exercise.duration}</span>
              <span className="text-xs text-medium-gray">•</span>
              <span className="text-xs text-medium-gray">Ages {exercise.ageGroups.join(", ")}</span>
            </div>
          </div>

          {/* Status/Action */}
          <div className="w-16 h-12 bg-light-gray rounded-lg flex items-center justify-center">
            {completed ? (
              <div className="text-pink text-lg">✓</div>
            ) : (
              <div className="text-medium-gray text-xs text-center">
                Swipe<br/>Left
              </div>
            )}
          </div>
        </div>

        {/* Completion Overlay */}
        {completed && (
          <div className="absolute inset-0 bg-pink bg-opacity-10 rounded-lg"></div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm" className="p-2">
            <ChevronLeft className="w-5 h-5 text-dark-gray" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-dark-gray">
          {activePlaylist?.name || "PLAYLIST NAME"}
        </h1>
        <Button variant="ghost" size="sm" className="p-2">
          <Settings className="w-5 h-5 text-medium-gray" />
        </Button>
      </div>

      {/* Video Player Section */}
      {selectedExercise && showVideoModal && (
        <div className="bg-gray-900 aspect-video relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
          <Button
            onClick={() => setShowVideoModal(false)}
            className="absolute top-4 right-4 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Exercise List */}
      <div className="px-6 py-6 max-w-sm mx-auto">
        <div className="space-y-0">
          {playlistExercises.map((exercise, index) => (
            <ExerciseCard 
              key={exercise.id} 
              exercise={exercise} 
              index={index}
            />
          ))}
        </div>

        {/* Slide to Complete Button */}
        <div className="mt-8">
          <div className="bg-light-gray rounded-full px-6 py-4 flex items-center justify-center">
            <ChevronRight className="w-5 h-5 text-medium-gray mr-2" />
            <span className="text-medium-gray font-medium">Slide to Complete</span>
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