import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Play, ChevronLeft, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoPlayerModal } from "@/components/video-player-modal";
import { CompletionModal } from "@/components/completion-modal";
import { Exercise, Playlist } from "@shared/schema";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useSwipe } from "@/hooks/use-swipe";
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

  // Fetch active playlist
  const { data: activePlaylist, isLoading: playlistLoading } = useQuery<Playlist>({
    queryKey: ['/api/playlists/active'],
  });

  // Fetch all exercises
  const { data: allExercises = [], isLoading: exercisesLoading } = useQuery<Exercise[]>({
    queryKey: ['/api/exercises'],
  });

  // Fetch today's progress
  const { data: todayProgress = [], isLoading: progressLoading } = useQuery({
    queryKey: ['/api/progress/today'],
  });

  // Fetch streak
  const { data: streak } = useQuery({
    queryKey: ['/api/progress/streak'],
  });

  // Create progress mutation
  const createProgressMutation = useMutation({
    mutationFn: async (exerciseId: number) => {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId }),
      });
      if (!res.ok) throw new Error('Failed to create progress');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
    },
  });

  const playlistExercises = activePlaylist 
    ? allExercises.filter(ex => activePlaylist.exerciseIds.includes(ex.id))
    : [];

  const handlePlayVideo = (exercise: Exercise, index: number) => {
    setSelectedExercise(exercise);
    setCurrentVideoIndex(index);
    setShowVideoModal(true);
  };

  const handleCompleteExercise = (exercise: Exercise) => {
    createProgressMutation.mutate(exercise.id);
    setSelectedExercise(exercise);
    setShowCompletionModal(true);
  };

  const handleNextVideo = () => {
    const currentIndex = playlistExercises.findIndex(ex => ex.id === selectedExercise?.id);
    if (currentIndex < playlistExercises.length - 1) {
      const nextExercise = playlistExercises[currentIndex + 1];
      setSelectedExercise(nextExercise);
      setCurrentVideoIndex(currentIndex + 1);
    }
  };

  const handlePreviousVideo = () => {
    const currentIndex = playlistExercises.findIndex(ex => ex.id === selectedExercise?.id);
    if (currentIndex > 0) {
      const prevExercise = playlistExercises[currentIndex - 1];
      setSelectedExercise(prevExercise);
      setCurrentVideoIndex(currentIndex - 1);
    }
  };

  const isCompleted = (exerciseId: number) => {
    return todayProgress.some((p: any) => p.exerciseId === exerciseId);
  };

  const ExerciseCard = ({ exercise, index }: { exercise: Exercise, index: number }) => {
    const [isSwipping, setIsSwipping] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState<'right' | 'down' | null>(null);
    
    const swipeHandlers = useSwipe({
      onSwipeRight: () => {
        if (!isCompleted(exercise.id)) {
          setIsSwipping(true);
          setSwipeDirection('right');
          setTimeout(() => {
            handleCompleteExercise(exercise);
            setIsSwipping(false);
            setSwipeDirection(null);
          }, 500);
        }
      },
      onSwipeDown: () => {
        if (!isCompleted(exercise.id)) {
          setIsSwipping(true);
          setSwipeDirection('down');
          setTimeout(() => {
            handleCompleteExercise(exercise);
            setIsSwipping(false);
            setSwipeDirection(null);
          }, 500);
        }
      },
    });

    const completed = isCompleted(exercise.id);

    // Don't render the card if it's completed (it will appear in the trophy zone)
    if (completed) {
      return null;
    }

    const getSwipeTransform = () => {
      if (!isSwipping) return '';
      if (swipeDirection === 'right') return 'transform translate-x-full opacity-0';
      if (swipeDirection === 'down') return 'transform translate-y-full opacity-0';
      return '';
    };

    return (
      <div className="relative mb-4">
        {/* Exercise Card */}
        <div
          className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${getSwipeTransform()}`}
          {...swipeHandlers}
        >
          {/* Background with exercise theme */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg p-4 h-24 flex items-center justify-between">
            {/* Exercise Thumbnail */}
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-pink-100 rounded-xl flex items-center justify-center shadow-md border border-orange-200/50">
              <span className="text-2xl">{exercise.category === 'balance' ? '🤸' : 
                                       exercise.category === 'strength' ? '💪' : 
                                       exercise.category === 'flexibility' ? '🧘' : 
                                       exercise.category === 'ball-skills' ? '⚽' : 
                                       exercise.category === 'coordination' ? '🎯' : '❤️'}</span>
            </div>
            
            {/* Exercise Info */}
            <div className="flex-1 ml-4">
              <h3 className="font-bold text-gray-800 text-lg leading-tight">{exercise.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePlayVideo(exercise, index)}
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <Play size={16} />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleCompleteExercise(exercise)}>
                    Mark Complete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Multi-directional swipe indicators */}
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-green-100 to-transparent flex items-center justify-center opacity-50">
            <span className="text-green-600 font-bold text-xs">SWIPE →</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-amber-100 to-transparent flex items-end justify-center pb-2 opacity-50">
            <span className="text-amber-600 font-bold text-xs">SWIPE ↓</span>
          </div>
        </div>
      </div>
    );
  };

  if (playlistLoading || exercisesLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your workout...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!activePlaylist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
        <div className="max-w-md mx-auto pt-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Active Playlist</h1>
          <p className="text-gray-600 mb-6">Create a playlist to get started with your workout!</p>
          <Link href="/search">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Browse Exercises
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const completedExercises = playlistExercises.filter(ex => isCompleted(ex.id));
  const incompleteExercises = playlistExercises.filter(ex => !isCompleted(ex.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="p-2">
                <ChevronLeft size={20} />
              </Button>
            </Link>
            <div>
              <h1 className="font-bold text-xl text-gray-800">{activePlaylist.name}</h1>
              <p className="text-sm text-gray-600">
                {completedExercises.length} of {playlistExercises.length} complete
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {streak && (
              <div className="bg-orange-100 px-3 py-1 rounded-full">
                <span className="text-orange-600 font-bold text-sm">🔥 {(streak as any)?.streak}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto">
        {/* Remaining Exercises */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Let's Move! 💪</h2>
          {incompleteExercises.length > 0 ? (
            <div className="space-y-4">
              {incompleteExercises.map((exercise, index) => (
                <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Amazing Work!</h3>
              <p className="text-gray-600">You've completed all exercises in this playlist!</p>
            </div>
          )}
        </div>

        {/* Trophy Zone - Individual Cells */}
        {completedExercises.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-col items-center">
              <div className="text-gray-700 text-lg font-bold mb-4 text-center">
                🏆 Trophy Zone
              </div>
              <div className="space-y-3 w-full">
                {completedExercises.map((exercise) => (
                  <div 
                    key={exercise.id}
                    className="bg-gradient-to-br from-amber-100 to-yellow-200 border-2 border-amber-300 rounded-2xl p-4 h-24 flex items-center justify-between shadow-lg"
                  >
                    {/* Exercise Thumbnail */}
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-200 to-amber-200 rounded-xl flex items-center justify-center shadow-md border border-amber-300">
                      <span className="text-2xl">🏆</span>
                    </div>
                    
                    {/* Exercise Info */}
                    <div className="flex-1 ml-4">
                      <h3 className="font-bold text-amber-800 text-lg leading-tight">{exercise.name}</h3>
                      <p className="text-sm text-amber-700 mt-1">Completed! ✨</p>
                    </div>
                    
                    {/* Celebration Icon */}
                    <div className="text-2xl">⭐</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        exercise={selectedExercise}
        onNext={handleNextVideo}
        onPrevious={handlePreviousVideo}
        hasNext={currentVideoIndex < playlistExercises.length - 1}
        hasPrevious={currentVideoIndex > 0}
      />

      {/* Completion Modal */}
      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        exercise={selectedExercise}
      />
    </div>
  );
}