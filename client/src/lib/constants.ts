export const EXERCISE_CATEGORIES = [
  "All Exercises",
  "balance",
  "strength", 
  "flexibility",
  "ball-skills",
  "coordination",
  "cardio"
] as const;

export const CATEGORY_DISPLAY_NAMES = {
  "All Exercises": "All Exercises",
  "balance": "Balance",
  "strength": "Strength",
  "flexibility": "Flexibility", 
  "ball-skills": "Ball Skills",
  "coordination": "Coordination",
  "cardio": "Cardio"
} as const;

export const AGE_GROUPS = [
  "3-5",
  "6-8", 
  "9-12",
] as const;

export const VIDEO_FILE_TYPES = [
  "video/mp4",
  "video/webm", 
  "video/avi",
] as const;

export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
