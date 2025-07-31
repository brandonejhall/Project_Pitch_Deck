# AI Pitch Deck Backend (NestJS)

This is the NestJS backend for the AI Pitch Deck application.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the BACKEND directory:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_pitch_deck"
OPENAI_API_KEY="your-openai-api-key-here"
JWT_SECRET="your-secret-key-change-in-production"
```

### 3. Set Up the Database
```bash
# Generate Prisma client
npx prisma generate

# Push the database schema
npx prisma db push
```

### 4. Start the Development Server
```bash
npm run start:dev
```

The backend will be available at `http://localhost:3001`.

## 📚 API Documentation

Once the server is running, visit `http://localhost:3001/api` for Swagger documentation.

## 🔧 Available Scripts

```bash
npm run build          # Build the application
npm run start          # Start the application
npm run start:dev      # Start in development mode with hot reload
npm run start:debug    # Start in debug mode
npm run start:prod     # Start in production mode
npm run lint           # Run ESLint
npm run test           # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run prisma:generate # Generate Prisma client
npm run prisma:push    # Push database schema
npm run prisma:migrate # Run database migrations
npm run prisma:studio  # Open Prisma Studio
```

## 🏗️ Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts           # Root module
├── auth/                   # Authentication module
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── jwt.strategy.ts
│   └── jwt-auth.guard.ts
├── ai/                     # AI service
│   └── ai.service.ts
├── generate/               # Generate module
│   ├── generate.module.ts
│   └── generate.controller.ts
├── projects/               # Projects module
│   ├── projects.module.ts
│   ├── projects.service.ts
│   └── projects.controller.ts
├── slides/                 # Slides module
│   ├── slides.module.ts
│   ├── slides.service.ts
│   └── slides.controller.ts
├── chat/                   # Chat module
│   ├── chat.module.ts
│   └── chat.controller.ts
└── prisma/                 # Database module
    ├── prisma.module.ts
    └── prisma.service.ts
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/login` - Login (returns JWT token)
- `POST /auth/verify` - Verify JWT token

### Generate
- `POST /generate` - Generate pitch deck slides

### Projects
- `POST /projects` - Create a new project
- `GET /projects/:id` - Get a specific project

### Slides
- `PATCH /slides/:id` - Update a slide

### Chat
- `POST /chat` - Get slide editing suggestions

## 🔐 Authentication

The API uses JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

For development, you can use the dummy user by calling `/auth/login` with any credentials.

## 🗄️ Database

The application uses PostgreSQL with Prisma ORM. The schema includes:
- Users
- Projects (one per user)
- Slides (belonging to projects)

## 🤖 AI Integration

The backend integrates with OpenAI for:
- Pitch deck generation
- Slide editing suggestions

## 🛠️ Development

### Adding New Modules
```bash
npx @nestjs/cli generate module <module-name>
npx @nestjs/cli generate controller <controller-name>
npx @nestjs/cli generate service <service-name>
```

### Database Changes
```bash
# After modifying schema.prisma
npx prisma generate
npx prisma db push
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start:prod
```

### Environment Variables
Make sure to set all required environment variables in production:
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `JWT_SECRET`
- `PORT` (optional, defaults to 3001) 