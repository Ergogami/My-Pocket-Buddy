import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Upload, CloudUpload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoUploadModal({ isOpen, onClose }: VideoUploadModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    category: "General",
    ageGroups: [] as string[],
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/exercises", {
        method: "POST",
        body: data,
      });
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exercises"] });
      toast({
        title: "Success!",
        description: "Your exercise video has been uploaded.",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Upload Failed",
        description: "Please check your file and try again.",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      duration: "",
      category: "General",
      ageGroups: [],
    });
    setSelectedFile(null);
    onClose();
  };

  const handleFileSelect = (file: File) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/avi'];
    const maxSize = 100 * 1024 * 1024; // 100MB

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please select an MP4, WebM, or AVI file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 100MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile || !formData.name || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a video.",
        variant: "destructive",
      });
      return;
    }

    const data = new FormData();
    data.append("video", selectedFile);
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("duration", formData.duration);
    data.append("category", formData.category);
    data.append("ageGroups", JSON.stringify(formData.ageGroups));

    uploadMutation.mutate(data);
  };

  const toggleAgeGroup = (ageGroup: string) => {
    setFormData(prev => ({
      ...prev,
      ageGroups: prev.ageGroups.includes(ageGroup)
        ? prev.ageGroups.filter(ag => ag !== ageGroup)
        : [...prev.ageGroups, ageGroup]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white bg-turquoise -m-6 mb-6 p-6 flex items-center justify-between">
            Upload Exercise Video
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

        <div className="p-2">
          {/* File Drop Zone */}
          <div
            className={`border-4 border-dashed rounded-2xl p-8 text-center mb-6 transition-colors ${
              dragOver 
                ? "border-turquoise bg-turquoise bg-opacity-10" 
                : "border-gray-300"
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          >
            <CloudUpload className="text-4xl text-gray-400 mb-4 mx-auto" />
            <h4 className="text-lg font-bold text-gray-600 mb-2">
              {selectedFile ? selectedFile.name : "Drag video here or click to browse"}
            </h4>
            <p className="text-gray-500 text-sm mb-4">
              Supported formats: MP4, WebM, AVI (Max 100MB)
            </p>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
              className="hidden"
              id="video-upload"
            />
            <Label htmlFor="video-upload">
              <Button type="button" className="bg-turquoise text-white">
                <Upload className="mr-2" />
                Browse Files
              </Button>
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label className="block text-sm font-bold text-navy mb-2">
                Exercise Name *
              </Label>
              <Input
                type="text"
                placeholder="e.g., Jumping Jacks"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="border-2 border-gray-200 focus:border-turquoise"
              />
            </div>
            <div>
              <Label className="block text-sm font-bold text-navy mb-2">
                Duration
              </Label>
              <Input
                type="text"
                placeholder="e.g., 2 minutes"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="border-2 border-gray-200 focus:border-turquoise"
              />
            </div>
          </div>

          <div className="mb-6">
            <Label className="block text-sm font-bold text-navy mb-2">
              Description *
            </Label>
            <Textarea
              placeholder="Describe the exercise..."
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="border-2 border-gray-200 focus:border-turquoise resize-none"
            />
          </div>

          <div className="mb-6">
            <Label className="block text-sm font-bold text-navy mb-2">
              Age Group
            </Label>
            <div className="flex flex-wrap gap-3">
              {["3-5", "6-8", "9-12"].map((ageGroup) => (
                <Label key={ageGroup} className="flex items-center cursor-pointer">
                  <Checkbox
                    checked={formData.ageGroups.includes(ageGroup)}
                    onCheckedChange={() => toggleAgeGroup(ageGroup)}
                    className="mr-2"
                  />
                  <span>Ages {ageGroup}</span>
                </Label>
              ))}
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleSubmit}
              disabled={uploadMutation.isPending}
              className="bg-turquoise text-white px-8 py-3 hover:bg-opacity-80"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload Video"}
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
