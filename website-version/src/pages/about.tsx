import { Heart, Users, Shield, Star, Target, Award } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bubble mb-6 drop-shadow-lg">
            About MY POCKET BUDDY
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-rounded max-w-3xl mx-auto">
            We believe every child deserves access to fun, safe, and engaging physical activities 
            that promote healthy development and family bonding.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bubble text-gray-900 dark:text-white mb-8">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              MY POCKET BUDDY was created to make physical activity accessible, enjoyable, and beneficial 
              for children of all ages and abilities. We understand that every child is unique, and our 
              platform is designed to accommodate different developmental stages, physical capabilities, 
              and learning styles.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-bubble text-gray-900 dark:text-white mb-2">Inclusive</h3>
                <p className="text-muted-foreground">
                  Designed for children of all abilities and backgrounds
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="text-xl font-bubble text-gray-900 dark:text-white mb-2">Safe</h3>
                <p className="text-muted-foreground">
                  All activities prioritize safety and proper form
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600 dark:text-purple-300" />
                </div>
                <h3 className="text-xl font-bubble text-gray-900 dark:text-white mb-2">Family-Focused</h3>
                <p className="text-muted-foreground">
                  Bringing families together through shared activities
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bubble text-gray-900 dark:text-white mb-4">
              Our Approach
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine expert knowledge with child-centered design to create experiences that are both educational and entertaining.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <CardTitle className="text-xl font-bubble">Evidence-Based Design</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Our exercises are based on child development research and physical education best practices. 
                  We work with pediatric fitness experts to ensure every activity supports healthy growth and development.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <CardTitle className="text-xl font-bubble">Fun-First Philosophy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  We believe that exercise should never feel like a chore. Every activity is designed to be engaging, 
                  playful, and enjoyable, making children excited to move and be active.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <CardTitle className="text-xl font-bubble">Safety First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  All our exercises are carefully reviewed for safety and appropriateness. We provide clear instructions 
                  and modifications to ensure children can participate safely regardless of their fitness level.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                </div>
                <CardTitle className="text-xl font-bubble">Accessibility Focused</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  We're committed to making physical activity accessible to all children. Our platform includes 
                  modifications for different abilities and clear, colorblind-friendly visual design.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bubble text-gray-900 dark:text-white mb-4">
              What Makes Us Different
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform is built with children and families in mind, offering unique features that set us apart.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-bubble text-gray-900 dark:text-white mb-2">Age-Appropriate</h3>
              <p className="text-sm text-muted-foreground">
                Exercises specifically designed and tested for different age groups and developmental stages.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-lg font-bubble text-gray-900 dark:text-white mb-2">Home-Friendly</h3>
              <p className="text-sm text-muted-foreground">
                No special equipment needed - all activities can be done safely in any home environment.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-lg font-bubble text-gray-900 dark:text-white mb-2">Family Bonding</h3>
              <p className="text-sm text-muted-foreground">
                Activities designed to bring families together and create positive shared experiences.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">♿</div>
              <h3 className="text-lg font-bubble text-gray-900 dark:text-white mb-2">Inclusive Design</h3>
              <p className="text-sm text-muted-foreground">
                Modifications and alternatives provided to accommodate children with different abilities.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-lg font-bubble text-gray-900 dark:text-white mb-2">Easy Access</h3>
              <p className="text-sm text-muted-foreground">
                No downloads or accounts required - instant access from any device with an internet connection.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-lg font-bubble text-gray-900 dark:text-white mb-2">Visual Design</h3>
              <p className="text-sm text-muted-foreground">
                Colorblind-friendly design with clear visual cues that work for all children.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bubble mb-6">
            Join Our Community
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto font-rounded">
            Help us make physical activity fun and accessible for every child. 
            Together, we can build healthier, happier families.
          </p>
          <div className="text-6xl mb-4">💝</div>
          <p className="text-lg opacity-90">
            Made with love for children everywhere
          </p>
        </div>
      </section>
    </div>
  )
}