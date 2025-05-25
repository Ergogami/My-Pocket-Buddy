import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Exercise } from "@shared/schema";
import { EXERCISE_CATEGORIES } from "@/lib/constants";

export function ExerciseLibrary() {
  const [selectedCategory, setSelectedCategory] = useState("All Exercises");

  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: selectedCategory === "All Exercises" 
      ? ["/api/exercises"] 
      : ["/api/exercises", { category: selectedCategory }],
  });

  const addToPlaylist = (exercise: Exercise) => {
    // This would typically dispatch to a playlist builder context or state
    console.log("Adding to playlist:", exercise.name);
  };

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-fredoka text-navy mb-6">Exercise Library</h3>
      
      {/* Categories */}
      <div className="flex flex-wrap gap-4 mb-8">
        {EXERCISE_CATEGORIES.map((category) => (
          <Button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 rounded-full font-bold transition-all ${
              selectedCategory === category
                ? "bg-coral text-white"
                : "bg-white border-2 border-turquoise text-turquoise hover:bg-turquoise hover:text-white"
            }`}
            variant={selectedCategory === category ? "default" : "outline"}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group"
          >
            {/* Exercise Image */}
            <div className="h-48 bg-gray-200 relative overflow-hidden">
              {exercise.thumbnailUrl ? (
                <img
                  src={exercise.thumbnailUrl}
                  alt={exercise.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-coral to-turquoise flex items-center justify-center">
                  <span className="text-white text-4xl font-fredoka">
                    {exercise.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="p-6">
              <h4 className="text-lg font-bold text-navy mb-2">{exercise.name}</h4>
              <p className="text-gray-600 text-sm mb-4">{exercise.description}</p>
              <div className="flex justify-between items-center">
                <span className="bg-coral text-white px-3 py-1 rounded-full text-xs font-bold">
                  Ages {exercise.ageGroups.join(", ")}
                </span>
                <Button
                  onClick={() => addToPlaylist(exercise)}
                  size="sm"
                  className="w-10 h-10 bg-turquoise text-white rounded-full hover:bg-opacity-80"
                >
                  <Plus />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {exercises.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl text-gray-300 mb-4">🏃‍♀️</div>
          <h4 className="text-xl font-bold text-gray-500 mb-2">No exercises found</h4>
          <p className="text-gray-400">Try selecting a different category or upload some videos!</p>
        </div>
      )}
    </section>
  );
}
