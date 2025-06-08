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
        <XCircle className="w-3 h-3 text-red-400" />
        <span className="text-xs text-red-200">Disconnected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <CheckCircle className="w-3 h-3 text-green-400" />
      <div className="flex items-center space-x-2 text-xs text-white">
        <Video className="w-3 h-3" />
        <span>{data.user?.videoCount || 0}</span>
        <span className="text-white/60">•</span>
        <span className="font-medium">{data.user?.name}</span>
      </div>
    </div>
  );
}