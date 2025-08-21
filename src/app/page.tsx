import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Trophy,
  Users,
  BookOpen,
  Sparkles,
  Target,
  Zap,
  Globe,
  ChevronRight,
  Star,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-background to-secondary/20'>
      {/* Navbar */}
      <nav className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center'>
              <Brain className='h-8 w-8 text-primary mr-2' />
              <span className='text-2xl font-bold'>EduLearn</span>
            </div>
            <div className='flex items-center gap-4'>
              <ThemeToggle />
              <Link href='/sign-in'>
                <Button variant='ghost'>Sign In</Button>
              </Link>
              <Link href='/sign-up'>
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='container mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        <div className='text-center max-w-4xl mx-auto'>
          <Badge className='mb-4' variant='secondary'>
            <Sparkles className='h-3 w-3 mr-1' />
            AI-Powered Learning Platform
          </Badge>
          <h1 className='text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
            Learn Smarter, Not Harder
          </h1>
          <p className='text-xl text-muted-foreground mb-8'>
            Experience personalized education with AI tutoring, gamification, and social learning.
            Master any subject at your own pace with our intelligent learning system.
          </p>
          <div className='flex gap-4 justify-center'>
            <Link href='/sign-up'>
              <Button size='lg' className='gap-2'>
                Start Learning Free
                <ChevronRight className='h-4 w-4' />
              </Button>
            </Link>
            <Link href='#features'>
              <Button size='lg' variant='outline'>
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          {[
            { label: 'Active Learners', value: '50K+', icon: Users },
            { label: 'Courses Available', value: '500+', icon: BookOpen },
            { label: 'Completion Rate', value: '94%', icon: Target },
            { label: 'AI Interactions', value: '1M+', icon: Brain },
          ].map((stat, index) => (
            <Card key={index} className='text-center'>
              <CardContent className='pt-6'>
                <stat.icon className='h-8 w-8 mx-auto mb-2 text-primary' />
                <div className='text-2xl font-bold'>{stat.value}</div>
                <div className='text-sm text-muted-foreground'>{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='container mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl sm:text-4xl font-bold mb-4'>
            Everything You Need to Succeed
          </h2>
          <p className='text-lg text-muted-foreground'>
            Powerful features designed to accelerate your learning journey
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[
            {
              icon: Brain,
              title: 'AI Personal Tutor',
              description: 'Get instant help, explanations, and personalized guidance from our AI assistant.',
              color: 'text-blue-500',
            },
            {
              icon: Trophy,
              title: 'Gamification & Rewards',
              description: 'Earn badges, maintain streaks, and climb leaderboards as you progress.',
              color: 'text-yellow-500',
            },
            {
              icon: Users,
              title: 'Social Learning',
              description: 'Connect with peers, join study groups, and learn together.',
              color: 'text-green-500',
            },
            {
              icon: Zap,
              title: 'Adaptive Learning',
              description: 'Content adjusts to your pace and learning style automatically.',
              color: 'text-purple-500',
            },
            {
              icon: Target,
              title: 'Progress Tracking',
              description: 'Visualize your learning journey with detailed analytics and insights.',
              color: 'text-red-500',
            },
            {
              icon: Globe,
              title: 'Learn Anywhere',
              description: 'Access your courses on any device, anytime, anywhere.',
              color: 'text-indigo-500',
            },
          ].map((feature, index) => (
            <Card key={index} className='group hover:shadow-lg transition-shadow'>
              <CardContent className='pt-6'>
                <feature.icon className={`h-12 w-12 mb-4 ${feature.color}`} />
                <h3 className='text-xl font-semibold mb-2'>{feature.title}</h3>
                <p className='text-muted-foreground'>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='container mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-secondary/10'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl sm:text-4xl font-bold mb-4'>
            Loved by Learners Worldwide
          </h2>
          <p className='text-lg text-muted-foreground'>
            Join thousands who have transformed their learning experience
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-6'>
          {[
            {
              name: 'Sarah Johnson',
              role: 'Computer Science Student',
              content: 'The AI tutor is incredible! It\'s like having a personal teacher available 24/7.',
              rating: 5,
            },
            {
              name: 'Mike Chen',
              role: 'Professional Developer',
              content: 'Gamification keeps me motivated. I\'ve maintained a 30-day streak!',
              rating: 5,
            },
            {
              name: 'Emma Davis',
              role: 'High School Teacher',
              content: 'The adaptive learning system perfectly matches each student\'s pace.',
              rating: 5,
            },
          ].map((testimonial, index) => (
            <Card key={index}>
              <CardContent className='pt-6'>
                <div className='flex mb-4'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className='h-4 w-4 fill-primary text-primary' />
                  ))}
                </div>
                <p className='text-muted-foreground mb-4'>"{testimonial.content}"</p>
                <div>
                  <div className='font-semibold'>{testimonial.name}</div>
                  <div className='text-sm text-muted-foreground'>{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className='container mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        <Card className='bg-primary text-primary-foreground'>
          <CardContent className='text-center py-12'>
            <h2 className='text-3xl sm:text-4xl font-bold mb-4'>
              Ready to Transform Your Learning?
            </h2>
            <p className='text-xl mb-8 opacity-90'>
              Join thousands of learners and start your journey today
            </p>
            <Link href='/sign-up'>
              <Button size='lg' variant='secondary' className='gap-2'>
                Get Started for Free
                <ChevronRight className='h-4 w-4' />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className='border-t bg-background'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center mb-4 md:mb-0'>
              <Brain className='h-6 w-6 text-primary mr-2' />
              <span className='text-lg font-semibold'>EduLearn</span>
            </div>
            <div className='flex gap-6 text-sm text-muted-foreground'>
              <Link href='#' className='hover:text-foreground'>Privacy</Link>
              <Link href='#' className='hover:text-foreground'>Terms</Link>
              <Link href='#' className='hover:text-foreground'>Contact</Link>
              <Link href='#' className='hover:text-foreground'>About</Link>
            </div>
          </div>
          <div className='text-center mt-8 text-sm text-muted-foreground'>
            © 2024 EduLearn. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}