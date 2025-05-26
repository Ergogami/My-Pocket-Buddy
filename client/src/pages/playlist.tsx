import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Play, X, Settings, ChevronLeft, ChevronRight, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoPlayerModal } from "@/components/video-player-modal";
import { CompletionModal } from "@/components/completion-modal";
import { Exercise, Playlist } from "@shared/schema";
import { useSwipe } from "@/hooks/use-swipe";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PlaylistPage() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  const removeFromPlaylistMutation = useMutation({
    mutationFn: async (exerciseId: number) => {
      if (!activePlaylist) {
        throw new Error("No active playlist found");
      }
      const updatedExercises = activePlaylist.exerciseIds.filter(id => id !== exerciseId);
      
      const response = await fetch(`/api/playlists/${activePlaylist.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exerciseIds: updatedExercises }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to remove from playlist");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists/active"] });
      toast({
        title: "Removed from playlist",
        description: "Exercise removed from your workout playlist.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove exercise from playlist",
        variant: "destructive",
      });
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

  const handleRemoveFromPlaylist = (exerciseId: number) => {
    removeFromPlaylistMutation.mutate(exerciseId);
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
      <div className="relative mb-4">
        {/* Exercise Card */}
        <div
          className={`relative rounded-2xl overflow-hidden ${completed ? 'opacity-60' : ''}`}
          {...swipeHandlers}
        >
          {/* Background with exercise theme */}
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 h-24 flex items-center justify-between">
            {/* Exercise Thumbnail */}
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <div className="text-2xl">
                {exercise.category === 'Balance' ? '⚖️' : 
                 exercise.category === 'Strength' ? '💪' : 
                 exercise.category === 'Cardio' ? '❤️' : 
                 exercise.category === 'Flexibility' ? '🤸' : 
                 exercise.category === 'Ball Skills' ? '⚽' : 
                 exercise.category === 'Coordination' ? '🎯' : '🏃'}
              </div>
            </div>

            {/* Exercise Info */}
            <div className="flex-1 mx-4">
              <h3 className="font-bold text-white text-sm leading-tight">{exercise.name}</h3>
              <p className="text-blue-100 text-xs mt-1">{exercise.duration}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Play Button */}
              <button
                onClick={() => handlePlayVideo(exercise, index)}
                className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
              >
                <Play className="w-5 h-5 text-white ml-0.5" />
              </button>

              {/* Three dots menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-white hover:bg-white hover:bg-opacity-20">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => handleRemoveFromPlaylist(exercise.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove from playlist
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Completion Checkmark */}
        {completed && (
          <div className="absolute top-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-10">
            <span className="text-white font-bold text-sm">✓</span>
          </div>
        )}

        {/* Arrow connector to next exercise */}
        {index < playlistExercises.length - 1 && (
          <div className="flex justify-center py-2">
            <ChevronRight className="w-6 h-6 text-blue-400" />
          </div>
        )}
      </div>
    );
  };

  const completedCount = playlistExercises.filter(ex => isCompleted(ex.id)).length;
  const totalCount = playlistExercises.length;
  const allCompleted = completedCount === totalCount && totalCount > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800">
      {/* Header */}
      <div className="bg-blue-700 px-4 py-6 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-white hover:bg-opacity-20">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="text-center">
          <h1 className="text-white text-lg font-bold">My nighttime schedule</h1>
          <p className="text-blue-200 text-sm">First I need to</p>
        </div>
        <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-white hover:bg-opacity-20">
          <Settings className="w-5 h-5" />
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

      {/* Main Content */}
      <div className="px-6 py-6 max-w-lg mx-auto">
        <div className="flex justify-between items-start">
          {/* Exercise List Column */}
          <div className="flex-1 pr-8">
            {playlistExercises.length > 0 ? (
              playlistExercises.map((exercise, index) => (
                <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-blue-200 mb-4">No exercises in your playlist yet</p>
                <Link href="/search">
                  <Button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold">
                    Add Exercises
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* All Done Section */}
          {playlistExercises.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="text-blue-200 text-sm mb-2">All done</div>
              <div 
                className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg ${
                  allCompleted 
                    ? 'bg-green-400' 
                    : 'bg-white bg-opacity-20 border-2 border-dashed border-white border-opacity-40'
                }`}
              >
                {allCompleted ? (
                  <div className="text-white text-3xl">🎉</div>
                ) : (
                  <div className="text-white text-2xl opacity-60">🏆</div>
                )}
              </div>
              {allCompleted && (
                <div className="text-green-200 text-xs mt-2 text-center">
                  Great job!<br/>All exercises<br/>completed
                </div>
              )}
            </div>
          )}
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