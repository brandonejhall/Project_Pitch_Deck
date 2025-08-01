# PitchDeck AI

Transform your business idea into a professional pitch deck in minutes. Our AI creates compelling slides tailored to your vision.

## 🚀 Features

- **AI-Powered Generation**: Create pitch decks from natural language descriptions
- **Interactive Editing**: Real-time slide editing with AI assistance
- **Smart Reordering**: Drag-and-drop slide reordering with save/cancel controls
- **PDF Export**: Export presentations as PDF with one slide per page
- **Firebase Authentication**: Secure user authentication and data persistence
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn UI** components
- **React Router** for navigation
- **Firebase Auth** for authentication

### Backend (NestJS + TypeScript)
- **NestJS** framework
- **Prisma ORM** for database management
- **Firebase Admin SDK** for authentication
- **OpenAI API** for AI-powered content generation
- **PostgreSQL** database (via Prisma)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Firebase project
- OpenAI API key

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Project_Pitch_Deck
```

### 2. Backend Setup

```bash
cd BACKEND

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/pitchdeck_db"

# Firebase
FIREBASE_SERVICE_ACCOUNT_BASE64="base64_encoded_service_account_json"

# OpenAI
OPENAI_API_KEY="your_openai_api_key"

# Environment
NODE_ENV="development"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Run migrations
npx prisma migrate dev
```

### 4. Frontend Setup

```bash
cd ../FRONTEND

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# API URL
VITE_API_URL="http://localhost:3000"

# Firebase Config
VITE_FIREBASE_API_KEY="your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
```

### 5. Firebase Configuration

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication with Email/Password

2. **Get Service Account**:
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Convert to base64: `base64 -i serviceAccountKey.json`

3. **Configure Authentication**:
   - Add your domain to authorized domains
   - Enable Email/Password authentication

### 6. OpenAI Configuration

1. **Get API Key**:
   - Sign up at [OpenAI](https://openai.com/)
   - Generate API key in dashboard
   - Add to backend `.env`

## 🚀 Development

### Start Backend

```bash
cd BACKEND

# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod
```

### Start Frontend

```bash
cd FRONTEND

# Development mode
npm run dev

# Production build
npm run build
npm run preview
```

## 🚀 Deployment

### Render Deployment

#### Backend Deployment

1. **Connect Repository**:
   - Connect your GitHub repo to Render
   - Create new Web Service

2. **Environment Variables**:
   ```env
   DATABASE_URL="your_production_postgres_url"
   FIREBASE_SERVICE_ACCOUNT_BASE64="your_base64_service_account"
   OPENAI_API_KEY="your_openai_api_key"
   NODE_ENV="production"
   ```

3. **Build Commands**:
   ```bash
   Build Command: npm run build:prod
   Start Command: npm run start:prod
   ```

#### Frontend Deployment

1. **Create Static Site**:
   - Connect same repository
   - Set root directory to `FRONTEND`

2. **Build Commands**:
   ```bash
   Build Command: npm run build
   Publish Directory: dist
   ```

3. **Environment Variables**:
   ```env
   VITE_API_URL="https://your-backend.onrender.com"
   VITE_FIREBASE_API_KEY="your_firebase_api_key"
   VITE_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your_project_id"
   VITE_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
   VITE_FIREBASE_APP_ID="your_app_id"
   ```

### Database Setup

1. **Create PostgreSQL Database**:
   - Use Render's PostgreSQL service
   - Or external provider (Supabase, Railway, etc.)

2. **Run Migrations**:
   ```bash
   npx prisma migrate deploy
   ```

## 📖 Usage Guide

### 1. Getting Started

1. **Sign Up/Login**:
   - Visit the application
   - Sign up with email/password
   - Login to access your projects

2. **Create Your First Pitch Deck**:
   - On the home page, describe your business idea
   - Include details about market, problem, solution
   - Click "Generate Pitch Deck"

### 2. Editing Slides

#### **Workspace View**
- **Slide List**: Left sidebar shows all slides
- **Active Slide**: Click any slide to edit it
- **AI Chat**: Right sidebar for AI assistance
- **Real-time Updates**: Changes save automatically

#### **Slides View**
- **Full Presentation**: View all slides together
- **Edit Mode**: Click slides to edit content
- **Export**: Generate PDF of presentation

### 3. AI Assistant

#### **Chat Interface**
- **Context-Aware**: AI knows which slide you're editing
- **Smart Suggestions**: Get content improvements
- **Direct Updates**: AI can modify slide content
- **Edit Mode**: Changes trigger edit mode for review

#### **Example Prompts**
```
"Make this slide more compelling"
"Add bullet points to the content"
"Rewrite the title to be more impactful"
"Add a hero image to this slide"
```

### 4. Slide Management

#### **Reordering**
1. **Drag & Drop**: Drag slides in the sidebar
2. **Save/Cancel**: Buttons appear when order changes
3. **Persistent**: Order saves when you leave/return

#### **Adding Slides**
- Click "+" button in slide list
- New slides appear at the end
- Auto-detects appropriate icons

### 5. Export & Sharing

#### **PDF Export**
- Click "Export" button in navigation
- Generates PDF with one slide per page
- Downloads automatically to your device

#### **Project Management**
- View all projects in "Projects" page
- Rename projects anytime
- Delete unused projects

## 🔧 API Documentation

### Authentication
All API endpoints require Firebase authentication:
```
Authorization: Bearer <firebase_id_token>
```

### Endpoints

#### **Generate Pitch Deck**
```http
POST /generate
Content-Type: application/json

{
  "prompt": "Describe your business idea..."
}
```

#### **Projects**
```http
GET /projects                    # List user projects
POST /projects                   # Create new project
GET /projects/:id               # Get project with slides
PATCH /projects/:id             # Update project
DELETE /projects/:id            # Delete project
```

#### **Slides**
```http
POST /slides                    # Create new slide
PATCH /slides/:id              # Update slide
PATCH /slides/reorder/:projectId # Reorder slides
```

#### **Chat**
```http
POST /chat                      # AI chat assistance
```

## 🐛 Troubleshooting

### Common Issues

#### **401 Authentication Errors**
- Check Firebase configuration
- Verify service account is base64 encoded
- Ensure domain is in Firebase allowed domains

#### **Database Connection Issues**
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Run `npx prisma db push` to sync schema

#### **AI Generation Fails**
- Verify OPENAI_API_KEY is set
- Check API key has sufficient credits
- Ensure prompt is detailed enough

#### **Frontend Build Errors**
- Clear node_modules and reinstall
- Check TypeScript compilation
- Verify environment variables

### Development Tips

#### **Backend Debugging**
```bash
# Check logs
npm run start:dev

# Test database connection
npx prisma studio

# Verify environment
node -e "console.log(process.env)"
```

#### **Frontend Debugging**
```bash
# Check build
npm run build

# Test production build
npm run preview

# Check environment variables
console.log(import.meta.env)
```



---

**PitchDeck AI** - Transform ideas into compelling presentations with AI assistance. 