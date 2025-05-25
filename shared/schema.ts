import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  ageGroups: text("age_groups").array().notNull(),
  category: text("category").notNull(),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  isCompleted: boolean("is_completed").default(false),
});

export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  exerciseIds: integer("exercise_ids").array().notNull(),
  isActive: boolean("is_active").default(false),
});

export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  exerciseId: integer("exercise_id").notNull(),
  completedAt: text("completed_at").notNull(),
  playlistId: integer("playlist_id"),
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
  isCompleted: true,
});

export const insertPlaylistSchema = createInsertSchema(playlists).omit({
  id: true,
  isActive: true,
});

export const insertProgressSchema = createInsertSchema(progress).omit({
  id: true,
});

export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Exercise = typeof exercises.$inferSelect;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Playlist = typeof playlists.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Progress = typeof progress.$inferSelect;
