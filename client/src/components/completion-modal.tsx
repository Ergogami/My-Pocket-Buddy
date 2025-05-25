import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Exercise } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
}

export function CompletionModal({ isOpen, onClose, exercise }: CompletionModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const completeMutation = useMutation({
    mutationFn: async () => {
      if (!exercise) return;
      
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exerciseId: exercise.id,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to record progress");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/progress/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/progress/streak"] });
      
      toast({
        title: "Great Job!",
        description: "Exercise completed successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record your progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNextExercise = () => {
    if (exercise) {
      completeMutation.mutate();
    }
    onClose();
  };

  const handleTakeBreak = () => {
    onClose();
  };

  if (!exercise) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0">
        <div className="relative">
          {/* Confetti Animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/4 w-4 h-4 bg-coral rounded-full animate-confetti" style={{ animationDelay: "0s" }}></div>
            <div className="absolute top-0 left-1/2 w-4 h-4 bg-sunny rounded-full animate-confetti" style={{ animationDelay: "0.5s" }}></div>
            <div className="absolute top-0 left-3/4 w-4 h-4 bg-turquoise rounded-full animate-confetti" style={{ animationDelay: "1s" }}></div>
          </div>

          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-fredoka text-navy mb-4">Great Job!</h3>
            <p className="text-gray-600 mb-6">You completed {exercise.name}! Keep up the awesome work!</p>
            
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleNextExercise}
                disabled={completeMutation.isPending}
                className="bg-coral text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-80"
              >
                {completeMutation.isPending ? "Recording..." : "Next Exercise"}
              </Button>
              <Button
                onClick={handleTakeBreak}
                variant="outline"
                className="px-8 py-3 rounded-full font-bold"
              >
                Take a Break
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
