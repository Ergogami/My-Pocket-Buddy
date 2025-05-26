import { Exercise, Playlist, Progress, InsertExercise, InsertPlaylist, InsertProgress, exercises, playlists, progress } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  async getExercise(id: number): Promise<Exercise | undefined> {
    const [exercise] = await db.select().from(exercises).where(eq(exercises.id, id));
    return exercise || undefined;
  }

  async getAllExercises(): Promise<Exercise[]> {
    return await db.select().from(exercises);
  }

  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    return await db.select().from(exercises).where(eq(exercises.category, category));
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const [exercise] = await db
      .insert(exercises)
      .values(insertExercise)
      .returning();
    return exercise;
  }

  async updateExercise(id: number, updates: Partial<Exercise>): Promise<Exercise | undefined> {
    const [exercise] = await db
      .update(exercises)
      .set(updates)
      .where(eq(exercises.id, id))
      .returning();
    return exercise || undefined;
  }

  async deleteExercise(id: number): Promise<boolean> {
    const result = await db.delete(exercises).where(eq(exercises.id, id));
    return result.rowCount > 0;
  }

  async pinExercise(id: number): Promise<Exercise | undefined> {
    try {
      const [updatedExercise] = await db
        .update(exercises)
        .set({ isPinned: true })
        .where(eq(exercises.id, id))
        .returning();
      return updatedExercise;
    } catch (error) {
      console.error('Error pinning exercise:', error);
      return undefined;
    }
  }

  async unpinExercise(id: number): Promise<Exercise | undefined> {
    try {
      const [updatedExercise] = await db
        .update(exercises)
        .set({ isPinned: false })
        .where(eq(exercises.id, id))
        .returning();
      return updatedExercise;
    } catch (error) {
      console.error('Error unpinning exercise:', error);
      return undefined;
    }
  }

  async getPlaylist(id: number): Promise<Playlist | undefined> {
    const [playlist] = await db.select().from(playlists).where(eq(playlists.id, id));
    return playlist || undefined;
  }

  async getAllPlaylists(): Promise<Playlist[]> {
    return await db.select().from(playlists);
  }

  async getActivePlaylist(): Promise<Playlist | undefined> {
    const [playlist] = await db.select().from(playlists).where(eq(playlists.isActive, true));
    return playlist || undefined;
  }

  async createPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const [playlist] = await db
      .insert(playlists)
      .values(insertPlaylist)
      .returning();
    return playlist;
  }

  async updatePlaylist(id: number, updates: Partial<Playlist>): Promise<Playlist | undefined> {
    const [playlist] = await db
      .update(playlists)
      .set(updates)
      .where(eq(playlists.id, id))
      .returning();
    return playlist || undefined;
  }

  async deletePlaylist(id: number): Promise<boolean> {
    const result = await db.delete(playlists).where(eq(playlists.id, id));
    return result.rowCount > 0;
  }

  async setActivePlaylist(id: number): Promise<void> {
    // First deactivate all playlists
    await db.update(playlists).set({ isActive: false });
    // Then activate the selected one
    await db.update(playlists).set({ isActive: true }).where(eq(playlists.id, id));
  }

  async getProgress(exerciseId: number): Promise<Progress[]> {
    return await db.select().from(progress).where(eq(progress.exerciseId, exerciseId));
  }

  async getAllProgress(): Promise<Progress[]> {
    return await db.select().from(progress);
  }

  async getTodayProgress(): Promise<Progress[]> {
    const today = new Date().toISOString().split('T')[0];
    return await db.select().from(progress).where(eq(progress.completedAt, today));
  }

  async createProgress(insertProgress: InsertProgress): Promise<Progress> {
    const [progressRecord] = await db
      .insert(progress)
      .values(insertProgress)
      .returning();
    return progressRecord;
  }

  async getStreakDays(): Promise<number> {
    const allProgress = await this.getAllProgress();
    if (allProgress.length === 0) return 0;

    const dates = [...new Set(allProgress.map(p => p.completedAt))].sort().reverse();
    let streak = 0;
    let currentDate = new Date();
    
    for (const date of dates) {
      const progressDate = new Date(date);
      const diffDays = Math.floor((currentDate.getTime() - progressDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
        currentDate = progressDate;
      } else {
        break;
      }
    }
    
    return streak;
  }
}