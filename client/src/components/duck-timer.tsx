import { useState, useEffect } from "react";

interface DuckTimerProps {
  duration?: number; // Duration in seconds, defaults to 60 (1 minute)
  isActive: boolean;
  onComplete?: () => void;
  onPause?: () => void;
  onResume?: () => void;
}

export function DuckTimer({ duration = 60, isActive, onComplete, onPause, onResume }: DuckTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, isPaused, onComplete]);

  const progress = ((duration - timeLeft) / duration) * 100;
  const coverProgress = 100 - progress; // How much of the duck is still covered
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleTogglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      onResume?.();
    } else {
      setIsPaused(true);
      onPause?.();
    }
  };

  const addTime = (seconds: number) => {
    setTimeLeft(prev => Math.max(0, prev + seconds));
  };

  const subtractTime = (seconds: number) => {
    setTimeLeft(prev => Math.max(0, prev - seconds));
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Duck Timer */}
      <div className="relative w-32 h-32">
        {/* Outer Ring */}
        <div className="absolute inset-0 w-32 h-32 rounded-full bg-white border-4 border-gray-300 shadow-lg overflow-hidden">
          
          {/* Duck - Always visible underneath */}
          <div className="absolute inset-2 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full flex items-center justify-center shadow-inner">
            {/* Duck Face */}
            <div className="relative">
              {/* Eyes */}
              <div className="absolute -top-2 left-1">
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
              
              {/* Beak */}
              <div className="absolute top-0 right-0 w-3 h-2 bg-orange-400 rounded-full transform rotate-12"></div>
              
              {/* Body highlight */}
              <div className="w-16 h-12 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full opacity-60"></div>
              
              {/* Wing detail */}
              <div className="absolute top-2 left-2 w-4 h-3 bg-yellow-500 rounded-full opacity-50"></div>
            </div>
          </div>

          {/* Red Cover that reveals the duck clockwise as time progresses */}
          <div className="absolute inset-2 rounded-full overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-full transition-all duration-1000 ease-linear"
              style={{
                background: `conic-gradient(from 0deg, transparent ${progress * 3.6}deg, #ef4444 ${progress * 3.6}deg)`
              }}
            >
            </div>
          </div>
        </div>

        {/* Timer Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-md mt-8">
            <span className="text-xs font-bold text-gray-700">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Time Adjustment Controls */}
      <div className="flex items-center justify-center space-x-2 mb-2">
        <button
          onClick={() => subtractTime(60)}
          className="bg-dreamy-coral hover:bg-dreamy-pink text-gray-700 px-3 py-1 rounded-full text-sm font-medium transition-colors shadow-md"
        >
          -1min
        </button>
        <button
          onClick={() => subtractTime(10)}
          className="bg-dreamy-coral hover:bg-dreamy-pink text-gray-700 px-3 py-1 rounded-full text-sm font-medium transition-colors shadow-md"
        >
          -10s
        </button>
        <button
          onClick={() => addTime(10)}
          className="bg-dreamy-mint hover:bg-dreamy-blue text-gray-700 px-3 py-1 rounded-full text-sm font-medium transition-colors shadow-md"
        >
          +10s
        </button>
        <button
          onClick={() => addTime(60)}
          className="bg-dreamy-mint hover:bg-dreamy-blue text-gray-700 px-3 py-1 rounded-full text-sm font-medium transition-colors shadow-md"
        >
          +1min
        </button>
      </div>

      {/* Main Controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleTogglePause}
          className="bg-dreamy-lavender hover:bg-dreamy-pink text-gray-700 px-4 py-2 rounded-full font-medium transition-colors shadow-md"
        >
          {isPaused ? '▶️ Resume' : '⏸️ Pause'}
        </button>
        
        <button
          onClick={() => {
            setTimeLeft(duration);
            setIsPaused(false);
          }}
          className="bg-dreamy-yellow hover:bg-dreamy-peach text-gray-700 px-4 py-2 rounded-full font-medium transition-colors shadow-md"
        >
          🔄 Reset
        </button>
      </div>

      {/* Progress Text */}
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600">
          {timeLeft === 0 ? "Time's up! 🎉" : "Keep going! You're doing great! 💪"}
        </p>
        {progress > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            {Math.round(progress)}% complete
          </p>
        )}
      </div>
    </div>
  );
}