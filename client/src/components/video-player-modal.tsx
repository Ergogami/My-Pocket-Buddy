import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Exercise } from "@shared/schema";
import { useState, useRef } from "react";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
}

export function VideoPlayerModal({ isOpen, onClose, exercise }: VideoPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePrevious = () => {
    // TODO: Implement previous exercise logic
    console.log("Previous exercise");
  };

  const handleNext = () => {
    // TODO: Implement next exercise logic
    console.log("Next exercise");
  };

  if (!exercise) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="bg-coral text-white px-6 py-4 flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-xl font-bold">{exercise.name}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <X />
          </Button>
        </DialogHeader>

        <div className="p-6">
          <div className="bg-gray-900 rounded-2xl overflow-hidden mb-6 relative aspect-video">
            {exercise.videoUrl ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src={exercise.videoUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                controls={false}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <Play className="w-16 h-16 mb-4 opacity-75 mx-auto" />
                  <p className="text-lg">Video not available</p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-navy mb-2">{exercise.name}</h3>
            <p className="text-gray-600 mb-4">{exercise.description}</p>
            <div className="flex justify-center items-center space-x-4">
              <span className="bg-sunny text-navy px-3 py-1 rounded-full text-sm font-bold">
                Ages {exercise.ageGroups.join(", ")}
              </span>
              <span className="text-gray-500">{exercise.duration}</span>
            </div>
          </div>

          <div className="flex justify-center space-x-6">
            <Button
              onClick={handlePrevious}
              size="lg"
              variant="outline"
              className="w-16 h-16 rounded-full"
            >
              <SkipBack className="text-xl" />
            </Button>
            
            <Button
              onClick={handlePlayPause}
              size="lg"
              className="w-20 h-20 bg-coral text-white rounded-full hover:bg-opacity-80"
            >
              {isPlaying ? (
                <Pause className="text-2xl" />
              ) : (
                <Play className="text-2xl ml-1" />
              )}
            </Button>
            
            <Button
              onClick={handleNext}
              size="lg"
              variant="outline"
              className="w-16 h-16 rounded-full"
            >
              <SkipForward className="text-xl" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
