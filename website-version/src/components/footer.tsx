import { Link } from 'wouter'
import { Heart, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bubble text-primary">MY POCKET BUDDY</h3>
            <p className="text-sm text-muted-foreground">
              Making exercise fun and accessible for children everywhere.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/exercises" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                All Exercises
              </Link>
              <Link href="/programs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Programs
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
            </nav>
          </div>

          {/* Exercise Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Categories</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/exercises/balance" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Balance
              </Link>
              <Link href="/exercises/coordination" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Coordination
              </Link>
              <Link href="/exercises/strength" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Strength
              </Link>
              <Link href="/exercises/ballskills" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Ball Skills
              </Link>
              <Link href="/exercises/stretching" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Stretching
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Get in Touch</h4>
            <div className="flex flex-col space-y-2">
              <a 
                href="mailto:hello@mypocketbuddy.com" 
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>hello@mypocketbuddy.com</span>
              </a>
              <Link 
                href="/contact"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>Contact Form</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © 2024 MY POCKET BUDDY. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-current" />
            <span>for children everywhere</span>
          </p>
        </div>
      </div>
    </footer>
  )
}