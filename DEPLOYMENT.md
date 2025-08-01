# Deployment Guide

This guide provides detailed instructions for deploying PitchDeck AI to production environments.

## 🚀 Quick Start

### Prerequisites
- GitHub repository with your code
- Render account (free tier available)
- Firebase project
- OpenAI API key
- PostgreSQL database

## 📋 Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your repository structure matches:
```
Project_Pitch_Deck/
├── BACKEND/
│   ├── package.json
│   ├── src/
│   └── prisma/
└── FRONTEND/
    ├── package.json
    ├── src/
    └── dist/
```

### 2. Set Up Firebase

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `pitchdeck-ai`
4. Enable Google Analytics (optional)
5. Click "Create project"

#### Configure Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password"
5. Click "Save"

#### Get Service Account Key
1. Go to Project Settings (gear icon)
2. Click "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Convert to base64:
   ```bash
   base64 -i serviceAccountKey.json
   ```
6. Copy the base64 string for later use

#### Configure Authorized Domains
1. In Authentication > Settings
2. Add your Render domain: `your-app.onrender.com`
3. Add localhost for development: `localhost:3000`

### 3. Set Up Database

#### Option A: Render PostgreSQL (Recommended)
1. In Render Dashboard, click "New"
2. Select "PostgreSQL"
3. Choose plan (free tier available)
4. Name: `pitchdeck-db`
5. Click "Create Database"
6. Copy the "External Database URL"

#### Option B: External PostgreSQL
- Use Supabase, Railway, or other providers
- Get the connection URL

### 4. Deploy Backend

#### Create Backend Service
1. In Render Dashboard, click "New"
2. Select "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `pitchdeck-backend`
   - **Root Directory**: `BACKEND`
   - **Runtime**: `Node`
   - **Build Command**: `npm run build:prod`
   - **Start Command**: `npm run start:prod`

#### Set Environment Variables
Add these environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Firebase
FIREBASE_SERVICE_ACCOUNT_BASE64="base64_encoded_service_account_json"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"

# Environment
NODE_ENV="production"
```

#### Deploy
1. Click "Create Web Service"
2. Wait for build to complete
3. Note the service URL: `https://your-backend.onrender.com`

### 5. Deploy Frontend

#### Create Static Site
1. In Render Dashboard, click "New"
2. Select "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `pitchdeck-frontend`
   - **Root Directory**: `FRONTEND`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

#### Set Environment Variables
Add these environment variables:

```env
# API URL (use your backend URL)
VITE_API_URL="https://your-backend.onrender.com"

# Firebase Config
VITE_FIREBASE_API_KEY="your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
```

#### Get Firebase Config
1. In Firebase Console, go to Project Settings
2. Scroll to "Your apps" section
3. Click "Add app" > "Web"
4. Register app with name: `PitchDeck AI`
5. Copy the config object values

#### Deploy
1. Click "Create Static Site"
2. Wait for build to complete
3. Note the site URL: `https://your-frontend.onrender.com`

### 6. Initialize Database

#### Run Database Setup
1. Go to your backend service in Render
2. Click "Shell" tab
3. Run these commands:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Run migrations
npx prisma migrate deploy
```

### 7. Test Deployment

#### Verify Backend
1. Visit: `https://your-backend.onrender.com/health`
2. Should return: `{"status":"ok"}`

#### Verify Frontend
1. Visit your frontend URL
2. Should load the PitchDeck AI homepage
3. Try signing up/login

#### Test Features
1. **Authentication**: Sign up with email/password
2. **Generation**: Create a pitch deck
3. **Editing**: Edit slides and use AI chat
4. **Export**: Generate PDF

## 🔧 Environment Variables Reference

### Backend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `FIREBASE_SERVICE_ACCOUNT_BASE64` | Base64 encoded service account | `eyJ0eXBlIjoic2VydmljZV9hY2NvdW50Iiw...` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-1234567890abcdef...` |
| `NODE_ENV` | Environment mode | `production` |

### Frontend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://backend.onrender.com` |
| `VITE_FIREBASE_API_KEY` | Firebase API key | `AIzaSyC1234567890abcdef...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `pitchdeck-ai` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID | `123456789012` |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | `1:123456789012:web:abcdef123456` |

## 🐛 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check logs in Render dashboard
# Common causes:
# - Missing environment variables
# - Database connection issues
# - Firebase configuration errors
```

#### Database Connection Fails
```bash
# Verify DATABASE_URL is correct
# Check database is accessible
# Run: npx prisma db push
```

#### Authentication Errors
```bash
# Verify Firebase service account
# Check authorized domains
# Ensure base64 encoding is correct
```

#### Frontend Build Fails
```bash
# Check environment variables
# Verify API URL is correct
# Check Firebase config
```

### Debug Commands

#### Backend Debugging
```bash
# Check environment
node -e "console.log(process.env)"

# Test database
npx prisma studio

# Check logs
npm run start:dev
```

#### Frontend Debugging
```bash
# Check build
npm run build

# Test production
npm run preview

# Check environment
console.log(import.meta.env)
```

## 🔄 Continuous Deployment

### Automatic Deployments
- Render automatically deploys on git push
- Set up branch protection rules
- Use feature branches for testing

### Environment Management
- Use different Firebase projects for dev/staging/prod
- Separate databases for each environment
- Use environment-specific API keys

## 📊 Monitoring

### Render Dashboard
- Monitor service health
- Check build logs
- View performance metrics

### Firebase Console
- Monitor authentication
- Check usage analytics
- Review error logs

### Database Monitoring
- Monitor connection pool
- Check query performance
- Review storage usage

## 🔒 Security

### Environment Variables
- Never commit secrets to git
- Use Render's encrypted environment variables
- Rotate API keys regularly

### Firebase Security
- Enable App Check for production
- Set up proper security rules
- Monitor authentication attempts

### Database Security
- Use strong passwords
- Enable SSL connections
- Regular backups

## 📈 Scaling

### Horizontal Scaling
- Render supports auto-scaling
- Monitor resource usage
- Upgrade plans as needed

### Database Scaling
- Consider read replicas
- Optimize queries
- Monitor connection limits

### Cost Optimization
- Use free tiers for development
- Monitor API usage
- Optimize build times

## 🚀 Production Checklist

- [ ] Backend deployed and healthy
- [ ] Frontend deployed and accessible
- [ ] Database initialized and connected
- [ ] Firebase configured correctly
- [ ] Environment variables set
- [ ] Authentication working
- [ ] AI generation functional
- [ ] PDF export working
- [ ] Error monitoring enabled
- [ ] Performance optimized
- [ ] Security measures in place

## 📞 Support

For deployment issues:
1. Check Render documentation
2. Review Firebase setup guide
3. Check application logs
4. Create issue in repository

---

**Happy Deploying! 🚀** 