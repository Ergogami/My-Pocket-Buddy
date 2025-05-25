import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Play, MoreHorizontal, Home, Search, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoUploadModal } from "@/components/video-upload-modal";
import { VideoPlayerModal } from "@/components/video-player-modal";
import { CompletionModal } from "@/components/completion-modal";
import { Exercise, Playlist } from "@shared/schema";
import { Link } from "wouter";

export default function HomePage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [accessibilityMode, setAccessibilityMode] = useState(false);

  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  const { data: activePlaylist } = useQuery<Playlist>({
    queryKey: ["/api/playlists/active"],
  });

  const { data: todayProgress = [] } = useQuery<any[]>({
    queryKey: ["/api/progress/today"],
  });

  const { data: streakData } = useQuery<{ streak: number }>({
    queryKey: ["/api/progress/streak"],
  });

  const playlistExercises = activePlaylist 
    ? exercises.filter(ex => activePlaylist.exerciseIds.includes(ex.id))
    : [];

  const completedToday = todayProgress.length;
  const totalExercises = playlistExercises.length;
  const progressPercentage = totalExercises > 0 ? (completedToday / totalExercises) * 100 : 0;
  const streak = streakData?.streak || 0;

  const handlePlayVideo = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowVideoModal(true);
  };

  const handleCompleteExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowCompletionModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border px-4 py-3">
        <h1 className="text-xl font-semibold text-center text-dark-gray">Balance</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-6 max-w-sm mx-auto">
        {/* Exercise List */}
        <div className="space-y-4">
          {playlistExercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className="bg-white rounded-lg border border-border p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-light-gray rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-pink" />
                </div>
                <div>
                  <h3 className="font-medium text-dark-gray text-sm">{exercise.name}</h3>
                  <p className="text-xs text-medium-gray">{exercise.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-medium-gray">{exercise.duration}</span>
                    <span className="text-xs text-medium-gray">•</span>
                    <span className="text-xs text-medium-gray">Ages {exercise.ageGroups.join(", ")}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handlePlayVideo(exercise)}
                  variant="ghost"
                  size="sm"
                  className="p-2"
                >
                  <Play className="w-4 h-4 text-pink" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                >
                  <MoreHorizontal className="w-4 h-4 text-medium-gray" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="flex justify-around py-3 max-w-sm mx-auto">
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2">
            <Home className="w-5 h-5 text-pink" />
          </Button>
          <Link href="/search">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2">
              <Search className="w-5 h-5 text-medium-gray" />
            </Button>
          </Link>
          <Button 
            onClick={() => setShowUploadModal(true)}
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center gap-1 p-2"
          >
            <Menu className="w-5 h-5 text-medium-gray" />
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2">
            <User className="w-5 h-5 text-medium-gray" />
          </Button>
        </div>
      </div>

      {/* Modals */}
      <VideoUploadModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
      />
      
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
