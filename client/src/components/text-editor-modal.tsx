import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TextEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TextEditorModal({ isOpen, onClose }: TextEditorModalProps) {
  const [appTexts, setAppTexts] = useState({
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
    startButton: "Start Adventure",
    programButton: "My Program",
    exercisesTitle: "ADVENTURE EXERCISES",
    searchPlaceholder: "Search for fun exercises...",
    findAdventureTitle: "Find Your Adventure!"
  });

  const { toast } = useToast();

  const handleSave = () => {
    // Save to localStorage for now
    localStorage.setItem('appTexts', JSON.stringify(appTexts));
    
    toast({
      title: "Success!",
      description: "Your text changes have been saved!",
    });
    
    // Trigger a page reload to apply changes
    window.location.reload();
  };

  const handleReset = () => {
    localStorage.removeItem('appTexts');
    toast({
      title: "Reset Complete",
      description: "All text has been reset to default.",
    });
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Edit App Text
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-purple-700">Header</h3>
            <div>
              <Label htmlFor="appTitle">App Title</Label>
              <Input
                id="appTitle"
                value={appTexts.appTitle}
                onChange={(e) => setAppTexts({...appTexts, appTitle: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="appSubtitle">App Subtitle</Label>
              <Input
                id="appSubtitle"
                value={appTexts.appSubtitle}
                onChange={(e) => setAppTexts({...appTexts, appSubtitle: e.target.value})}
                className="mt-1"
              />
            </div>
          </div>

          {/* Welcome Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-purple-700">Welcome Section</h3>
            <div>
              <Label htmlFor="welcomeTitle">Welcome Title</Label>
              <Input
                id="welcomeTitle"
                value={appTexts.welcomeTitle}
                onChange={(e) => setAppTexts({...appTexts, welcomeTitle: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="welcomeSubtitle1">Welcome Subtitle 1</Label>
              <Input
                id="welcomeSubtitle1"
                value={appTexts.welcomeSubtitle1}
                onChange={(e) => setAppTexts({...appTexts, welcomeSubtitle1: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="welcomeSubtitle2">Welcome Subtitle 2</Label>
              <Input
                id="welcomeSubtitle2"
                value={appTexts.welcomeSubtitle2}
                onChange={(e) => setAppTexts({...appTexts, welcomeSubtitle2: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="welcomeDescription">Welcome Description</Label>
              <Textarea
                id="welcomeDescription"
                value={appTexts.welcomeDescription}
                onChange={(e) => setAppTexts({...appTexts, welcomeDescription: e.target.value})}
                className="mt-1"
              />
            </div>
          </div>

          {/* Main Card Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-purple-700">Main Card Text</h3>
            {['mainCardTitle1', 'mainCardTitle2', 'mainCardTitle3', 'mainCardTitle4', 'mainCardTitle5'].map((key, index) => (
              <div key={key}>
                <Label htmlFor={key}>Main Card Title {index + 1}</Label>
                <Input
                  id={key}
                  value={appTexts[key as keyof typeof appTexts]}
                  onChange={(e) => setAppTexts({...appTexts, [key]: e.target.value})}
                  className="mt-1"
                />
              </div>
            ))}
          </div>

          {/* Guide Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-purple-700">Guide Section</h3>
            <div>
              <Label htmlFor="guideGreeting">Guide Greeting</Label>
              <Input
                id="guideGreeting"
                value={appTexts.guideGreeting}
                onChange={(e) => setAppTexts({...appTexts, guideGreeting: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="guideIntro">Guide Introduction</Label>
              <Input
                id="guideIntro"
                value={appTexts.guideIntro}
                onChange={(e) => setAppTexts({...appTexts, guideIntro: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="guideDescription">Guide Description</Label>
              <Textarea
                id="guideDescription"
                value={appTexts.guideDescription}
                onChange={(e) => setAppTexts({...appTexts, guideDescription: e.target.value})}
                className="mt-1"
              />
            </div>
          </div>

          {/* Buttons and Other Text */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-purple-700">Buttons & Other</h3>
            <div>
              <Label htmlFor="startButton">Start Button Text</Label>
              <Input
                id="startButton"
                value={appTexts.startButton}
                onChange={(e) => setAppTexts({...appTexts, startButton: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="programButton">Program Button Text</Label>
              <Input
                id="programButton"
                value={appTexts.programButton}
                onChange={(e) => setAppTexts({...appTexts, programButton: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="exercisesTitle">Exercises Section Title</Label>
              <Input
                id="exercisesTitle"
                value={appTexts.exercisesTitle}
                onChange={(e) => setAppTexts({...appTexts, exercisesTitle: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="searchPlaceholder">Search Placeholder</Label>
              <Input
                id="searchPlaceholder"
                value={appTexts.searchPlaceholder}
                onChange={(e) => setAppTexts({...appTexts, searchPlaceholder: e.target.value})}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1 bg-green-500 hover:bg-green-600">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button onClick={handleReset} variant="outline" className="flex-1">
              Reset to Default
            </Button>
            <Button onClick={onClose} variant="outline">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}