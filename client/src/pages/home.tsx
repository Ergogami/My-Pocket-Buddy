import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, Settings, Play, Plus, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoUploadModal } from "@/components/video-upload-modal";
import { VideoPlayerModal } from "@/components/video-player-modal";
import { CompletionModal } from "@/components/completion-modal";
import { ExerciseCard } from "@/components/exercise-card";
import { PlaylistBuilder } from "@/components/playlist-builder";
import { ExerciseLibrary } from "@/components/exercise-library";
import { Exercise, Playlist } from "@shared/schema";

export default function Home() {
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

  const { data: todayProgress = [] } = useQuery({
    queryKey: ["/api/progress/today"],
  });

  const { data: streakData } = useQuery({
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
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-coral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-coral rounded-full flex items-center justify-center">
                <Play className="text-white text-xl" />
              </div>
              <h1 className="text-3xl font-fredoka text-navy">FitKids</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setAccessibilityMode(!accessibilityMode)}
                className="p-3 bg-turquoise text-white rounded-full hover:bg-opacity-80 transition-all"
                size="icon"
              >
                <Settings className="text-lg" />
              </Button>
              <Button
                className="p-3 bg-sunny text-navy rounded-full hover:bg-opacity-80 transition-all"
                size="icon"
              >
                <Settings className="text-lg" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-coral to-turquoise rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl font-fredoka mb-4">Let's Get Moving!</h2>
              <p className="text-xl mb-6 opacity-90">Ready for some family fitness fun? Complete exercises together!</p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white bg-opacity-20 rounded-2xl px-6 py-3">
                  <div className="text-2xl font-bold">{completedToday}</div>
                  <div className="text-sm opacity-80">Exercises Today</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-2xl px-6 py-3">
                  <div className="text-2xl font-bold">{streak}</div>
                  <div className="text-sm opacity-80">Day Streak</div>
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4 text-6xl opacity-20">
              <Star className="animate-bounce-gentle" />
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-12">
          <h3 className="text-2xl font-fredoka text-navy mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all border-4 border-transparent hover:border-coral group h-auto"
              variant="ghost"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-coral rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-wiggle">
                  <Play className="text-white text-2xl" />
                </div>
                <h4 className="text-xl font-bold text-navy mb-2">Upload Exercise Video</h4>
                <p className="text-gray-600">Add new exercise videos to your library</p>
              </div>
            </Button>
            <Button
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all border-4 border-transparent hover:border-turquoise group h-auto"
              variant="ghost"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-turquoise rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-wiggle">
                  <Plus className="text-white text-2xl" />
                </div>
                <h4 className="text-xl font-bold text-navy mb-2">Create Playlist</h4>
                <p className="text-gray-600">Build custom exercise routines</p>
              </div>
            </Button>
          </div>
        </section>

        {/* Current Playlist */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-fredoka text-navy">Today's Workout</h3>
            <div className="flex items-center space-x-2 bg-mint rounded-full px-4 py-2">
              <Trophy className="text-turquoise" />
              <span className="font-bold text-navy">
                {completedToday}/{totalExercises} Complete
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-coral to-turquoise h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-center mt-2 text-gray-600">Keep going! You're doing great!</p>
          </div>

          {/* Exercise Cards */}
          <div className="space-y-6">
            {playlistExercises.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                isCompleted={todayProgress.some(p => p.exerciseId === exercise.id)}
                isCurrent={index === completedToday && completedToday < totalExercises}
                isLocked={index > completedToday}
                onPlay={() => handlePlayVideo(exercise)}
                onComplete={() => handleCompleteExercise(exercise)}
              />
            ))}
          </div>
        </section>

        {/* Exercise Library */}
        <ExerciseLibrary />

        {/* Playlist Builder */}
        <PlaylistBuilder />
      </main>

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
