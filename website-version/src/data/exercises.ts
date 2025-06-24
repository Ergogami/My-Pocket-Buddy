import { Exercise } from '@/lib/types'

export const exercises: Exercise[] = [
  // Balance Exercises
  {
    id: 1,
    name: "Tree Pose",
    description: "Stand on one foot like a tall tree, holding your balance with arms stretched up high.",
    category: "balance",
    duration: 30,
    difficulty: "Easy",
    ageGroup: "3-12 years",
    equipment: [],
    benefits: ["Improves balance", "Strengthens core", "Builds focus"],
    instructions: [
      "Stand tall with feet together",
      "Lift one foot and place it on the opposite leg",
      "Raise arms up like tree branches",
      "Hold steady and breathe"
    ]
  },
  {
    id: 2,
    name: "Flamingo Stand",
    description: "Balance on one leg like a beautiful flamingo, keeping your body steady.",
    category: "balance",
    duration: 20,
    difficulty: "Easy",
    ageGroup: "3-12 years",
    equipment: [],
    benefits: ["Improves single-leg balance", "Strengthens ankles", "Enhances stability"],
    instructions: [
      "Stand on one foot",
      "Lift the other leg behind you",
      "Keep your body straight",
      "Switch legs after time is up"
    ]
  },
  {
    id: 3,
    name: "Tightrope Walk",
    description: "Walk along an imaginary tightrope, placing one foot in front of the other.",
    category: "balance",
    duration: 60,
    difficulty: "Medium",
    ageGroup: "4-12 years",
    equipment: [],
    benefits: ["Improves dynamic balance", "Enhances coordination", "Builds confidence"],
    instructions: [
      "Imagine a straight line on the floor",
      "Walk heel-to-toe along the line",
      "Keep arms out for balance",
      "Look ahead, not down"
    ]
  },

  // Coordination Exercises
  {
    id: 4,
    name: "Cross Crawls",
    description: "Touch your opposite elbow to knee while marching in place to build coordination.",
    category: "coordination",
    duration: 45,
    difficulty: "Easy",
    ageGroup: "4-12 years",
    equipment: [],
    benefits: ["Improves cross-body coordination", "Enhances brain function", "Builds rhythm"],
    instructions: [
      "Stand with feet hip-width apart",
      "Lift right knee and touch with left elbow",
      "Lower and repeat on opposite side",
      "Keep a steady rhythm"
    ]
  },
  {
    id: 5,
    name: "Jumping Jacks",
    description: "Jump your feet apart while raising your arms, then jump back together.",
    category: "coordination",
    duration: 30,
    difficulty: "Easy",
    ageGroup: "4-12 years",
    equipment: [],
    benefits: ["Improves full-body coordination", "Increases heart rate", "Builds endurance"],
    instructions: [
      "Start with feet together, arms at sides",
      "Jump feet apart while raising arms overhead",
      "Jump back to starting position",
      "Keep a steady pace"
    ]
  },
  {
    id: 6,
    name: "Hopscotch",
    description: "Hop through numbered squares on one foot, then both feet in a fun pattern.",
    category: "coordination",
    duration: 90,
    difficulty: "Medium",
    ageGroup: "5-12 years",
    equipment: ["Chalk or tape for squares"],
    benefits: ["Improves hopping coordination", "Builds leg strength", "Enhances planning"],
    instructions: [
      "Draw hopscotch squares on ground",
      "Hop on one foot through single squares",
      "Use both feet for side-by-side squares",
      "Turn around and hop back"
    ]
  },

  // Strength Exercises
  {
    id: 7,
    name: "Bear Crawl",
    description: "Crawl forward on hands and feet like a strong bear, keeping your back straight.",
    category: "strength",
    duration: 30,
    difficulty: "Medium",
    ageGroup: "4-12 years",
    equipment: [],
    benefits: ["Builds full-body strength", "Improves core stability", "Enhances coordination"],
    instructions: [
      "Start on hands and feet",
      "Keep knees slightly off ground",
      "Crawl forward moving opposite hand and foot",
      "Keep back straight and core tight"
    ]
  },
  {
    id: 8,
    name: "Wall Push-ups",
    description: "Push against a wall to build arm and chest strength in a fun, safe way.",
    category: "strength",
    duration: 30,
    difficulty: "Easy",
    ageGroup: "3-12 years",
    equipment: [],
    benefits: ["Builds arm strength", "Strengthens chest", "Improves posture"],
    instructions: [
      "Stand arm's length from wall",
      "Place palms flat against wall",
      "Push body toward wall, then back",
      "Keep body straight throughout"
    ]
  },
  {
    id: 9,
    name: "Superhero Plank",
    description: "Hold a plank position like a flying superhero to build core strength.",
    category: "strength",
    duration: 20,
    difficulty: "Medium",
    ageGroup: "5-12 years",
    equipment: [],
    benefits: ["Builds core strength", "Improves stability", "Enhances endurance"],
    instructions: [
      "Start in push-up position",
      "Keep body straight from head to heels",
      "Hold position while breathing steadily",
      "Pretend you're flying like a superhero"
    ]
  },

  // Ball Skills
  {
    id: 10,
    name: "Ball Toss and Catch",
    description: "Toss a ball up and catch it to improve hand-eye coordination.",
    category: "ballskills",
    duration: 60,
    difficulty: "Easy",
    ageGroup: "3-12 years",
    equipment: ["Soft ball or bean bag"],
    benefits: ["Improves hand-eye coordination", "Builds catching skills", "Enhances focus"],
    instructions: [
      "Hold ball with both hands",
      "Toss ball straight up",
      "Watch the ball carefully",
      "Catch with both hands"
    ]
  },
  {
    id: 11,
    name: "Dribbling Practice",
    description: "Bounce a ball up and down to develop ball control and rhythm.",
    category: "ballskills",
    duration: 45,
    difficulty: "Medium",
    ageGroup: "5-12 years",
    equipment: ["Basketball or playground ball"],
    benefits: ["Improves ball control", "Builds hand coordination", "Develops rhythm"],
    instructions: [
      "Hold ball with one hand",
      "Push ball down with fingertips",
      "Let ball bounce back to hand",
      "Keep steady rhythm"
    ]
  },
  {
    id: 12,
    name: "Rolling Ball Target",
    description: "Roll a ball to hit targets and improve accuracy and control.",
    category: "ballskills",
    duration: 90,
    difficulty: "Medium",
    ageGroup: "4-12 years",
    equipment: ["Ball", "Cones or targets"],
    benefits: ["Improves accuracy", "Builds rolling technique", "Enhances aim"],
    instructions: [
      "Set up targets in a line",
      "Kneel or sit on ground",
      "Roll ball toward targets",
      "Try to hit each target"
    ]
  },

  // Stretching Exercises
  {
    id: 13,
    name: "Cat-Cow Stretch",
    description: "Arch and round your back like a cat to stretch your spine gently.",
    category: "stretching",
    duration: 45,
    difficulty: "Easy",
    ageGroup: "3-12 years",
    equipment: [],
    benefits: ["Improves spine flexibility", "Reduces tension", "Enhances posture"],
    instructions: [
      "Start on hands and knees",
      "Arch back and look up (cow)",
      "Round back and tuck chin (cat)",
      "Move slowly between positions"
    ]
  },
  {
    id: 14,
    name: "Butterfly Stretch",
    description: "Sit with feet together and gently flap your knees like butterfly wings.",
    category: "stretching",
    duration: 30,
    difficulty: "Easy",
    ageGroup: "3-12 years",
    equipment: [],
    benefits: ["Stretches inner thighs", "Improves hip flexibility", "Promotes relaxation"],
    instructions: [
      "Sit with soles of feet together",
      "Hold feet with hands",
      "Gently flap knees up and down",
      "Breathe deeply and relax"
    ]
  },
  {
    id: 15,
    name: "Reach for the Sky",
    description: "Stretch your arms high above your head and reach toward the clouds.",
    category: "stretching",
    duration: 20,
    difficulty: "Easy",
    ageGroup: "3-12 years",
    equipment: [],
    benefits: ["Stretches arms and sides", "Improves posture", "Energizes body"],
    instructions: [
      "Stand tall with feet apart",
      "Raise both arms overhead",
      "Stretch one arm higher, then the other",
      "Take deep breaths while stretching"
    ]
  }
]