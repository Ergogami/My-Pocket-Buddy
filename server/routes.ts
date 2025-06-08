import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertExerciseSchema, insertPlaylistSchema, insertProgressSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for video uploads
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  dest: uploadsDir,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/avi'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP4, WebM, and AVI are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });
  app.use('/uploads', express.static(uploadsDir));

  // Exercise routes
  app.get("/api/exercises", async (req, res) => {
    try {
      const category = req.query.category as string;
      const exercises = category 
        ? await storage.getExercisesByCategory(category)
        : await storage.getAllExercises();
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  // Get exercises grouped by category
  app.get("/api/exercises/by-category", async (req, res) => {
    try {
      const allExercises = await storage.getAllExercises();
      const exercisesByCategory = allExercises.reduce((acc, exercise) => {
        const category = exercise.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(exercise);
        return acc;
      }, {} as Record<string, typeof allExercises>);
      
      res.json(exercisesByCategory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercises by category" });
    }
  });

  // Test Vimeo connection
  app.get("/api/vimeo/status", async (req, res) => {
    try {
      const { vimeoService } = await import("./vimeo-service");
      
      const response = await fetch('https://api.vimeo.com/me', {
        headers: {
          'Authorization': `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
          'Accept': 'application/vnd.vimeo.*+json;version=3.4'
        }
      });

      if (!response.ok) {
        return res.status(500).json({ 
          connected: false, 
          error: "Vimeo API connection failed" 
        });
      }

      const userData = await response.json();
      
      // Get user's videos count
      const videosResponse = await fetch('https://api.vimeo.com/me/videos', {
        headers: {
          'Authorization': `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
          'Accept': 'application/vnd.vimeo.*+json;version=3.4'
        }
      });

      const videosData = await videosResponse.json();

      res.json({
        connected: true,
        user: {
          name: userData.name,
          link: userData.link,
          videoCount: videosData.total || 0
        }
      });

    } catch (error) {
      res.status(500).json({ 
        connected: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.get("/api/exercises/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const exercise = await storage.getExercise(id);
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercise" });
    }
  });

  app.post("/api/exercises", upload.single('video'), async (req, res) => {
    try {
      const exerciseData = {
        name: req.body.name,
        description: req.body.description,
        duration: req.body.duration,
        ageGroups: JSON.parse(req.body.ageGroups || '[]'),
        category: req.body.category || 'General',
        videoUrl: req.file ? `/uploads/${req.file.filename}` : '',
        thumbnailUrl: req.body.thumbnailUrl || '',
      };

      const validatedData = insertExerciseSchema.parse(exerciseData);
      const exercise = await storage.createExercise(validatedData);
      res.status(201).json(exercise);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid exercise data" });
    }
  });

  // Upload video to Vimeo endpoint
  app.post("/api/upload-to-vimeo", upload.single("video"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No video file provided" });
      }

      const { name, description, category } = req.body;
      
      if (!name || !description) {
        return res.status(400).json({ error: "Name and description are required" });
      }

      // Import Vimeo service
      const { vimeoService } = await import("./vimeo-service");

      // Read file buffer
      const videoBuffer = fs.readFileSync(req.file.path);

      // Prepare video metadata
      const videoData = {
        name,
        description,
        privacy: {
          view: "unlisted",
          embed: "public"
        }
      };

      // Create upload session
      const uploadSession = await vimeoService.createUploadSession(
        videoData, 
        req.file.size
      );

      // Upload the video file
      await vimeoService.uploadVideo(
        uploadSession.upload.upload_link,
        videoBuffer
      );

      // Wait for video processing (with timeout)
      let videoDetails;
      try {
        videoDetails = await vimeoService.waitForProcessing(uploadSession.uri, 30000);
      } catch (processingError) {
        console.log("Video uploaded but still processing:", processingError.message);
        // Continue with upload session data even if processing isn't complete
        videoDetails = uploadSession;
      }

      // Get video ID and create embed URL
      const videoId = vimeoService.extractVideoId(uploadSession.uri);
      const embedUrl = vimeoService.getEmbedUrl(videoId);

      // Create exercise with Vimeo video
      const exerciseData = {
        name,
        description,
        category: category || 'general',
        videoUrl: embedUrl,
        duration: parseInt(req.body.duration) || 60,
        ageGroups: JSON.parse(req.body.ageGroups || '[]'),
        thumbnailUrl: req.body.thumbnailUrl || '',
      };

      const validatedData = insertExerciseSchema.parse(exerciseData);
      const exercise = await storage.createExercise(validatedData);

      // Clean up local file
      fs.unlinkSync(req.file.path);

      res.json({ 
        success: true, 
        exercise,
        vimeoUrl: uploadSession.link,
        embedUrl,
        videoId,
        status: videoDetails?.status || 'processing'
      });

    } catch (error) {
      console.error("Vimeo upload error:", error);
      
      // Clean up file if it exists
      if (req.file?.path && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.error("File cleanup error:", cleanupError);
        }
      }

      res.status(500).json({ 
        error: "Failed to upload video to Vimeo",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.patch("/api/exercises/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const exercise = await storage.updateExercise(id, req.body);
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ message: "Failed to update exercise" });
    }
  });

  app.delete("/api/exercises/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteExercise(id);
      if (!deleted) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete exercise" });
    }
  });

  app.patch("/api/exercises/:id/pin", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const exercise = await storage.pinExercise(id);
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ message: "Failed to pin exercise" });
    }
  });

  app.patch("/api/exercises/:id/unpin", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const exercise = await storage.unpinExercise(id);
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ message: "Failed to unpin exercise" });
    }
  });

  // Playlist routes
  app.get("/api/playlists", async (req, res) => {
    try {
      const playlists = await storage.getAllPlaylists();
      res.json(playlists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch playlists" });
    }
  });

  app.get("/api/playlists/active", async (req, res) => {
    try {
      const playlist = await storage.getActivePlaylist();
      if (!playlist) {
        return res.status(404).json({ message: "No active playlist found" });
      }
      res.json(playlist);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active playlist" });
    }
  });

  app.post("/api/playlists", async (req, res) => {
    try {
      const validatedData = insertPlaylistSchema.parse(req.body);
      const playlist = await storage.createPlaylist(validatedData);
      res.status(201).json(playlist);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid playlist data" });
    }
  });

  app.patch("/api/playlists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const playlist = await storage.updatePlaylist(id, req.body);
      if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      res.json(playlist);
    } catch (error) {
      res.status(500).json({ message: "Failed to update playlist" });
    }
  });

  app.post("/api/playlists/:id/activate", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.setActivePlaylist(id);
      res.json({ message: "Playlist activated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to activate playlist" });
    }
  });

  // Progress routes
  app.get("/api/progress", async (req, res) => {
    try {
      const progress = await storage.getAllProgress();
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.get("/api/progress/today", async (req, res) => {
    try {
      const progress = await storage.getTodayProgress();
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch today's progress" });
    }
  });

  app.get("/api/progress/streak", async (req, res) => {
    try {
      const streak = await storage.getStreakDays();
      res.json({ streak });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch streak" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = {
        ...req.body,
        completedAt: new Date().toISOString(),
      };
      const validatedData = insertProgressSchema.parse(progressData);
      const progress = await storage.createProgress(validatedData);
      res.status(201).json(progress);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid progress data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
