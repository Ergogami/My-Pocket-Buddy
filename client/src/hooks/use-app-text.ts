import { useState, useEffect } from "react";

const defaultTexts = {
  appTitle: "MY POCKET BUDDY",
  appSubtitle: "Adventure awaits!",
  welcomeTitle: "Welcome to",
  welcomeSubtitle1: "YOUR FITNESS",
  welcomeSubtitle2: "ADVENTURE!",
  welcomeDescription: "Explore fun exercises and grow stronger every day!",
  mainCardTitle1: "ALL YOUR",
  mainCardTitle2: "AMAZING",
  mainCardTitle3: "EXERCISES",
  mainCardTitle4: "IN YOUR",
  mainCardTitle5: "POCKET!",
  guideGreeting: "HELLO!",
  guideIntro: "I'm your Guide!",
  guideDescription: "Ready to explore amazing exercises and have tons of fun together?",
  startButton: "🌟 Start Adventure",
  programButton: "My Program",
  exercisesTitle: "ADVENTURE EXERCISES",
  searchPlaceholder: "Search for fun exercises...",
  findAdventureTitle: "Find Your Adventure!"
};

export function useAppText() {
  const [texts, setTexts] = useState(defaultTexts);

  useEffect(() => {
    const savedTexts = localStorage.getItem('appTexts');
    if (savedTexts) {
      try {
        const parsedTexts = JSON.parse(savedTexts);
        setTexts({ ...defaultTexts, ...parsedTexts });
      } catch (error) {
        console.error('Error parsing saved texts:', error);
      }
    }
    
    // Listen for storage changes to update in real-time
    const handleStorageChange = () => {
      const savedTexts = localStorage.getItem('appTexts');
      if (savedTexts) {
        try {
          const parsedTexts = JSON.parse(savedTexts);
          setTexts({ ...defaultTexts, ...parsedTexts });
        } catch (error) {
          console.error('Error parsing saved texts:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-window updates
    window.addEventListener('appTextsUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('appTextsUpdated', handleStorageChange);
    };
  }, []);

  return texts;
}