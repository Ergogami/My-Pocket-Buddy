import { Link } from 'wouter'
import { ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        {/* Large 404 */}
        <div className="space-y-4">
          <div className="text-8xl md:text-9xl font-bubble text-gray-300 dark:text-gray-700">
            404
          </div>
          <div className="text-6xl">🤔</div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bubble text-gray-900 dark:text-white">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            It looks like this page decided to go on its own adventure! 
            Don't worry, let's get you back to the fun activities.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" asChild>
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/exercises">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Browse Exercises
            </Link>
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-muted">
          <p className="text-sm text-muted-foreground mb-4">
            Looking for something specific? Try these popular pages:
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/exercises/balance" 
              className="text-sm text-primary hover:underline"
            >
              Balance Exercises
            </Link>
            <Link 
              href="/exercises/coordination" 
              className="text-sm text-primary hover:underline"
            >
              Coordination
            </Link>
            <Link 
              href="/programs" 
              className="text-sm text-primary hover:underline"
            >
              Exercise Programs
            </Link>
            <Link 
              href="/about" 
              className="text-sm text-primary hover:underline"
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className="text-sm text-primary hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}