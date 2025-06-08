import { Request } from 'express';

interface VimeoUploadResponse {
  uri: string;
  upload: {
    upload_link: string;
  };
  embed: {
    html: string;
  };
  link: string;
  player_embed_url: string;
}

interface VimeoVideoData {
  name: string;
  description: string;
  privacy: {
    view: string;
    embed: string;
  };
}

export class VimeoService {
  private accessToken: string;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.accessToken = process.env.VIMEO_ACCESS_TOKEN || '';
    this.clientId = process.env.VIMEO_CLIENT_ID || '';
    this.clientSecret = process.env.VIMEO_CLIENT_SECRET || '';

    if (!this.accessToken || !this.clientId || !this.clientSecret) {
      throw new Error('Vimeo credentials are required');
    }
  }

  async createUploadSession(videoData: VimeoVideoData, fileSize: number): Promise<VimeoUploadResponse> {
    const response = await fetch('https://api.vimeo.com/me/videos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.vimeo.*+json;version=3.4'
      },
      body: JSON.stringify({
        upload: {
          approach: 'tus',
          size: fileSize
        },
        ...videoData
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Vimeo upload session creation failed: ${error}`);
    }

    return await response.json();
  }

  async uploadVideo(uploadUrl: string, videoBuffer: Buffer): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: 'PATCH',
      headers: {
        'Tus-Resumable': '1.0.0',
        'Upload-Offset': '0',
        'Upload-Length': videoBuffer.length.toString(),
        'Content-Type': 'application/offset+octet-stream'
      },
      body: videoBuffer
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Vimeo video upload failed: ${response.status} ${error}`);
    }
  }

  async waitForProcessing(videoUri: string, maxWaitTime: number = 60000): Promise<any> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      const videoDetails = await this.getVideoDetails(videoUri);
      
      if (videoDetails.status === 'available') {
        return videoDetails;
      }
      
      if (videoDetails.status === 'error') {
        throw new Error('Video processing failed on Vimeo');
      }
      
      // Wait 2 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error('Video processing timeout - video may still be processing');
  }

  async getVideoDetails(videoUri: string): Promise<any> {
    const response = await fetch(`https://api.vimeo.com${videoUri}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/vnd.vimeo.*+json;version=3.4'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get video details');
    }

    return await response.json();
  }

  extractVideoId(uri: string): string {
    return uri.split('/').pop() || '';
  }

  getEmbedUrl(videoId: string): string {
    return `https://player.vimeo.com/video/${videoId}`;
  }
}

export const vimeoService = new VimeoService();