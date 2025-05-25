import { Play, Lock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Exercise } from "@shared/schema";
import { useSwipe } from "@/hooks/use-swipe";

interface ExerciseCardProps {
  exercise: Exercise;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  onPlay: () => void;
  onComplete: () => void;
}

export function ExerciseCard({ 
  exercise, 
  isCompleted, 
  isCurrent, 
  isLocked, 
  onPlay, 
  onComplete 
}: ExerciseCardProps) {
  const swipeHandlers = useSwipe({
    onSwipeLeft: isCurrent ? onComplete : undefined,
  });

  const getCardStyles = () => {
    if (isCompleted) {
      return "bg-white rounded-3xl p-6 shadow-lg border-4 border-mint relative overflow-hidden opacity-75";
    }
    if (isCurrent) {
      return "bg-white rounded-3xl p-6 shadow-xl border-4 border-coral relative overflow-hidden transform hover:scale-105 transition-all cursor-pointer";
    }
    return "bg-white rounded-3xl p-6 shadow-lg border-4 border-gray-200 opacity-60";
  };

  const getImageStyles = () => {
    if (isLocked) {
      return "w-24 h-24 rounded-2xl object-cover grayscale";
    }
    return "w-24 h-24 rounded-2xl object-cover";
  };

  return (
    <div className="relative" {...(isCurrent ? swipeHandlers : {})}>
      <div className={getCardStyles()}>
        {isCompleted && (
          <div className="absolute top-4 right-4 w-12 h-12 bg-mint rounded-full flex items-center justify-center">
            <Check className="text-turquoise text-xl" />
          </div>
        )}
        
        {isCurrent && (
          <>
            <div className="absolute top-0 left-0 w-full h-2 bg-coral"></div>
            <div className="swipe-hint absolute inset-0 pointer-events-none"></div>
          </>
        )}

        <div className="flex items-center space-x-6">
          {/* Exercise Image/Icon */}
          <div className={getImageStyles()}>
            {exercise.thumbnailUrl ? (
              <img 
                src={exercise.thumbnailUrl} 
                alt={exercise.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center">
                <Play className="text-gray-400 text-2xl" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h4 className={`text-xl font-bold mb-2 ${isLocked ? 'text-gray-500' : 'text-navy'}`}>
              {exercise.name}
            </h4>
            <p className={`mb-2 ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
              {exercise.description}
            </p>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                isLocked 
                  ? 'bg-gray-200 text-gray-500' 
                  : 'bg-sunny text-navy'
              }`}>
                Ages {exercise.ageGroups.join(", ")}
              </span>
              <span className={isLocked ? 'text-gray-400' : 'text-gray-500'}>
                {exercise.duration}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col items-center space-y-2">
            {isCompleted ? (
              <div className="w-16 h-16 bg-mint rounded-full flex items-center justify-center">
                <Check className="text-turquoise text-xl" />
              </div>
            ) : isLocked ? (
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <Lock className="text-gray-400 text-xl" />
              </div>
            ) : (
              <>
                <Button 
                  onClick={onPlay}
                  size="lg"
                  className="w-16 h-16 bg-coral text-white rounded-full hover:bg-opacity-80"
                >
                  <Play className="text-xl ml-1" />
                </Button>
                {isCurrent && (
                  <span className="text-sm text-gray-500">Swipe to complete</span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Completion Overlay */}
        {isCompleted && (
          <div className="absolute inset-0 bg-mint bg-opacity-10 flex items-center justify-center">
            <div className="text-6xl text-mint">
              <Check />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
