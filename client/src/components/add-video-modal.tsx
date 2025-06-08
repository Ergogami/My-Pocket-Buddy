import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Video, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Exercise } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
}

export function AddVideoModal({ isOpen, onClose, exercise }: AddVideoModalProps) {
  const [vimeoUrl, setVimeoUrl] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateVideoMutation = useMutation({
    mutationFn: async (data: { vimeoUrl: string }) => {
      if (!exercise) throw new Error("No exercise selected");
      return apiRequest(`/api/exercises/${exercise.id}/video`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exercises"] });
      toast({
        title: "Video Added!",
        description: `Video successfully added to ${exercise?.name}`,
      });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Failed to Add Video",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setVimeoUrl("");
    onClose();
  };

  const handleSubmit = () => {
    if (!vimeoUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a Vimeo video URL",
        variant: "destructive",
      });
      return;
    }

    updateVideoMutation.mutate({ vimeoUrl: vimeoUrl.trim() });
  };

  const formatVimeoUrl = (url: string) => {
    // Convert regular Vimeo URLs to embed format
    if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const handleUrlChange = (value: string) => {
    setVimeoUrl(formatVimeoUrl(value));
  };

  if (!exercise) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white bg-coral -m-6 mb-6 p-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Video className="w-5 h-5" />
              <span>Add Video</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <X />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="p-2 space-y-6">
          {/* Exercise Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-800 mb-1">{exercise.name}</h3>
            <p className="text-sm text-gray-600">{exercise.description}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                {exercise.category}
              </span>
              <span className="text-gray-500 text-xs">{exercise.duration}</span>
            </div>
          </div>

          {/* Vimeo URL Input */}
          <div className="space-y-3">
            <Label className="block text-sm font-bold text-navy">
              Vimeo Video URL
            </Label>
            <Input
              type="url"
              placeholder="https://vimeo.com/123456789 or https://player.vimeo.com/video/123456789"
              value={vimeoUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="border-2 border-gray-200 focus:border-coral"
            />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-700 text-xs leading-relaxed">
                <strong>How to get Vimeo URL:</strong><br/>
                1. Go to your video on Vimeo.com<br/>
                2. Copy the URL from your browser<br/>
                3. Paste it here - it will auto-format for embedding
              </p>
            </div>
          </div>

          {/* Preview */}
          {vimeoUrl && (
            <div className="space-y-2">
              <Label className="text-sm font-bold text-navy">Preview URL:</Label>
              <div className="bg-gray-100 rounded p-2 text-xs text-gray-600 break-all">
                {vimeoUrl}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleSubmit}
              disabled={updateVideoMutation.isPending || !vimeoUrl.trim()}
              className="bg-coral text-white px-8 py-3 hover:bg-opacity-80"
            >
              {updateVideoMutation.isPending ? "Adding..." : "Add Video"}
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              className="px-8 py-3"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}