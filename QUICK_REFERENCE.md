# Quick Reference - Course Creation

## 🚀 Quick Commands

### Start the Platform
```bash
# Start all services
docker-compose up -d

# Start development server
npm run dev
```

### Create a Course

#### Option 1: Web Interface (Easiest)
1. Go to: http://localhost:3000/admin/courses/new
2. Fill form → Create → Use Course Builder

#### Option 2: Run Script
```bash
# Create sample course
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public" \
node scripts/create-course-basic.js
```

#### Option 3: API Call
```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Course",
    "description": "Course description",
    "category": "Programming",
    "difficulty": "BEGINNER",
    "tags": ["tag1", "tag2"],
    "visibility": "PUBLIC"
  }'
```

## 📊 Database Queries

### View All Courses
```bash
docker exec -it web-platform-db-1 psql -U postgres -d postgres -c \
"SELECT id, title, \"isPublished\" FROM \"Course\";"
```

### View Course Structure
```bash
docker exec -it web-platform-db-1 psql -U postgres -d postgres -c \
"SELECT c.title, COUNT(DISTINCT m.id) as modules, COUNT(DISTINCT l.id) as lessons \
FROM \"Course\" c \
LEFT JOIN \"Module\" m ON m.\"courseId\" = c.id \
LEFT JOIN \"Lesson\" l ON l.\"moduleId\" = m.id \
GROUP BY c.id;"
```

### Delete Test Course
```bash
docker exec -it web-platform-db-1 psql -U postgres -d postgres -c \
"DELETE FROM \"Course\" WHERE title LIKE '%Test%';"
```

## 🛠️ Troubleshooting

### Reset Everything
```bash
# Stop services
docker-compose down

# Reset database
npx prisma db push --force-reset

# Restart
docker-compose up -d
npm run dev
```

### Check Service Status
```bash
# Docker services
docker-compose ps

# Database tables
docker exec -it web-platform-db-1 psql -U postgres -d postgres -c "\dt"

# View logs
docker-compose logs -f web
```

## 📝 Course Structure Template

```javascript
{
  // Course
  title: "Course Title",
  description: "Description",
  category: "Web Development",
  difficulty: "BEGINNER", // or INTERMEDIATE, ADVANCED
  estimatedHours: 10,
  tags: ["tag1", "tag2"],
  
  // Module
  modules: [{
    title: "Module 1",
    description: "Module description",
    
    // Lesson
    lessons: [{
      title: "Lesson 1",
      xpReward: 10,
      duration: 20, // minutes
      
      // Slides
      slides: [{
        title: "Slide 1",
        
        // Content Blocks
        blocks: [{
          type: "TEXT", // or CODE, IMAGE, VIDEO
          content: { text: "Content here" }
        }]
      }],
      
      // Quiz
      quizzes: [{
        title: "Quiz 1",
        questions: [{
          question: "Question text?",
          type: "MULTIPLE_CHOICE",
          options: ["A", "B", "C", "D"],
          correctAnswer: "A"
        }]
      }]
    }]
  }]
}
```

## 🔗 Useful Links

- **Admin Panel**: http://localhost:3000/admin
- **Course Builder**: http://localhost:3000/admin/courses/[id]/builder
- **Student View**: http://localhost:3000/learn
- **Database UI**: `npx prisma studio`

## 📁 Important Files

- `scripts/create-course-basic.js` - Simple course creation
- `scripts/create-course.js` - Advanced course creation
- `prisma/schema.prisma` - Database schema
- `src/app/api/courses/` - Course API endpoints

## 🎯 Next Steps After Course Creation

1. **Test the course**: http://localhost:3000/learn/course/[courseId]
2. **Add content**: Use Course Builder to add more slides
3. **Publish**: Update `isPublished` to `true`
4. **Monitor**: Check enrollments and progress

---
Full documentation: [Course Creation Guide](./COURSE_CREATION_GUIDE.md)
