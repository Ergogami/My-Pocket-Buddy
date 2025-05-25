import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, GripVertical, X } from "lucide-react";
import { Exercise } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface PlaylistItem {
  id: number;
  name: string;
}

export function PlaylistBuilder() {
  const [playlistName, setPlaylistName] = useState("");
  const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]>([]);
  const [showNameInput, setShowNameInput] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const savePlaylistMutation = useMutation({
    mutationFn: async () => {
      if (!playlistName || playlistItems.length === 0) {
        throw new Error("Please provide a name and add exercises to the playlist");
      }

      const response = await fetch("/api/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playlistName,
          exerciseIds: playlistItems.map(item => item.id),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save playlist");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists"] });
      toast({
        title: "Success!",
        description: "Your playlist has been saved.",
      });
      clearPlaylist();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addExercise = (exercise: Exercise) => {
    if (!playlistItems.find(item => item.id === exercise.id)) {
      setPlaylistItems(prev => [...prev, { id: exercise.id, name: exercise.name }]);
    }
  };

  const removeExercise = (id: number) => {
    setPlaylistItems(prev => prev.filter(item => item.id !== id));
  };

  const clearPlaylist = () => {
    setPlaylistItems([]);
    setPlaylistName("");
    setShowNameInput(false);
  };

  const reorderItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...playlistItems];
    const [reorderedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, reorderedItem);
    setPlaylistItems(newItems);
  };

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-fredoka text-navy mb-6">Build Your Playlist</h3>
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        {/* Playlist Name Input */}
        {showNameInput && (
          <div className="mb-6">
            <Label className="block text-sm font-bold text-navy mb-2">
              Playlist Name
            </Label>
            <Input
              type="text"
              placeholder="Enter playlist name..."
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="border-2 border-gray-200 focus:border-turquoise"
            />
          </div>
        )}

        {/* Drop Zone */}
        <div className="border-4 border-dashed border-gray-300 rounded-2xl p-8 text-center min-h-64">
          {playlistItems.length === 0 ? (
            <>
              <div className="text-6xl text-gray-300 mb-4">
                <Plus className="mx-auto" />
              </div>
              <h4 className="text-xl font-bold text-gray-500 mb-2">Drag exercises here</h4>
              <p className="text-gray-400">Create your custom workout by dragging exercises from the library</p>
            </>
          ) : (
            <>
              {!showNameInput && (
                <Button
                  onClick={() => setShowNameInput(true)}
                  className="mb-6 bg-turquoise text-white"
                >
                  <Plus className="mr-2" />
                  Name Your Playlist
                </Button>
              )}
              
              <div className="space-y-3">
                {playlistItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-gray-50 rounded-xl p-4 cursor-move"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", index.toString());
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
                      reorderItem(fromIndex, index);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <div className="flex items-center space-x-4">
                      <GripVertical className="text-gray-400" />
                      <span className="font-bold text-navy">{item.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExercise(item.id)}
                      className="text-coral hover:text-red-600"
                    >
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}

          {playlistItems.length > 0 && (
            <div className="mt-6 flex justify-center space-x-4">
              <Button
                onClick={() => savePlaylistMutation.mutate()}
                disabled={savePlaylistMutation.isPending || !playlistName}
                className="bg-coral text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-80"
              >
                {savePlaylistMutation.isPending ? "Saving..." : "Save Playlist"}
              </Button>
              <Button
                onClick={clearPlaylist}
                variant="outline"
                className="px-8 py-3 rounded-full font-bold"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
