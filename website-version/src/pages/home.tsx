import { Link } from 'wouter'
import { ArrowRight, Play, Star, Users, Heart, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CATEGORY_DISPLAY_NAMES } from '@/lib/types'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 text-white py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-300/20 via-transparent to-cyan-300/20"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bubble mb-6 drop-shadow-lg">
            MY POCKET BUDDY
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-rounded font-bold drop-shadow-lg max-w-3xl mx-auto">
            Making exercise fun and accessible for children everywhere! 
            Discover engaging activities that help families stay active together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="bg-white text-purple-600 hover:bg-white/90 font-bold">
              <Link href="/exercises">
                <Play className="mr-2 h-5 w-5" />
                Start Exercising
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10 font-bold">
              <Link href="/programs">
                Explore Programs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bubble text-gray-900 dark:text-white mb-4">
              Why Choose MY POCKET BUDDY?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Designed with children and families in mind, our platform makes physical activity enjoyable and accessible for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <CardTitle className="text-xl font-bubble">Family Friendly</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Activities designed for children of all ages and abilities. No equipment needed - just enthusiasm!
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <CardTitle className="text-xl font-bubble">Safe & Accessible</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Carefully designed exercises that prioritize safety while being inclusive for children with different abilities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <CardTitle className="text-xl font-bubble">Fun First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Exercise shouldn't feel like work! Our activities are playful, engaging, and designed to spark joy in movement.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Exercise Categories */}
      <section className="py-16 px-4 bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bubble text-gray-900 dark:text-white mb-4">
              Exercise Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our carefully curated categories designed to develop different skills and abilities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {Object.entries(CATEGORY_DISPLAY_NAMES).map(([key, name]) => (
              <Link key={key} href={`/exercises/${key}`}>
                <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                  <CardHeader className="pb-2">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2 ${getCategoryGradient(key)}`}>
                      {getCategoryIcon(key)}
                    </div>
                    <CardTitle className="text-lg font-bubble">{name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {getCategoryDescription(key)}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bubble mb-6">
            Ready to Get Moving?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto font-rounded">
            Join thousands of families who are already making exercise a fun part of their daily routine!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-white/90 font-bold">
              <Link href="/exercises">
                <Play className="mr-2 h-5 w-5" />
                Browse All Exercises
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10 font-bold">
              <Link href="/about">
                Learn More About Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function getCategoryIcon(category: string): string {
  switch (category) {
    case 'balance':
      return '⚖️'
    case 'coordination':
      return '🤸'
    case 'strength':
      return '💪'
    case 'ballskills':
      return '⚽'
    case 'stretching':
      return '🧘'
    default:
      return '🏃'
  }
}

function getCategoryGradient(category: string): string {
  switch (category) {
    case 'balance':
      return 'bg-gradient-to-br from-blue-400 to-blue-600'
    case 'coordination':
      return 'bg-gradient-to-br from-purple-400 to-purple-600'
    case 'strength':
      return 'bg-gradient-to-br from-red-400 to-red-600'
    case 'ballskills':
      return 'bg-gradient-to-br from-green-400 to-green-600'
    case 'stretching':
      return 'bg-gradient-to-br from-pink-400 to-pink-600'
    default:
      return 'bg-gradient-to-br from-gray-400 to-gray-600'
  }
}

function getCategoryDescription(category: string): string {
  switch (category) {
    case 'balance':
      return 'Improve stability and body awareness'
    case 'coordination':
      return 'Enhance movement patterns and timing'
    case 'strength':
      return 'Build muscle power in a fun way'
    case 'ballskills':
      return 'Develop hand-eye coordination'
    case 'stretching':
      return 'Increase flexibility and relaxation'
    default:
      return 'Fun physical activities'
  }
}