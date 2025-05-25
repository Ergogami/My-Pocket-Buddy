import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Play, MoreHorizontal, Home, Search, Menu, User, ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const categoryData = [
    {
      name: "Balance",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2387CEEB;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%236BB3E1;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='200' fill='url(%23bg)'/%3E%3Ctext x='200' y='100' font-family='Arial, sans-serif' font-size='36' font-weight='bold' text-anchor='middle' fill='white'%3EBALANCE%3C/text%3E%3C/svg%3E"
    },
    {
      name: "Strength", 
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23FF7F7F;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23FF6B6B;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='200' fill='url(%23bg)'/%3E%3Ctext x='200' y='100' font-family='Arial, sans-serif' font-size='36' font-weight='bold' text-anchor='middle' fill='white'%3ESTRENGTH%3C/text%3E%3C/svg%3E"
    },
    {
      name: "Ball Skills",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23FFB347;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23FF9500;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='200' fill='url(%23bg)'/%3E%3Ctext x='200' y='100' font-family='Arial, sans-serif' font-size='32' font-weight='bold' text-anchor='middle' fill='white'%3EBALL SKILLS%3C/text%3E%3C/svg%3E"
    },
    {
      name: "Coordination",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2398D8C8;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2372C3B3;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='200' fill='url(%23bg)'/%3E%3Ctext x='200' y='100' font-family='Arial, sans-serif' font-size='30' font-weight='bold' text-anchor='middle' fill='white'%3ECOORDINATION%3C/text%3E%3C/svg%3E"
    },
    {
      name: "Flexibility",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23DDA0DD;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23DA70D6;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='200' fill='url(%23bg)'/%3E%3Ctext x='200' y='100' font-family='Arial, sans-serif' font-size='30' font-weight='bold' text-anchor='middle' fill='white'%3EFLEXIBILITY%3C/text%3E%3C/svg%3E"
    },
    {
      name: "Cardio",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23F0E68C;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23DAA520;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='200' fill='url(%23bg)'/%3E%3Ctext x='200' y='100' font-family='Arial, sans-serif' font-size='36' font-weight='bold' text-anchor='middle' fill='white'%3ECARDIO%3C/text%3E%3C/svg%3E"
    }
  ];

  // Filter exercises based on search and category
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center">
        <Button variant="ghost" size="sm" className="p-2 rounded-full bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" className="p-2 rounded-full bg-gray-100">
          <Menu className="w-5 h-5 text-gray-600" />
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" className="p-2 rounded-full bg-gray-100">
          <User className="w-5 h-5 text-gray-600" />
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Hero Section with MY POCKET BUDDY */}
        <div className="bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg p-6 text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="flex space-x-2">
              {/* Cute cartoon characters */}
              <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center">
                <span className="text-2xl">👶</span>
              </div>
              <div className="w-12 h-12 bg-pink-300 rounded-full flex items-center justify-center">
                <span className="text-2xl">👧</span>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-brown-800 mb-2">MY</h1>
          <h1 className="text-3xl font-bold text-brown-800 mb-2">POCKET</h1>
          <h1 className="text-3xl font-bold text-brown-800">BUDDY</h1>
        </div>

        {/* Main Hero Card */}
        <div className="relative rounded-lg overflow-hidden">
          <div className="bg-gradient-to-br from-gray-600 to-gray-800 p-8 text-white relative">
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4 leading-tight">ALL YOUR</h2>
              <h2 className="text-4xl font-bold mb-4 leading-tight">FUN</h2>
              <h2 className="text-4xl font-bold mb-4 leading-tight">EXERCISES</h2>
              <h2 className="text-4xl font-bold mb-4 leading-tight">IN YOUR</h2>
              <h2 className="text-4xl font-bold leading-tight">FINGERTIPS</h2>
            </div>
          </div>
        </div>

        {/* Text Input Area */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <input 
            type="text" 
            placeholder="Write Something..."
            className="w-full text-gray-500 bg-transparent border-none outline-none"
          />
        </div>

        {/* Introduction Card */}
        <div className="relative rounded-lg overflow-hidden">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">HELLO! <em>I'm Ed!</em></h3>
              <p className="text-sm mb-4 opacity-90">I am a physio and your Pocket Buddy!</p>
              <div className="flex space-x-3">
                <button className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                  Discover More
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Block
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Exercises Section */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">LATEST EXERCISES</h3>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {exercises.slice(0, 3).map((exercise, index) => (
              <div key={exercise.id} className="flex-shrink-0 w-64">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-br from-gray-600 to-gray-800 h-40 relative">
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-800 mb-1">{exercise.name}</h4>
                    <p className="text-sm text-blue-600 uppercase tracking-wide">WORKOUT</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-gray-500">{exercise.duration}</span>
                      <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Play className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
          <Link href="/playlist">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2">
              <Menu className="w-5 h-5 text-medium-gray" />
            </Button>
          </Link>
          <Button 
            onClick={() => setShowUploadModal(true)}
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center gap-1 p-2"
          >
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
