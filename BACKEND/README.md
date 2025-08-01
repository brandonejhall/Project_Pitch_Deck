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
│   └── auth.module.ts
├── firebase/               # Firebase authentication
│   ├── firebase.module.ts
│   └── firebase.service.ts
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
- All endpoints use Firebase Authentication
- Include Firebase ID token in Authorization header: `Bearer <token>`

### Generate
- `POST /generate` - Generate pitch deck slides

### Projects
- `GET /projects` - Get all projects for authenticated user
- `POST /projects` - Create a new project
- `GET /projects/:id` - Get a specific project
- `PUT /projects/:id` - Update a project
- `DELETE /projects/:id` - Delete a project

### Slides
- `POST /slides` - Create a new slide
- `PATCH /slides/:id` - Update a slide

### Chat
- `POST /chat` - Get slide editing suggestions 