import { Program } from '@/lib/types'
import { exercises } from './exercises'

export const programs: Program[] = [
  {
    id: 1,
    title: "Morning Energizer",
    description: "Start your day with fun exercises that wake up your body and mind!",
    icon: "☀️",
    color: "from-yellow-400 to-orange-500",
    duration: 15,
    ageGroup: "3-12 years",
    difficulty: "Beginner",
    exercises: [
      exercises.find(e => e.name === "Reach for the Sky")!,
      exercises.find(e => e.name === "Jumping Jacks")!,
      exercises.find(e => e.name === "Cross Crawls")!,
      exercises.find(e => e.name === "Tree Pose")!,
    ]
  },
  {
    id: 2,
    title: "Balance Champions",
    description: "Become a balance champion with these fun stability challenges!",
    icon: "⚖️",
    color: "from-blue-400 to-purple-500",
    duration: 12,
    ageGroup: "4-12 years",
    difficulty: "Beginner",
    exercises: [
      exercises.find(e => e.name === "Tree Pose")!,
      exercises.find(e => e.name === "Flamingo Stand")!,
      exercises.find(e => e.name === "Tightrope Walk")!,
    ]
  },
  {
    id: 3,
    title: "Super Strength",
    description: "Build superhero strength with these fun and safe exercises!",
    icon: "💪",
    color: "from-red-400 to-pink-500",
    duration: 18,
    ageGroup: "5-12 years",
    difficulty: "Intermediate",
    exercises: [
      exercises.find(e => e.name === "Wall Push-ups")!,
      exercises.find(e => e.name === "Bear Crawl")!,
      exercises.find(e => e.name === "Superhero Plank")!,
    ]
  },
  {
    id: 4,
    title: "Ball Play Fun",
    description: "Improve your ball skills with these entertaining activities!",
    icon: "⚽",
    color: "from-green-400 to-teal-500",
    duration: 20,
    ageGroup: "4-12 years",
    difficulty: "Beginner",
    exercises: [
      exercises.find(e => e.name === "Ball Toss and Catch")!,
      exercises.find(e => e.name === "Dribbling Practice")!,
      exercises.find(e => e.name === "Rolling Ball Target")!,
    ]
  },
  {
    id: 5,
    title: "Calm and Stretch",
    description: "Wind down with gentle stretches that help you relax and feel good!",
    icon: "🧘",
    color: "from-purple-400 to-indigo-500",
    duration: 10,
    ageGroup: "3-12 years",
    difficulty: "Beginner",
    exercises: [
      exercises.find(e => e.name === "Cat-Cow Stretch")!,
      exercises.find(e => e.name === "Butterfly Stretch")!,
      exercises.find(e => e.name === "Reach for the Sky")!,
    ]
  },
  {
    id: 6,
    title: "Coordination Challenge",
    description: "Test your coordination with these fun movement patterns!",
    icon: "🤸",
    color: "from-cyan-400 to-blue-500",
    duration: 16,
    ageGroup: "5-12 years",
    difficulty: "Intermediate",
    exercises: [
      exercises.find(e => e.name === "Cross Crawls")!,
      exercises.find(e => e.name === "Hopscotch")!,
      exercises.find(e => e.name === "Jumping Jacks")!,
    ]
  }
]