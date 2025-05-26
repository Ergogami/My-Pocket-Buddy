import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Play, MoreHorizontal, Home, Search, Menu, User, ArrowLeft, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VideoUploadModal } from "@/components/video-upload-modal";
import { VideoPlayerModal } from "@/components/video-player-modal";
import { CompletionModal } from "@/components/completion-modal";
import { TextEditorModal } from "@/components/text-editor-modal";
import { useAppText } from "@/hooks/use-app-text";
import { Exercise, Playlist } from "@shared/schema";
import { Link } from "wouter";

export default function HomePage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const texts = useAppText();

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
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-purple-100 via-pink-100 to-orange-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 px-4 py-6 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🏃</span>
            </div>
            <div>
              <h1 className="text-xl font-bubble text-white drop-shadow-lg">{texts.appTitle}</h1>
              <p className="text-white/80 text-xs font-rounded font-bold">{texts.appSubtitle}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowTextEditor(true)}
              className="bg-white/20 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white/30 transition-colors"
            >
              <Edit className="w-5 h-5 text-white" />
            </button>
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 shadow-lg">
              <Menu className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Hero Section with MY POCKET BUDDY */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <div className="bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-8 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-300/20 via-transparent to-cyan-300/20"></div>
            <div className="relative z-10">
              <div className="flex justify-center items-center mb-6">
                <div className="flex space-x-3">
                  {/* Adventure characters */}
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform">
                    <span className="text-3xl">🏃‍♀️</span>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform">
                    <span className="text-3xl">🤸‍♂️</span>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform">
                    <span className="text-3xl">⚽</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bubble text-white drop-shadow-2xl">{texts.welcomeTitle}</h1>
                <h1 className="text-5xl font-bubble text-yellow-300 drop-shadow-2xl">{texts.welcomeSubtitle1}</h1>
                <h1 className="text-5xl font-bubble text-white drop-shadow-2xl">{texts.welcomeSubtitle2}</h1>
              </div>
              <p className="text-white/90 text-lg mt-4 font-rounded font-bold drop-shadow-lg">{texts.welcomeDescription}</p>
            </div>
          </div>
        </div>

        {/* Adventure Guide Card - Moved here after Welcome */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="relative p-8 text-white min-h-[300px]">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('${new URL('../../../attached_assets/280322349_2945104402302751_3363760066192124213_n.jpg', import.meta.url).href}')`
              }}
            ></div>
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 via-transparent to-yellow-400/10"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-3xl">🧗‍♂️</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bubble mb-1 drop-shadow-lg">{texts.guideGreeting}</h3>
                  <h3 className="text-2xl font-bubble text-yellow-300 drop-shadow-lg"><em>{texts.guideIntro}</em></h3>
                </div>
              </div>
              <p className="text-lg mb-6 opacity-95 font-rounded font-bold drop-shadow-md">{texts.guideDescription}</p>
            </div>
          </div>
        </div>

        {/* Main Adventure Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="relative p-8 text-white min-h-[400px]">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('${new URL('../../../attached_assets/beautiful-family-indoor-playing-with-balloon-toys-2024-10-18-07-47-21-utc.jpg', import.meta.url).href}')`
              }}
            ></div>
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-purple-600/40 via-transparent to-yellow-400/20"></div>
            <div className="relative z-10 text-center flex items-center justify-center min-h-full px-4">
              <div className="space-y-4 w-full">
                <div className="space-y-3">
                  <h2 className="text-5xl md:text-6xl font-bubble leading-tight drop-shadow-lg">{texts.mainCardTitle1}</h2>
                  <h2 className="text-5xl md:text-6xl font-bubble leading-tight drop-shadow-lg text-yellow-300">{texts.mainCardTitle2}</h2>
                  <h2 className="text-5xl md:text-6xl font-bubble leading-tight drop-shadow-lg">{texts.mainCardTitle3}</h2>
                  <h2 className="text-5xl md:text-6xl font-bubble leading-tight drop-shadow-lg text-cyan-300">{texts.mainCardTitle4}</h2>
                  <h2 className="text-5xl md:text-6xl font-bubble leading-tight drop-shadow-lg">{texts.mainCardTitle5}</h2>
                </div>
                
                {/* Action Buttons within the section */}
                <div className="flex justify-center space-x-4 mt-8">
                  <Link href="/search">
                    <button className="bg-white/90 text-cyan-700 px-8 py-4 rounded-2xl text-lg font-bubble shadow-xl hover:bg-white transform hover:scale-105 transition-all">
                      {texts.startButton}
                    </button>
                  </Link>
                  <Link href="/playlist">
                    <button className="bg-yellow-400 text-cyan-800 px-8 py-4 rounded-2xl text-lg font-bubble shadow-xl hover:bg-yellow-300 transform hover:scale-105 transition-all flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      {texts.programButton}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Adventure Search Area */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl border-4 border-purple-200 p-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-lg">🔍</span>
            </div>
            <h3 className="text-lg font-bubble text-purple-700">{texts.findAdventureTitle}</h3>
          </div>
          <input 
            type="text" 
            placeholder={texts.searchPlaceholder}
            className="w-full text-purple-700 bg-purple-50 border-2 border-purple-200 rounded-2xl px-4 py-3 outline-none focus:border-purple-400 font-rounded font-bold placeholder:text-purple-400"
          />
        </div>

        {/* Adventure Exercises Section */}
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-xl">🚀</span>
            </div>
            <h3 className="text-2xl font-bubble text-gray-800">{texts.exercisesTitle}</h3>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {exercises.slice(0, 3).map((exercise, index) => {
              const colors = [
                'from-purple-400 to-pink-500',
                'from-cyan-400 to-blue-500', 
                'from-orange-400 to-red-500'
              ];
              const emojis = ['🏃‍♀️', '🤸‍♂️', '⚽'];
              
              return (
                <div key={exercise.id} className="flex-shrink-0 w-64">
                  <div className="bg-white rounded-3xl border-4 border-purple-100 overflow-hidden shadow-2xl transform hover:scale-105 transition-all">
                    <div className={`bg-gradient-to-br ${colors[index % colors.length]} h-40 relative`}>
                      <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <span className="text-4xl mb-2">{emojis[index % emojis.length]}</span>
                          <Play className="w-12 h-12 text-white drop-shadow-lg" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bubble text-gray-800 mb-1">{exercise.name}</h4>
                      <p className="text-sm text-purple-600 font-rounded font-bold uppercase">{exercise.category}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xs text-gray-500 font-rounded font-bold">{exercise.ageGroups.join(', ')}</span>
                        <button 
                          onClick={() => handlePlayVideo(exercise)}
                          className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all"
                        >
                          <Play className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Adventure Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 shadow-2xl">
        <div className="flex justify-around py-4 max-w-sm mx-auto">
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
            <Home className="w-6 h-6 text-white" />
            <span className="text-xs text-white font-bold">Home</span>
          </Button>
          <Link href="/search">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-3 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all">
              <Search className="w-6 h-6 text-white/80" />
              <span className="text-xs text-white/80 font-bold">Search</span>
            </Button>
          </Link>
          <Link href="/playlist">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-3 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all">
              <Menu className="w-6 h-6 text-white/80" />
              <span className="text-xs text-white/80 font-bold">Program</span>
            </Button>
          </Link>
          <Button 
            onClick={() => setShowUploadModal(true)}
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center gap-1 p-3 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all"
          >
            <User className="w-6 h-6 text-white/80" />
            <span className="text-xs text-white/80 font-bold">Upload</span>
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

      <TextEditorModal
        isOpen={showTextEditor}
        onClose={() => setShowTextEditor(false)}
      />
    </div>
  );
}
