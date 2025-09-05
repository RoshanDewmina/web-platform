# Web Learning Platform

A modern, multi-tenant learning management system built with Next.js, TypeScript, and PostgreSQL. Create interactive courses, track student progress, and deliver engaging educational content.

## 🚀 Features

### Core Functionality
- **Course Management**: Create structured courses with modules, lessons, and interactive slides
- **Content Builder**: Visual drag-and-drop interface for creating educational content
- **Multi-tenant Architecture**: Isolated data for different organizations/users
- **Progress Tracking**: Monitor student progress, XP, and achievements
- **Interactive Learning**: Quizzes, code exercises, and multimedia content
- **Gamification**: Points, levels, achievements, and leaderboards
- **Real-time Analytics**: Track engagement and learning outcomes

### Technical Features
- **Modern Stack**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk (configurable for development/production)
- **Storage**: MinIO for S3-compatible object storage
- **Vector Search**: Qdrant for semantic search capabilities
- **AI Integration**: Support for AI-powered content generation
- **Docker**: Containerized for easy deployment

## 📋 Prerequisites

- Node.js 18+ or Bun
- Docker and Docker Compose
- PostgreSQL (via Docker)
- Git

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/web-platform.git
   cd web-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   ```

4. **Start Docker services:**
   ```bash
   docker-compose up -d
   ```

5. **Set up the database:**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

6. **Run the development server:**
   ```bash
   npm run dev
   # or
   bun dev
   ```

7. **Access the application:**
   - Main app: http://localhost:3000
   - Admin panel: http://localhost:3000/admin
   - Course creation: http://localhost:3000/admin/courses/new

## 📚 Creating Courses

See the comprehensive [Course Creation Guide](./COURSE_CREATION_GUIDE.md) for detailed instructions on:
- Using the visual Course Builder
- Creating courses via API
- Bulk importing content
- Best practices for course structure

### Quick Start
1. Navigate to http://localhost:3000/admin/courses/new
2. Fill in course details
3. Use the Course Builder to add modules, lessons, and content
4. Publish when ready

## 🏗️ Project Structure

```
web-platform/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── course-builder/   # Course creation tools
│   │   ├── slide-builder/    # Slide editor components
│   │   └── ui/               # Shared UI components
│   ├── lib/              # Utility functions and helpers
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript type definitions
├── prisma/
│   └── schema.prisma     # Database schema
├── public/               # Static assets
├── scripts/              # Utility scripts
├── docker-compose.yml    # Docker services configuration
└── package.json          # Project dependencies
```

## 🐳 Docker Services

The platform includes several Docker services:

```yaml
- PostgreSQL   # Main database (port 5432)
- MinIO        # S3-compatible storage (port 9000)
- Qdrant       # Vector database (port 6333)
```

Manage services:
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔧 Development

### Running Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Database Management
```bash
# Create migration
npx prisma migrate dev --name description

# Reset database
npx prisma migrate reset

# View database
npx prisma studio
```

### Building for Production
```bash
# Build application
npm run build

# Start production server
npm start

# Or use Docker
docker-compose up web
```

## 📖 Documentation

- [Course Creation Guide](./COURSE_CREATION_GUIDE.md) - How to create courses
- [API Documentation](#) - Coming soon
- [Component Library](#) - Coming soon

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

**Database connection failed:**
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart database
docker-compose restart db
```

**Port already in use:**
```bash
# Find process using port 3000
lsof -i :3000

# Use different port
PORT=3001 npm run dev
```

**Schema out of sync:**
```bash
# Reset and sync database
npx prisma db push --force-reset
```

See [Course Creation Guide](./COURSE_CREATION_GUIDE.md#troubleshooting) for more troubleshooting tips.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database ORM by [Prisma](https://www.prisma.io/)
- Authentication by [Clerk](https://clerk.dev/)

---

For detailed course creation instructions, see the [Course Creation Guide](./COURSE_CREATION_GUIDE.md).