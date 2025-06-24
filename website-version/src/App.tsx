import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router, Route, Switch } from 'wouter'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/header'
import Footer from '@/components/footer'
import HomePage from '@/pages/home'
import ExercisesPage from '@/pages/exercises'
import ProgramsPage from '@/pages/programs'
import PlaylistPage from '@/pages/playlist'
import AboutPage from '@/pages/about'
import ContactPage from '@/pages/contact'
import NotFoundPage from '@/pages/not-found'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    }
  }
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="pocket-buddy-theme">
        <Router>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50">
            {/* Skip to content link for accessibility */}
            <a href="#main-content" className="skip-to-content">
              Skip to main content
            </a>
            
            <Header />
            
            <main id="main-content" className="flex-1" role="main">
              <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/exercises" component={ExercisesPage} />
                <Route path="/exercises/:category" component={ExercisesPage} />
                <Route path="/programs" component={ProgramsPage} />
                <Route path="/playlist" component={PlaylistPage} />
                <Route path="/about" component={AboutPage} />
                <Route path="/contact" component={ContactPage} />
                <Route component={NotFoundPage} />
              </Switch>
            </main>
            
            <Footer />
            <Toaster />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App