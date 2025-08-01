# Development Guide

This guide helps developers understand the codebase structure, development workflow, and contribution guidelines.

## 🏗️ Project Structure

```
Project_Pitch_Deck/
├── BACKEND/                    # NestJS Backend
│   ├── src/
│   │   ├── ai/                # AI service for OpenAI integration
│   │   ├── auth/              # Firebase authentication
│   │   ├── chat/              # Chat endpoints
│   │   ├── firebase/          # Firebase service
│   │   ├── generate/          # Pitch deck generation
│   │   ├── projects/          # Project management
│   │   ├── slides/            # Slide management
│   │   └── prisma/            # Database service
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   └── package.json
├── FRONTEND/                   # React Frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ui/           # Shadcn UI components
│   │   │   └── ...           # Custom components
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities and API
│   │   ├── pages/            # Page components
│   │   └── types/            # TypeScript types
│   └── package.json
└── README.md
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- VS Code (recommended)

### Local Development

#### 1. Clone and Install
```bash
git clone <repository-url>
cd Project_Pitch_Deck

# Install backend dependencies
cd BACKEND
npm install

# Install frontend dependencies
cd ../FRONTEND
npm install
```

#### 2. Environment Setup
```bash
# Backend environment
cd BACKEND
cp .env.example .env
# Edit .env with your values

# Frontend environment
cd ../FRONTEND
cp .env.example .env
# Edit .env with your values
```

#### 3. Database Setup
```bash
cd BACKEND

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio
npx prisma studio
```

#### 4. Start Development Servers
```bash
# Terminal 1: Backend
cd BACKEND
npm run start:dev

# Terminal 2: Frontend
cd FRONTEND
npm run dev
```

## 📚 Code Architecture

### Backend Architecture

#### **NestJS Modules**
- **AppModule**: Root module
- **AuthModule**: Firebase authentication
- **ProjectsModule**: Project CRUD operations
- **SlidesModule**: Slide management
- **GenerateModule**: AI pitch deck generation
- **ChatModule**: AI chat functionality
- **AiModule**: OpenAI integration

#### **Key Services**
```typescript
// Firebase authentication
FirebaseService.verifyIdToken()

// AI content generation
AiService.generatePitchDeck()
AiService.chatEdit()

// Database operations
PrismaService.user.findUnique()
PrismaService.project.create()
```

#### **API Endpoints**
```typescript
// Authentication
POST /auth/login
POST /auth/verify

// Projects
GET /projects
POST /projects
GET /projects/:id
PATCH /projects/:id
DELETE /projects/:id

// Slides
POST /slides
PATCH /slides/:id
PATCH /slides/reorder/:projectId

// Generation
POST /generate

// Chat
POST /chat
```

### Frontend Architecture

#### **React Components**
```typescript
// Pages
Index.tsx              # Home page
ProjectEditor.tsx      # Project editor
Projects.tsx           # Projects list
SlidesDemo.tsx         # Slides demo

// Components
WorkspaceNew.tsx       # Main workspace
SlideList.tsx          # Slide sidebar
ChatSidebarEnhanced.tsx # AI chat
SlidesPage.tsx         # Slide display
```

#### **State Management**
```typescript
// Contexts
AuthContext.tsx        # Firebase auth state

// Hooks
useApi.ts             # API client
useAuth.ts            # Auth utilities
useToast.ts           # Toast notifications
```

#### **API Integration**
```typescript
// API client
apiClient.generateSlides()
apiClient.createProject()
apiClient.updateSlide()
apiClient.reorderSlides()
```

## 🔧 Development Workflow

### 1. Feature Development

#### **Create Feature Branch**
```bash
git checkout -b feature/new-feature
```

#### **Development Process**
1. **Plan**: Document the feature requirements
2. **Implement**: Write code with tests
3. **Test**: Verify functionality locally
4. **Review**: Self-review before PR
5. **Submit**: Create pull request

#### **Code Standards**
- **TypeScript**: Strict mode enabled
- **ESLint**: Code linting rules
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message format

### 2. Testing Strategy

#### **Backend Testing**
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

#### **Frontend Testing**
```bash
# Unit tests
npm run test

# Component tests
npm run test:components
```

#### **Manual Testing Checklist**
- [ ] Authentication flow
- [ ] Project creation
- [ ] Slide editing
- [ ] AI chat functionality
- [ ] PDF export
- [ ] Slide reordering
- [ ] Responsive design

### 3. Database Changes

#### **Schema Updates**
```bash
# Edit schema
nano prisma/schema.prisma

# Generate migration
npx prisma migrate dev --name add_new_field

# Apply to database
npx prisma db push
```

#### **Migration Guidelines**
- Always create migrations for schema changes
- Test migrations on development database
- Document breaking changes
- Consider data migration scripts

### 4. API Development

#### **Adding New Endpoints**
```typescript
// 1. Create controller method
@Post('new-endpoint')
async newEndpoint(@Body() data: NewDto) {
  return this.service.newMethod(data);
}

// 2. Add service method
async newMethod(data: NewDto) {
  // Implementation
}

// 3. Update DTOs
export class NewDto {
  @IsString()
  field: string;
}
```

#### **Error Handling**
```typescript
// Use NestJS exceptions
throw new NotFoundException('Resource not found');
throw new UnauthorizedException('Invalid token');
throw new BadRequestException('Invalid data');
```

## 🎨 UI/UX Development

### Component Guidelines

#### **Shadcn UI Components**
```typescript
// Use existing components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
```

#### **Custom Components**
```typescript
// Follow naming convention
SlideCard.tsx
ChatSidebar.tsx
ProjectEditor.tsx

// Export as named exports
export function SlideCard() {}
```

#### **Styling Guidelines**
```css
/* Use Tailwind classes */
className="flex items-center justify-between p-4 bg-white"

/* Custom CSS for complex styles */
.custom-gradient {
  background: linear-gradient(...);
}
```

### State Management

#### **Local State**
```typescript
const [slides, setSlides] = useState<Slide[]>([]);
const [loading, setLoading] = useState(false);
```

#### **Context State**
```typescript
// For global state
const { user, login, logout } = useAuth();
```

#### **API State**
```typescript
// Use custom hooks
const { updateSlide, loading, error } = useApi();
```

## 🔍 Debugging

### Backend Debugging

#### **Logging**
```typescript
// Use console.log for development
console.log('Debug info:', data);

// Use NestJS logger for production
this.logger.log('Info message');
this.logger.error('Error message');
```

#### **Database Debugging**
```bash
# Open Prisma Studio
npx prisma studio

# Check database connection
npx prisma db pull

# Reset database
npx prisma db push --force-reset
```

#### **API Testing**
```bash
# Test endpoints with curl
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test"}'
```

### Frontend Debugging

#### **React DevTools**
- Install React DevTools extension
- Inspect component state
- Monitor re-renders

#### **Browser DevTools**
```javascript
// Debug in console
console.log('Component state:', state);
console.log('API response:', response);
```

#### **Network Debugging**
- Check Network tab for API calls
- Verify request/response headers
- Monitor authentication tokens

## 🚀 Performance Optimization

### Backend Optimization

#### **Database Queries**
```typescript
// Use Prisma includes for eager loading
const project = await this.prisma.project.findUnique({
  where: { id: projectId },
  include: { slides: true }
});
```

#### **Caching**
```typescript
// Implement caching for expensive operations
@CacheKey('project')
@CacheTTL(300)
async getProject(id: number) {
  // Implementation
}
```

### Frontend Optimization

#### **React Optimization**
```typescript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return calculateExpensive(data);
}, [data]);
```

#### **Bundle Optimization**
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

## 🔒 Security

### Authentication
- All API endpoints require Firebase authentication
- Verify tokens on every request
- Handle token expiration gracefully

### Data Validation
```typescript
// Use DTOs for validation
export class CreateProjectDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title: string;
}
```

### Input Sanitization
- Validate all user inputs
- Sanitize data before database operations
- Use parameterized queries (Prisma handles this)

## 📝 Documentation

### Code Documentation
```typescript
/**
 * Generates a pitch deck from a user prompt
 * @param prompt - The user's business description
 * @returns Promise<Slide[]> - Array of generated slides
 */
async generatePitchDeck(prompt: string): Promise<Slide[]> {
  // Implementation
}
```

### API Documentation
- Use Swagger/OpenAPI decorators
- Document all endpoints
- Include request/response examples

### Component Documentation
```typescript
/**
 * SlideCard component for displaying individual slides
 * @param slide - The slide data to display
 * @param onEdit - Callback when slide is edited
 */
interface SlideCardProps {
  slide: Slide;
  onEdit?: (slide: Slide) => void;
}
```

## 🤝 Contributing

### Pull Request Process
1. **Fork** the repository
2. **Create** feature branch
3. **Implement** changes
4. **Test** thoroughly
5. **Document** changes
6. **Submit** pull request

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests are included
- [ ] Documentation is updated
- [ ] No breaking changes
- [ ] Performance impact considered

### Commit Message Format
```
type(scope): description

feat(auth): add password reset functionality
fix(api): resolve database connection issue
docs(readme): update installation instructions
```

## 🐛 Common Issues

### Backend Issues

#### **Database Connection**
```bash
# Check connection
npx prisma db pull

# Reset if needed
npx prisma db push --force-reset
```

#### **Firebase Configuration**
```bash
# Verify service account
echo $FIREBASE_SERVICE_ACCOUNT_BASE64 | base64 -d

# Check environment variables
node -e "console.log(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64)"
```

### Frontend Issues

#### **Build Errors**
```bash
# Clear cache
rm -rf node_modules
npm install

# Check TypeScript
npx tsc --noEmit
```

#### **API Connection**
```bash
# Verify API URL
echo $VITE_API_URL

# Test API endpoint
curl $VITE_API_URL/health
```

## 📚 Resources

### Documentation
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Firebase Documentation](https://firebase.google.com/docs)

### Tools
- [VS Code Extensions](https://marketplace.visualstudio.com/)
- [Postman](https://www.postman.com/) for API testing
- [Prisma Studio](https://www.prisma.io/studio) for database

---

**Happy Coding! 🚀** 