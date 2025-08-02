# Project Pitch Deck

A modern web application for creating beautiful pitch deck slides with AI-powered design. Built with React, TypeScript, and Firebase, featuring real-time collaboration and stunning gradient designs.

![Project Pitch Deck](https://img.shields.io/badge/React-18.3.1-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-4.5.2-purple?style=flat-square&logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-12.0.0-orange?style=flat-square&logo=firebase)

## ✨ Features

- **AI-Powered Slide Generation**: Create professional pitch decks using OpenAI's GPT-4
- **Real-time Collaboration**: Work together with team members in real-time
- **Beautiful UI/UX**: Modern design with gradient backgrounds and smooth animations
- **Drag & Drop Interface**: Intuitive slide reordering with drag and drop
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Firebase Authentication**: Secure user authentication and data storage
- **Project Management**: Organize multiple pitch deck projects
- **Export & Sharing**: Easy sharing and export capabilities

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase project setup
- OpenAI API key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Project_Pitch_Deck
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd FRONTEND
   npm install --legacy-peer-deps
   
   # Backend
   cd ../BACKEND
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` files in both frontend and backend directories:
   
   **FRONTEND/.env**
   ```env
   VITE_API_URL=http://localhost:3001
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

   **BACKEND/.env**
   ```env
   PORT=3001
   OPENAI_API_KEY=your_openai_api_key
   FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_encoded_service_account
   CORS_ORIGINS=http://localhost:8080,http://localhost:3000
   DATABASE_URL=your_database_url
   ```

4. **Database Setup**
   ```bash
   cd BACKEND
   npx prisma generate
   npx prisma db push
   ```

5. **Start the application**
   ```bash
   # Start backend (in BACKEND directory)
   npm run start:dev
   
   # Start frontend (in FRONTEND directory)
   npm run dev
   ```

The application will be available at:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api

## 🏗️ Project Structure

```
Project_Pitch_Deck/
├── FRONTEND/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets
│   └── package.json
├── BACKEND/                 # NestJS backend API
│   ├── src/
│   │   ├── ai/            # AI service for slide generation
│   │   ├── auth/          # Authentication modules
│   │   ├── firebase/      # Firebase integration
│   │   ├── generate/      # Slide generation endpoints
│   │   ├── projects/      # Project management
│   │   ├── slides/        # Slide management
│   │   └── prisma/        # Database service
│   └── package.json
└── README.md
```

## 🎯 Usage Guide

### Creating Your First Pitch Deck

1. **Sign In**: Use your Google account to authenticate
2. **Generate Slides**: Click "Create New Project" and enter your business idea
3. **AI Generation**: The AI will create a complete pitch deck with multiple slides
4. **Customize**: Edit slides, reorder them, and add your own content
5. **Save & Share**: Your project is automatically saved and can be shared

### Working with Slides

#### **Slide Types Available**
- **Hero Slide**: Introduction and value proposition
- **Problem Slide**: Market problem identification
- **Solution Slide**: Your product/service solution
- **Market Slide**: Target market analysis
- **Business Model**: Revenue streams and pricing
- **Competition**: Competitive landscape
- **Team Slide**: Key team members
- **Financials**: Revenue projections and metrics
- **Call to Action**: Next steps and contact information

#### **Slide Customization**
- **Edit Content**: Click on any slide to edit text and content
- **Drag & Drop**: Reorder slides by dragging them
- **Add Images**: Upload hero images for slides
- **Change Layouts**: Switch between different slide layouts
- **Real-time Updates**: Changes are saved automatically

### Project Management

#### **Creating Projects**
- Click "Create New Project" from the dashboard
- Enter a business idea or concept
- AI generates a complete pitch deck
- Projects are automatically saved to your account

#### **Managing Projects**
- View all your projects on the dashboard
- Edit existing projects anytime
- Duplicate projects for variations
- Delete projects you no longer need

#### **Collaboration**
- Share project links with team members
- Real-time updates across all users
- Comment and feedback system
- Version history tracking

## 🔧 Configuration

### Environment Variables

#### **Frontend (.env)**
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_FIREBASE_API_KEY` | Firebase API key | Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID | Yes |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | Yes |

#### **Backend (.env)**
| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 3001) | No |
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `FIREBASE_SERVICE_ACCOUNT_BASE64` | Base64 encoded Firebase service account | Yes |
| `CORS_ORIGINS` | Allowed CORS origins | Yes |
| `DATABASE_URL` | Database connection string | Yes |

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Google provider)
   - Create a web app

2. **Get Service Account**
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Base64 encode the JSON file:
     ```bash
     base64 -i serviceAccountKey.json
     ```

3. **Configure Authentication**
   - Enable Google sign-in method
   - Add your domain to authorized domains

### OpenAI Setup

1. **Get API Key**
   - Sign up at [OpenAI](https://openai.com/)
   - Generate an API key
   - Add to backend environment variables

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   - Connect your GitHub repository to Vercel
   - Set root directory to `FRONTEND`

2. **Environment Variables**
   - Add all frontend environment variables in Vercel dashboard
   - Set `VITE_API_URL` to your backend URL

3. **Build Settings**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Backend Deployment

#### **Railway/Render**
1. Connect your repository
2. Set root directory to `BACKEND`
3. Add environment variables
4. Deploy

#### **Heroku**
```bash
cd BACKEND
heroku create your-app-name
heroku config:set NODE_ENV=production
git push heroku main
```

## 🛠️ Development

### Available Scripts

#### **Frontend**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### **Backend**
```bash
npm run start        # Start production server
npm run start:dev    # Start development server
npm run build        # Build TypeScript
npm run test         # Run tests
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React and TypeScript
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality

### Database Migrations

```bash
cd BACKEND
npx prisma migrate dev    # Create and apply migration
npx prisma generate      # Generate Prisma client
npx prisma studio        # Open database GUI
```

## 🔒 Security

### Authentication
- Firebase Authentication with Google OAuth
- JWT token validation
- Secure API endpoints with guards

### Data Protection
- Environment variables for sensitive data
- CORS configuration
- Input validation and sanitization
- Rate limiting on API endpoints

### Best Practices
- HTTPS only in production
- Secure headers configuration
- Regular dependency updates
- Security audits

## 🐛 Troubleshooting

### Common Issues

#### **Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### **Database Connection**
```bash
# Reset database
npx prisma migrate reset
npx prisma db push
```

#### **Firebase Issues**
- Verify service account JSON is base64 encoded
- Check Firebase project settings
- Ensure authentication is enabled

#### **OpenAI API Errors**
- Verify API key is correct
- Check API usage limits
- Ensure proper environment variable setup

### Debug Mode

Enable debug logging:
```bash
# Frontend
DEBUG=true npm run dev

# Backend
DEBUG=true npm run start:dev
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /auth/login` - User authentication
- `GET /auth/verify` - Token verification

### Project Endpoints

- `GET /projects` - List user projects
- `POST /projects` - Create new project
- `GET /projects/:id` - Get project details
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Slide Generation

- `POST /generate` - Generate slides with AI
- `GET /generate/health` - Health check
- `GET /generate/auth-test` - Authentication test

### Slide Management

- `GET /slides/:projectId` - Get project slides
- `POST /slides` - Create new slide
- `PUT /slides/:id` - Update slide
- `DELETE /slides/:id` - Delete slide

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm run test
   npm run lint
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Follow the existing code style

