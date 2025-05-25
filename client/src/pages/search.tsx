import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Home, Menu, User, ArrowLeft, Plus, Play, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Exercise } from "@shared/schema";
import { Link } from "wouter";
import { VideoPlayerModal } from "@/components/video-player-modal";
import { VideoUploadModal } from "@/components/video-upload-modal";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
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

  const handlePlayVideo = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowVideoModal(true);
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
      <div className="px-4 py-6 max-w-md mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">WORKOUT LIBRARY</h1>
        
        {/* Hero Banner */}
        <div className="relative mb-6 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-6 text-white">
            <h2 className="text-2xl font-bold mb-3">Time to Explore!</h2>
            <p className="text-sm leading-relaxed">
              Enough boring adult exercises! Here you can find fun and creative exercises 
              for your child. I've grouped them by 'categories' so that you can easily 
              access the content most relevant to you.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 text-base border-2 border-blue-300 rounded-full focus:border-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Category Cards */}
        <div className="space-y-4">
          {categoryData.map((category) => (
            <div
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className="relative rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
            >
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold">{category.name.toUpperCase()}</h3>
              </div>
              {category.name !== "Balance" && (
                <div className="absolute bottom-3 right-3">
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Block
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Show filtered exercises if search is active */}
        {searchTerm && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Search Results</h3>
            <div className="space-y-3">
              {filteredExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Play className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">{exercise.name}</h3>
                      <p className="text-xs text-gray-600">{exercise.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">{exercise.duration}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">Ages {exercise.ageGroups.join(", ")}</span>
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
                      <Play className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2"
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="flex justify-around py-3 max-w-sm mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2">
              <Home className="w-5 h-5 text-medium-gray" />
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2">
            <Search className="w-5 h-5 text-pink" />
          </Button>
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
    </div>
  );
}