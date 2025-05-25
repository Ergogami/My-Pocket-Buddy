import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Home, Menu, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Exercise } from "@shared/schema";
import { Link } from "wouter";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  const categories = [
    { name: "Balance", color: "bg-pink" },
    { name: "Strength", color: "bg-light-gray" },
    { name: "Balance", color: "bg-pink" },
    { name: "Strength", color: "bg-light-gray" },
    { name: "Balance", color: "bg-pink" },
    { name: "Strength", color: "bg-light-gray" },
  ];

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border px-4 py-3">
        <h1 className="text-xl font-semibold text-center text-dark-gray">SEARCH</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-6 max-w-sm mx-auto">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray w-4 h-4" />
            <Input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-base border-2 border-border rounded-lg focus:border-pink"
            />
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-dark-gray mb-4">Categories</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category.name)}
                className={`${category.color} ${category.name === 'Balance' ? 'text-white' : 'text-dark-gray'} 
                  p-4 rounded-lg text-center font-medium text-sm h-16 flex items-center justify-center
                  ${selectedCategory === category.name ? 'ring-2 ring-pink' : ''}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
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
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2">
            <Menu className="w-5 h-5 text-medium-gray" />
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2">
            <User className="w-5 h-5 text-medium-gray" />
          </Button>
        </div>
      </div>
    </div>
  );
}