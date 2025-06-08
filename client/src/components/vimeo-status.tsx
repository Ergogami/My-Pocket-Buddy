import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2, Video } from "lucide-react";

interface VimeoStatus {
  connected: boolean;
  user?: {
    name: string;
    link: string;
    videoCount: number;
  };
  error?: string;
}

export function VimeoStatus() {
  const { data, isLoading, error } = useQuery<VimeoStatus>({
    queryKey: ["/api/vimeo/status"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Checking Vimeo connection...</span>
      </div>
    );
  }

  if (error || !data?.connected) {
    return (
      <div className="flex items-center space-x-2">
        <XCircle className="w-4 h-4 text-red-500" />
        <Badge variant="destructive" className="text-xs">
          Vimeo Disconnected
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <CheckCircle className="w-4 h-4 text-green-500" />
        <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
          Vimeo Connected
        </Badge>
      </div>
      
      {data.user && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Video className="w-4 h-4" />
          <span>{data.user.videoCount} videos</span>
          <span className="text-gray-400">•</span>
          <span className="font-medium">{data.user.name}</span>
        </div>
      )}
    </div>
  );
}