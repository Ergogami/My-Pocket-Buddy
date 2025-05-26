import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Play, X, Settings, ChevronLeft, ChevronRight, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoPlayerModal } from "@/components/video-player-modal";
import { CompletionModal } from "@/components/completion-modal";
import { Exercise, Playlist } from "@shared/schema";
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

  const handleNextExercise = () => {
    if (currentVideoIndex < playlistExercises.length - 1) {
      const nextIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(nextIndex);
      setSelectedExercise(playlistExercises[nextIndex]);
    }
  };

  const handlePreviousExercise = () => {
    if (currentVideoIndex > 0) {
      const prevIndex = currentVideoIndex - 1;
      setCurrentVideoIndex(prevIndex);
      setSelectedExercise(playlistExercises[prevIndex]);
    }
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
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const completed = isCompleted(exercise.id);

    // Don't render the card if it's completed (it will appear in the All Done zone)
    if (completed) {
      return null;
    }

    useEffect(() => {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (isDragging) {
          setDragOffset({
            x: e.clientX - startPos.x,
            y: e.clientY - startPos.y
          });
        }
      };

      const handleGlobalMouseUp = (e: MouseEvent) => {
        if (isDragging) {
          const dropZone = document.querySelector('.trophy-zone');
          if (dropZone) {
            const rect = dropZone.getBoundingClientRect();
            
            if (e.clientX >= rect.left && e.clientX <= rect.right && 
                e.clientY >= rect.top && e.clientY <= rect.bottom) {
              handleCompleteExercise(exercise);
            }
          }
          
          setIsDragging(false);
          setDragOffset({ x: 0, y: 0 });
        }
      };

      const handleGlobalTouchMove = (e: TouchEvent) => {
        if (isDragging && e.touches.length > 0) {
          const touch = e.touches[0];
          setDragOffset({
            x: touch.clientX - startPos.x,
            y: touch.clientY - startPos.y
          });
          e.preventDefault();
        }
      };

      const handleGlobalTouchEnd = (e: TouchEvent) => {
        if (isDragging && e.changedTouches.length > 0) {
          const touch = e.changedTouches[0];
          const dropZone = document.querySelector('.trophy-zone');
          if (dropZone) {
            const rect = dropZone.getBoundingClientRect();
            
            if (touch.clientX >= rect.left && touch.clientX <= rect.right && 
                touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
              handleCompleteExercise(exercise);
            }
          }
          
          setIsDragging(false);
          setDragOffset({ x: 0, y: 0 });
        }
      };

      if (isDragging) {
        document.addEventListener('mousemove', handleGlobalMouseMove);
        document.addEventListener('mouseup', handleGlobalMouseUp);
        document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
        document.addEventListener('touchend', handleGlobalTouchEnd);
      }

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
        document.removeEventListener('touchmove', handleGlobalTouchMove);
        document.removeEventListener('touchend', handleGlobalTouchEnd);
      };
    }, [isDragging, startPos, exercise]);

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      setStartPos({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    };

    const handleTouchStart = (e: React.TouchEvent) => {
      const touch = e.touches[0];
      setIsDragging(true);
      setStartPos({ x: touch.clientX, y: touch.clientY });
      e.preventDefault();
    };

    return (
      <div className="relative mb-4">
        {/* Exercise Card */}
        <div
          className={`relative rounded-2xl overflow-hidden transition-all duration-300 cursor-grab select-none ${
            isDragging ? 'cursor-grabbing scale-110 shadow-2xl z-50' : ''
          }`}
          style={{
            transform: isDragging ? `translate(${dragOffset.x}px, ${dragOffset.y}px)` : 'none',
            position: isDragging ? 'fixed' : 'static',
            zIndex: isDragging ? 1000 : 1
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Background with exercise theme */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg p-4 h-24 flex items-center justify-between">
            {/* Exercise Thumbnail */}
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-pink-100 rounded-xl flex items-center justify-center shadow-md border border-orange-200/50">
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
              <h3 className="font-bold text-gray-800 text-sm leading-tight">{exercise.name}</h3>
              <p className="text-gray-500 text-xs mt-1">{exercise.duration}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Complete Button or Play Button */}
              {completed ? (
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-lg">✓</span>
                </div>
              ) : (
                <button
                  onClick={() => handlePlayVideo(exercise, index)}
                  className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                >
                  <Play className="w-5 h-5 text-white ml-0.5" />
                </button>
              )}

              {/* Three dots menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-gray-500 hover:bg-gray-100">
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
            <ChevronRight className="w-6 h-6 text-orange-300" />
          </div>
        )}
      </div>
    );
  };

  const completedCount = playlistExercises.filter(ex => isCompleted(ex.id)).length;
  const totalCount = playlistExercises.length;
  const allCompleted = completedCount === totalCount && totalCount > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm px-4 py-6 flex items-center justify-between shadow-sm">
        <Link href="/">
          <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:bg-gray-100">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="text-center">
          <h1 className="text-gray-800 text-lg font-bold">My Movement Program</h1>
          <p className="text-gray-500 text-sm">Let's get moving!</p>
        </div>
        <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:bg-gray-100">
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
        {/* Drag and Drop Instruction */}
        {playlistExercises.filter(ex => !isCompleted(ex.id)).length > 0 && (
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 mb-6 border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🖱️</div>
              <div>
                <p className="text-blue-800 font-medium text-sm">Drag exercises to the Trophy Zone!</p>
                <p className="text-blue-600 text-xs">Click and drag exercise cards to complete them</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-start">
          {/* Exercise List Column */}
          <div className="flex-1 pr-8">
            {playlistExercises.filter(ex => !isCompleted(ex.id)).length > 0 ? (
              playlistExercises.map((exercise, index) => (
                <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
              ))
            ) : playlistExercises.length > 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-gray-700 font-bold text-lg mb-2">All exercises complete!</p>
                <p className="text-gray-500">Great job finishing your workout!</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No exercises in your playlist yet</p>
                <Link href="/search">
                  <Button className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all">
                    Add Exercises
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* All Done Section */}
          {playlistExercises.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="text-gray-700 text-lg font-bold mb-4 text-center">
                🏆 Trophy Zone
              </div>
              <div className="trophy-zone space-y-3 p-4 rounded-3xl border-4 border-dashed border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-100 min-h-48 transition-all duration-300 hover:border-amber-400 hover:bg-gradient-to-br hover:from-amber-100 hover:to-yellow-200">
                {playlistExercises.map((exercise, index) => {
                  const isCompleted = todayProgress.some(p => p.exerciseId === exercise.id);
                  return (
                    <div 
                      key={exercise.id}
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500 transform scale-110' 
                          : 'bg-white/60 border-2 border-dashed border-gray-300'
                      }`}
                    >
                      {isCompleted ? (
                        <div className="text-white text-2xl">✅</div>
                      ) : (
                        <div className="text-gray-400 text-xl">{index + 1}</div>
                      )}
                    </div>
                  );
                })}
              </div>
              {allCompleted && (
                <div className="mt-4 text-center">
                  <div className="text-3xl mb-2">🎉</div>
                  <div className="text-green-600 text-sm font-bold">
                    Amazing Work!<br/>All Exercises<br/>Completed!
                  </div>
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
        onNext={handleNextExercise}
        onPrevious={handlePreviousExercise}
        hasNext={currentVideoIndex < playlistExercises.length - 1}
        hasPrevious={currentVideoIndex > 0}
      />
      
      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        exercise={selectedExercise}
      />
    </div>
  );
}