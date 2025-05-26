import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, Home, Menu, User, ArrowLeft, Plus, Play, MoreHorizontal, Star } from "lucide-react";
import { usePrograms } from "@/hooks/use-programs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Exercise, Playlist } from "@shared/schema";
import { Link, useLocation } from "wouter";
import { VideoPlayerModal } from "@/components/video-player-modal";
import { VideoUploadModal } from "@/components/video-upload-modal";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  const { data: activePlaylist } = useQuery<Playlist>({
    queryKey: ["/api/playlists/active"],
  });

  const { programs, getProgramExercises } = usePrograms();

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
      image: "/attached_assets/side-bends-sportive-latin-family-working-out-in-t-2023-11-27-05-01-40-utc.jpg"
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

  const handlePlayVideo = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowVideoModal(true);
  };

  const handleAddToPlaylist = (exerciseId: number) => {
    addToPlaylistMutation.mutate(exerciseId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-purple-100 via-pink-100 to-orange-200">
      {/* Adventure Header */}
      <div className="bg-gradient-to-r from-green-400 via-cyan-500 to-blue-600 px-4 py-6 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <ArrowLeft className="w-5 h-5 text-white" />
            </div>
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-black text-white drop-shadow-lg">ADVENTURE LIBRARY</h1>
            <p className="text-white/80 text-xs font-medium">Discover amazing exercises!</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <Menu className="w-4 h-4 text-white" />
            </div>
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 max-w-md mx-auto">
        {/* Adventure Welcome */}
        <div className="relative mb-8 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-8 text-white relative">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-transparent to-yellow-400/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏃‍♀️</span>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚽</span>
                </div>
              </div>
              <h2 className="text-3xl font-black mb-4 text-center drop-shadow-lg">Time to Explore!</h2>
              <p className="text-lg leading-relaxed text-center font-medium drop-shadow-md">
                Welcome to your adventure playground! Find amazing exercises grouped by categories. 
                Let's make fitness fun and exciting together!
              </p>
            </div>
          </div>
        </div>

        {/* Adventure Search */}
        <div className="mb-8">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border-4 border-cyan-200 p-6 shadow-xl">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-cyan-700">Find Your Perfect Exercise!</h3>
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for amazing exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 py-4 text-base border-2 border-cyan-200 rounded-2xl focus:border-cyan-400 bg-cyan-50 text-cyan-700 font-medium placeholder:text-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Done for you programs button */}
        <div className="text-center mb-8">
          <Link href="/programs">
            <button className="bg-gradient-to-r from-emerald-400 to-green-500 text-white px-12 py-5 rounded-3xl text-xl font-bubble shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all border-4 border-emerald-300 flex items-center gap-3 mx-auto">
              <span className="text-2xl">✨</span>
              Done for you programs
            </button>
          </Link>
        </div>

        {/* Program Examples Carousel */}
        <div className="mb-8">
          <div className="flex space-x-4 overflow-x-auto pb-4 snap-x">
            {/* Animal Adventures Program */}
            <div className="flex-shrink-0 w-72 snap-start">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl border-4 border-orange-200 overflow-hidden shadow-xl">
                <div className="bg-gradient-to-br from-orange-400 to-red-500 p-4 text-white">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="text-xl">🦘</span>
                    </div>
                    <h3 className="text-lg font-bubble">Animal Adventures</h3>
                  </div>
                  <p className="text-white/90 text-sm font-rounded font-bold">Jump like a kangaroo, balance like a flamingo!</p>
                  <div className="mt-3 text-white/80 text-xs font-rounded font-bold">6 exercises</div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                    <span className="font-bubble text-gray-700">Kangaroo Jumps</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                    <span className="font-bubble text-gray-700">Flamingo Balance</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                    <span className="font-bubble text-gray-700">Lion Roars</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Balance Masters Program */}
            <div className="flex-shrink-0 w-72 snap-start">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl border-4 border-blue-200 overflow-hidden shadow-xl">
                <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-4 text-white">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="text-xl">⚖️</span>
                    </div>
                    <h3 className="text-lg font-bubble">Balance Masters</h3>
                  </div>
                  <p className="text-white/90 text-sm font-rounded font-bold">Develop amazing balance and coordination skills</p>
                  <div className="mt-3 text-white/80 text-xs font-rounded font-bold">${exercises.filter(ex => ex.category === 'Balance').length} exercises</div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    <span className="font-bubble text-gray-700">Single Leg Stand</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    <span className="font-bubble text-gray-700">Tree Pose</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    <span className="font-bubble text-gray-700">Balance Beam Walk</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Strength Heroes Program */}
            <div className="flex-shrink-0 w-72 snap-start">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl border-4 border-green-200 overflow-hidden shadow-xl">
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-4 text-white">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="text-xl">💪</span>
                    </div>
                    <h3 className="text-lg font-bubble">Strength Heroes</h3>
                  </div>
                  <p className="text-white/90 text-sm font-rounded font-bold">Build strength through fun, engaging movements</p>
                  <div className="mt-3 text-white/80 text-xs font-rounded font-bold">${exercises.filter(ex => ex.category === 'Strength').length} exercises</div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span className="font-bubble text-gray-700">Bear Crawls</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span className="font-bubble text-gray-700">Wall Push-ups</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span className="font-bubble text-gray-700">Squats</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Adventure Category Cards */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-xl">🗺️</span>
            </div>
            <h3 className="text-2xl font-black text-gray-800">CHOOSE YOUR ADVENTURE</h3>
          </div>
          {categoryData.map((category, index) => {
            const categoryColors = [
              'from-sky-400 to-blue-600',      // Balance
              'from-red-400 to-pink-600',      // Strength  
              'from-orange-400 to-yellow-500', // Ball Skills
              'from-green-400 to-teal-600',    // Coordination
              'from-purple-400 to-pink-500',   // Flexibility
              'from-yellow-400 to-orange-500'  // Cardio
            ];
            const categoryEmojis = ['🧘‍♀️', '💪', '⚽', '🤹‍♀️', '🧘‍♂️', '❤️'];
            
            return (
              <div
                key={category.name}
                onClick={() => setLocation(`/category/${category.name}`)}
                className="relative rounded-3xl overflow-hidden cursor-pointer transform transition-all hover:scale-105 shadow-2xl border-4 border-white/50"
              >
                <div className={`h-40 relative ${category.name === 'Flexibility' || category.name === 'Strength' || category.name === 'Cardio' || category.name === 'Ball Skills' || category.name === 'Balance' || category.name === 'Coordination' ? '' : `bg-gradient-to-br ${categoryColors[index]}`}`}>
                  {category.name === 'Balance' && (
                    <>
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url('/attached_assets/boy-balancing-on-playground-equipment-2025-04-04-02-41-48-utc.jpg')`
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30" />
                    </>
                  )}
                  {category.name === 'Flexibility' && (
                    <>
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url('/attached_assets/side-bends-sportive-latin-family-working-out-in-t-2023-11-27-05-01-40-utc.jpg')`
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30" />
                    </>
                  )}
                  {category.name === 'Strength' && (
                    <>
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url('/attached_assets/group-of-children-playing-twister-indoors-2024-10-18-17-47-33-utc.jpg')`
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30" />
                    </>
                  )}
                  {category.name === 'Cardio' && (
                    <>
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url('/attached_assets/black-kid-and-his-friends-having-pe-class-at-the-s-2024-12-13-17-48-23-utc.jpg')`
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30" />
                    </>
                  )}
                  {category.name === 'Ball Skills' && (
                    <>
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url('/attached_assets/cheerful-kids-sitting-on-fitness-mat-with-balls-2024-11-19-08-04-28-utc.jpg')`
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30" />
                    </>
                  )}
                  {category.name === 'Coordination' && (
                    <>
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url('/attached_assets/boys-training-2025-03-14-22-00-41-utc.JPG')`
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30" />
                    </>
                  )}
                  <div className="absolute inset-0 bg-white/10 flex items-center justify-between p-6">
                    <div className="flex flex-col items-start">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                        <span className="text-3xl">{categoryEmojis[index]}</span>
                      </div>
                      <h3 className="text-white text-2xl font-black drop-shadow-2xl">{category.name.toUpperCase()}</h3>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                        <span className="text-lg">✨</span>
                      </div>
                      <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                        <span className="text-lg">🎯</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show search results if search is active */}
        {searchTerm && (
          <div className="mt-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🔍</span>
              </div>
              <h3 className="text-2xl font-black text-gray-800">ADVENTURE RESULTS</h3>
            </div>
            <div className="space-y-4">
              {filteredExercises.map((exercise, index) => {
                const colors = [
                  'from-purple-400 to-pink-500',
                  'from-cyan-400 to-blue-500', 
                  'from-orange-400 to-red-500',
                  'from-green-400 to-teal-500'
                ];
                const emojis = ['🏃‍♀️', '🤸‍♂️', '⚽', '🏀', '🧘‍♀️', '💪'];
                
                return (
                  <div
                    key={exercise.id}
                    className="bg-white rounded-3xl border-4 border-purple-100 p-6 shadow-xl transform hover:scale-102 transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${colors[index % colors.length]} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <span className="text-2xl">{emojis[index % emojis.length]}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg mb-1">{exercise.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{exercise.description}</p>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">{exercise.duration}</span>
                          <span className="text-xs font-medium text-cyan-600 bg-cyan-100 px-2 py-1 rounded-full">{exercise.category}</span>
                          <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Ages {exercise.ageGroups.join(", ")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mt-4">
                      <Button
                        onClick={() => handlePlayVideo(exercise)}
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg flex-1"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        🎬 Play Now
                      </Button>
                      <Button
                        onClick={() => handleAddToPlaylist(exercise.id)}
                        disabled={addToPlaylistMutation.isPending}
                        size="sm"
                        variant="outline"
                        className="border-2 border-cyan-400 text-cyan-600 hover:bg-cyan-50 px-4 py-2 rounded-xl font-bold"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            {filteredExercises.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Adventures Found!</h3>
                <p className="text-gray-500">Try searching for something else like "ball", "jump", or "balance"</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="flex justify-around py-3 max-w-lg mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2">
              <Home className="w-5 h-5 text-medium-gray" />
              <span className="text-xs text-medium-gray font-bold">Home</span>
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2">
            <Search className="w-5 h-5 text-pink" />
            <span className="text-xs text-pink font-bold">Search</span>
          </Button>
          <Link href="/programs">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2">
              <Star className="w-5 h-5 text-medium-gray" />
              <span className="text-xs text-medium-gray font-bold">Programs</span>
            </Button>
          </Link>
          <Link href="/playlist">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2">
              <Menu className="w-5 h-5 text-medium-gray" />
              <span className="text-xs text-medium-gray font-bold">Playlist</span>
            </Button>
          </Link>
          <Button 
            onClick={() => setShowUploadModal(true)}
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center gap-1 p-2"
          >
            <User className="w-5 h-5 text-medium-gray" />
            <span className="text-xs text-medium-gray font-bold">Upload</span>
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
    </div>
  );
}