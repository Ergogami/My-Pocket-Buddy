import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/home";
import SearchPage from "@/pages/search";
import PlaylistPage from "@/pages/playlist";
import CategoryPage from "@/pages/category";
import ProgramsPage from "@/pages/programs";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/programs" component={ProgramsPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/playlist" component={PlaylistPage} />
      <Route path="/category/:category" component={({ params }) => <CategoryPage category={params.category} />} />
      <Route component={() => <div>404 - Page Not Found</div>} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
