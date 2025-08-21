# EduLearn Platform Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Clerk account for authentication
- OpenAI API key for AI features

### Environment Setup

1. **Create a `.env.local` file** in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/edulearn_db?schema=public"

# OpenAI API (for AI Assistant)
# ⚠️ IMPORTANT: Generate your own API key from https://platform.openai.com/api-keys
# NEVER share or commit API keys to version control
OPENAI_API_KEY=your_openai_api_key_here

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

## 🏗️ Project Structure

### Core Features Implemented

#### ✅ Authentication & User Management
- Clerk integration for secure authentication
- User profiles with metadata storage
- Role-based access control (Admin/User)
- Social sign-in options

#### ✅ Course Builder System (Admin)
- Visual drag-and-drop course builder
- PowerPoint-style slide editor
- Content blocks system:
  - Rich text editor
  - Image/Video embeds
  - Code blocks with syntax highlighting
  - Interactive quizzes
  - Callout boxes
- Course hierarchy: Courses → Modules → Lessons → Slides
- Real-time preview and auto-save

#### ✅ Learning Management
- Course catalog with search and filters
- Progress tracking and completion rates
- Personalized dashboard
- Learning paths and recommendations

#### ✅ Gamification
- XP and leveling system
- Achievement badges
- Streak tracking
- Leaderboards
- Progress visualization with charts

#### ✅ Social Features
- Friend system with requests
- Activity feed
- Study groups
- User profiles with statistics

#### ✅ User Interface
- Responsive design with Shadcn UI
- Dark/Light theme toggle
- Mobile-friendly navigation
- Interactive charts with Recharts

### Database Schema

The platform uses PostgreSQL with Prisma ORM. Key models include:
- **User**: Extended Clerk user with learning stats
- **Course**: Course content and metadata
- **Module/Lesson**: Hierarchical content structure
- **Progress**: User progress tracking
- **Achievement**: Gamification rewards
- **Friendship**: Social connections

### Admin Features

To access admin features:
1. Set user role to 'admin' in Clerk dashboard
2. Access `/admin` for course management
3. Use `/admin/courses/new` to create courses
4. Visual course builder at `/admin/courses/[id]/builder`

## 🔧 Configuration

### Clerk Setup
1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Configure OAuth providers (Google, GitHub, etc.)
3. Set up webhook endpoints for user sync
4. Add admin role in Clerk dashboard

### Database Setup
```bash
# Create database
createdb edulearn_db

# Run migrations
npx prisma migrate dev

# Seed sample data (optional)
npx prisma db seed
```

### OpenAI Integration
1. Get API key from [OpenAI Platform](https://platform.openai.com)
2. Set usage limits and monitoring
3. Configure model preferences (GPT-4, GPT-3.5-turbo)

## 📱 Key Routes

- `/` - Landing page
- `/dashboard` - User dashboard
- `/learn` - Course catalog
- `/progress` - Progress tracking and achievements
- `/social` - Social features and friends
- `/profile` - User profile and settings
- `/admin` - Admin dashboard (admin only)
- `/admin/courses/[id]/builder` - Course builder (admin only)

## 🚨 Security Notes

⚠️ **NEVER commit API keys or sensitive credentials to version control**

Best practices:
- Use environment variables for all secrets
- Rotate API keys regularly
- Implement rate limiting on API routes
- Use Clerk's built-in security features
- Enable CORS protection
- Validate and sanitize all user inputs

## 🛠️ Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Database commands
npx prisma studio  # Open Prisma Studio
npx prisma generate # Generate Prisma Client
npx prisma db push  # Push schema changes
```

## 📦 Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: PostgreSQL + Prisma
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Charts**: Recharts
- **Rich Text**: TipTap Editor
- **Drag & Drop**: @dnd-kit
- **AI Integration**: OpenAI API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is for educational purposes. Ensure you have proper licenses for any third-party services used.
