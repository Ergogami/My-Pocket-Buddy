import { exercises, playlists, progress, type Exercise, type InsertExercise, type Playlist, type InsertPlaylist, type Progress, type InsertProgress } from "@shared/schema";

export interface IStorage {
  // Exercise methods
  getExercise(id: number): Promise<Exercise | undefined>;
  getAllExercises(): Promise<Exercise[]>;
  getExercisesByCategory(category: string): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  updateExercise(id: number, updates: Partial<Exercise>): Promise<Exercise | undefined>;
  deleteExercise(id: number): Promise<boolean>;
  pinExercise(id: number): Promise<Exercise | undefined>;
  unpinExercise(id: number): Promise<Exercise | undefined>;

  // Playlist methods
  getPlaylist(id: number): Promise<Playlist | undefined>;
  getAllPlaylists(): Promise<Playlist[]>;
  getActivePlaylist(): Promise<Playlist | undefined>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  updatePlaylist(id: number, updates: Partial<Playlist>): Promise<Playlist | undefined>;
  deletePlaylist(id: number): Promise<boolean>;
  setActivePlaylist(id: number): Promise<void>;

  // Progress methods
  getProgress(exerciseId: number): Promise<Progress[]>;
  getAllProgress(): Promise<Progress[]>;
  getTodayProgress(): Promise<Progress[]>;
  createProgress(progress: InsertProgress): Promise<Progress>;
  getStreakDays(): Promise<number>;
}

export class MemStorage implements IStorage {
  private exercises: Map<number, Exercise>;
  private playlists: Map<number, Playlist>;
  private progress: Map<number, Progress>;
  private currentExerciseId: number;
  private currentPlaylistId: number;
  private currentProgressId: number;

  constructor() {
    this.exercises = new Map();
    this.playlists = new Map();
    this.progress = new Map();
    this.currentExerciseId = 1;
    this.currentPlaylistId = 1;
    this.currentProgressId = 1;

    // Initialize with sample exercises
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleExercises: InsertExercise[] = [
      // Balance Category
      {
        name: "Flamingo Stand",
        description: "Stand on one foot like a flamingo and improve your balance!",
        duration: "30 seconds per leg",
        ageGroups: ["3-5", "6-8"],
        category: "balance",
        videoUrl: "",
        thumbnailUrl: ""
      },
      {
        name: "Tightrope Walk",
        description: "Walk in a straight line like you're on a tightrope!",
        duration: "1 minute",
        ageGroups: ["3-5", "6-8", "9-12"],
        category: "balance",
        videoUrl: "",
        thumbnailUrl: ""
      },
      {
        name: "Tree Pose",
        description: "Stand tall and steady like a tree in the wind!",
        duration: "45 seconds",
        ageGroups: ["6-8", "9-12"],
        category: "balance",
        videoUrl: "",
        thumbnailUrl: ""
      },

      // Strength Category
      {
        name: "Bear Crawls",
        description: "Crawl like a strong bear and build upper body strength!",
        duration: "1 minute",
        ageGroups: ["3-5", "6-8"],
        category: "strength",
        videoUrl: "",
        thumbnailUrl: ""
      },
      {
        name: "Superhero Push-ups",
        description: "Do modified push-ups like your favorite superhero!",
        duration: "30 seconds",
        ageGroups: ["6-8", "9-12"],
        category: "strength",
        videoUrl: "",
        thumbnailUrl: ""
      },
      {
        name: "Crab Walk",
        description: "Walk sideways like a crab to strengthen your arms!",
        duration: "45 seconds",
        ageGroups: ["3-5", "6-8"],
        category: "strength",
        videoUrl: "",
        thumbnailUrl: ""
      },

      // Flexibility Category
      {
        name: "Animal Stretches",
        description: "Stretch like different animals - cats, dogs, and snakes!",
        duration: "3 minutes",
        ageGroups: ["3-5", "6-8", "9-12"],
        category: "flexibility",
        videoUrl: "",
        thumbnailUrl: ""
      },
      {
        name: "Butterfly Stretch",
        description: "Sit and flap your legs like butterfly wings!",
        duration: "1 minute",
        ageGroups: ["3-5", "6-8"],
        category: "flexibility",
        videoUrl: "",
        thumbnailUrl: ""
      },
      {
        name: "Reach for the Stars",
        description: "Stretch up high and reach for the stars!",
        duration: "30 seconds",
        ageGroups: ["3-5", "6-8", "9-12"],
        category: "flexibility",
        videoUrl: "",
        thumbnailUrl: ""
      },

      // Ball Skills Category
      {
        name: "Ball Toss Challenge",
        description: "Toss and catch a ball to improve hand-eye coordination!",
        duration: "2 minutes",
        ageGroups: ["3-5", "6-8"],
        category: "ball-skills",
        videoUrl: "",
        thumbnailUrl: ""
      },
      {
        name: "Dribbling Fun",
        description: "Practice dribbling a ball with your hands!",
        duration: "1 minute",
        ageGroups: ["6-8", "9-12"],
        category: "ball-skills",
        videoUrl: "",
        thumbnailUrl: ""
      },
      {
        name: "Rolling Ball Game",
        description: "Roll a ball back and forth with a partner!",
        duration: "2 minutes",
        ageGroups: ["3-5", "6-8"],
        category: "ball-skills",
        videoUrl: "",
        thumbnailUrl: ""
      },

      // Coordination Category
      {
        name: "Marching Band",
        description: "March in place while moving your arms like a conductor!",
        duration: "1 minute",
        ageGroups: ["3-5", "6-8"],
        category: "coordination",
        videoUrl: "",
        thumbnailUrl: ""
      },
      {
        name: "Cross Crawls",
        description: "Touch your opposite hand to knee in a fun pattern!",
        duration: "45 seconds",
        ageGroups: ["6-8", "9-12"],
        category: "coordination",
        videoUrl: "",
        thumbnailUrl: ""
      },
      {
        name: "Simon Says Dance",
        description: "Follow dance moves that help with coordination!",
        duration: "2 minutes",
        ageGroups: ["3-5", "6-8", "9-12"],
        category: "coordination",
        videoUrl: "",
        thumbnailUrl: ""
      },

      // Cardio Category
      {
        name: "Jumping Jacks",
        description: "Get your heart pumping with fun jumping jacks!",
        duration: "1 minute",
        ageGroups: ["6-8", "9-12"],
        category: "cardio",
        videoUrl: "",
        thumbnailUrl: ""
      },
      {
        name: "Dance Party",
        description: "Dance to your favorite music and get moving!",
        duration: "3 minutes",
        ageGroups: ["3-5", "6-8", "9-12"],
        category: "cardio",
        videoUrl: "",
        thumbnailUrl: ""
      },
      {
        name: "Animal Hops",
        description: "Hop like different animals - bunnies, frogs, and kangaroos!",
        duration: "1 minute",
        ageGroups: ["3-5", "6-8"],
        category: "cardio",
        videoUrl: "",
        thumbnailUrl: ""
      }
    ];

    sampleExercises.forEach(exercise => {
      const id = this.currentExerciseId++;
      this.exercises.set(id, { ...exercise, id, isCompleted: false, isPinned: false });
    });

    // Create default playlist with exercises from different categories
    const defaultPlaylist: InsertPlaylist = {
      name: "Today's Workout",
      exerciseIds: [1, 4, 7, 10, 13, 16] // Mix of different categories
    };
    const playlistId = this.currentPlaylistId++;
    this.playlists.set(playlistId, { ...defaultPlaylist, id: playlistId, isActive: true });
  }

  // Exercise methods
  async getExercise(id: number): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }

  async getAllExercises(): Promise<Exercise[]> {
    return Array.from(this.exercises.values());
  }

  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    return Array.from(this.exercises.values()).filter(exercise => 
      category === "All Exercises" || exercise.category === category
    );
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const id = this.currentExerciseId++;
    const exercise: Exercise = { ...insertExercise, id, isCompleted: false, isPinned: false };
    this.exercises.set(id, exercise);
    return exercise;
  }

  async updateExercise(id: number, updates: Partial<Exercise>): Promise<Exercise | undefined> {
    const exercise = this.exercises.get(id);
    if (!exercise) return undefined;
    
    const updated = { ...exercise, ...updates };
    this.exercises.set(id, updated);
    return updated;
  }

  async deleteExercise(id: number): Promise<boolean> {
    return this.exercises.delete(id);
  }

  async pinExercise(id: number): Promise<Exercise | undefined> {
    const exercise = this.exercises.get(id);
    if (exercise) {
      const updatedExercise = { ...exercise, isPinned: true };
      this.exercises.set(id, updatedExercise);
      return updatedExercise;
    }
    return undefined;
  }

  async unpinExercise(id: number): Promise<Exercise | undefined> {
    const exercise = this.exercises.get(id);
    if (exercise) {
      const updatedExercise = { ...exercise, isPinned: false };
      this.exercises.set(id, updatedExercise);
      return updatedExercise;
    }
    return undefined;
  }

  // Playlist methods
  async getPlaylist(id: number): Promise<Playlist | undefined> {
    return this.playlists.get(id);
  }

  async getAllPlaylists(): Promise<Playlist[]> {
    return Array.from(this.playlists.values());
  }

  async getActivePlaylist(): Promise<Playlist | undefined> {
    return Array.from(this.playlists.values()).find(playlist => playlist.isActive);
  }

  async createPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const id = this.currentPlaylistId++;
    const playlist: Playlist = { ...insertPlaylist, id, isActive: false };
    this.playlists.set(id, playlist);
    return playlist;
  }

  async updatePlaylist(id: number, updates: Partial<Playlist>): Promise<Playlist | undefined> {
    const playlist = this.playlists.get(id);
    if (!playlist) return undefined;
    
    const updated = { ...playlist, ...updates };
    this.playlists.set(id, updated);
    return updated;
  }

  async deletePlaylist(id: number): Promise<boolean> {
    return this.playlists.delete(id);
  }

  async setActivePlaylist(id: number): Promise<void> {
    // Deactivate all playlists
    for (const [playlistId, playlist] of this.playlists) {
      this.playlists.set(playlistId, { ...playlist, isActive: false });
    }
    
    // Activate the specified playlist
    const playlist = this.playlists.get(id);
    if (playlist) {
      this.playlists.set(id, { ...playlist, isActive: true });
    }
  }

  // Progress methods
  async getProgress(exerciseId: number): Promise<Progress[]> {
    return Array.from(this.progress.values()).filter(p => p.exerciseId === exerciseId);
  }

  async getAllProgress(): Promise<Progress[]> {
    return Array.from(this.progress.values());
  }

  async getTodayProgress(): Promise<Progress[]> {
    const today = new Date().toISOString().split('T')[0];
    return Array.from(this.progress.values()).filter(p => 
      p.completedAt.startsWith(today)
    );
  }

  async createProgress(insertProgress: InsertProgress): Promise<Progress> {
    const id = this.currentProgressId++;
    const progressRecord: Progress = { ...insertProgress, id };
    this.progress.set(id, progressRecord);
    return progressRecord;
  }

  async getStreakDays(): Promise<number> {
    const progressByDay = new Map<string, boolean>();
    
    for (const progress of this.progress.values()) {
      const day = progress.completedAt.split('T')[0];
      progressByDay.set(day, true);
    }
    
    const sortedDays = Array.from(progressByDay.keys()).sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (const day of sortedDays) {
      const dayDate = new Date(day);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - streak);
      
      if (day === expectedDate.toISOString().split('T')[0]) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }
}

import { users, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// keep IStorage the same

// rewrite MemStorage to DatabaseStorage
import { DatabaseStorage } from "./database-storage";

export const storage = new DatabaseStorage();
