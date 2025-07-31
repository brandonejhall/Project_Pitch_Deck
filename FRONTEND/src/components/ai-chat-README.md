# AI Agent Chat Feature Implementation

## Overview

The AI agent chat feature provides intelligent slide editing capabilities with context awareness. Users can chat with an AI agent that understands the current slide content and provides both suggestions and direct slide updates.

## Key Features

### ✅ **Context Awareness**
- AI agent receives current slide data (title, content, layout, hero image)
- Maintains conversation context across messages
- Understands slide structure and design elements

### ✅ **Intelligent Editing**
- Provides natural language suggestions
- Returns specific slide updates in JSON format
- Only updates fields that need to change
- Maintains professional tone and structure

### ✅ **Real-time Updates**
- Automatic application of AI suggestions
- Manual accept/reject options for updates
- Visual feedback for pending changes
- Toast notifications for update status

### ✅ **User Experience**
- Contextual placeholder text based on active slide
- Sample prompts for easy testing
- Auto-scroll to latest messages
- Loading states and error handling

## Architecture

### Backend Components

#### 1. Enhanced AI Service (`ai.service.ts`)
```typescript
interface ChatResponse {
  edit: string;           // Natural language response
  context: string;        // Conversation context
  slideUpdates?: {        // Optional slide changes
    title?: string;
    content?: string;
    heroImageUrl?: string;
    layout?: string;
  };
}
```

**Key Features:**
- Enhanced system prompt for slide editing
- JSON extraction from AI responses
- Context-aware slide data processing
- Error handling and fallbacks

#### 2. Chat Controller (`chat.controller.ts`)
```typescript
interface ChatRequestDto {
  prompt: string;
  slide_id: number;
  slideData?: {
    id: string;
    title: string;
    content: string;
    heroImageUrl?: string;
    layout?: string;
  };
}
```

**Key Features:**
- Receives slide context from frontend
- Maintains conversation context per slide
- Passes data to AI service for processing

### Frontend Components

#### 1. Enhanced Chat Sidebar (`chat-sidebar-enhanced.tsx`)
```typescript
interface ChatSidebarEnhancedProps {
  messages: ChatMessage[];
  activeSlide?: Slide;
  onSendMessage: (content: string, slideId?: string) => void;
  onSlideUpdate?: (slideId: string, updates: any) => void;
  isLoading?: boolean;
}
```

**Key Features:**
- Context-aware input placeholders
- Pending update management
- Accept/reject update controls
- Auto-scroll and loading states

#### 2. API Integration (`api.ts`, `use-api.ts`)
```typescript
interface ChatRequest {
  prompt: string;
  slide_id: number;
  slideData?: SlideData;
}

interface ChatResponse {
  edit: string;
  context: string;
  slideUpdates?: SlideUpdates;
}
```

## Message Flow

### 1. User Sends Message
```
User Input → Frontend → Backend API → AI Service → Response
```

### 2. Context Processing
```
Slide Data → JSON Format → AI Prompt → OpenAI API → Parsed Response
```

### 3. Update Application
```
AI Response → JSON Extraction → Frontend Update → UI Refresh
```

## AI Agent Capabilities

### Content Editing
- **Make more persuasive**: Rewrites content with stronger language
- **Add bullet points**: Converts paragraphs to structured lists
- **Make concise**: Shortens content while maintaining key points
- **Improve title**: Suggests more impactful titles

### Visual Enhancements
- **Add hero image**: Suggests relevant image URLs
- **Change layout**: Recommends different slide layouts
- **Make title bolder**: Updates styling suggestions

### Structural Changes
- **Two-column layout**: Converts to text + visual layout
- **Full-width content**: Expands content across slide
- **Hero layout**: Creates prominent visual focus

## Usage Examples

### Basic Prompts
```
"Make this slide more persuasive"
"Add a hero image"
"Make the content more concise"
"Improve the title"
```

### Advanced Prompts
```
"Add a hero image and make the title bolder"
"Rewrite this with more impactful language and add bullet points"
"Change to a two-column layout with a relevant image"
"Make this more compelling for investors"
```

## Error Handling

### Backend Errors
- **API failures**: Graceful fallback with error messages
- **Invalid JSON**: Safe parsing with error logging
- **Context issues**: Default to basic suggestions

### Frontend Errors
- **Network issues**: Retry logic with user feedback
- **Invalid updates**: Ignore malformed responses
- **State conflicts**: Prevent duplicate updates

## Performance Optimizations

### Backend
- **Caching**: Conversation context per slide
- **Token limits**: Efficient prompt construction
- **Error recovery**: Graceful degradation

### Frontend
- **Debounced updates**: Prevent rapid state changes
- **Auto-scroll**: Smooth message navigation
- **Loading states**: Clear user feedback

## Testing

### Manual Testing
1. **Context Awareness**: Verify slide data is sent correctly
2. **Update Application**: Test accept/reject functionality
3. **Error Handling**: Test network failures and invalid responses
4. **UI States**: Verify loading and error states

### Demo Routes
- `/ai-chat-demo`: Standalone chat demo
- `/slides-demo`: Slides page with chat integration
- Main workspace: Full editing experience

## Future Enhancements

### Planned Features
- **Multi-slide context**: AI understands entire presentation
- **Design suggestions**: Color and layout recommendations
- **Template matching**: Suggest slide templates
- **Export integration**: Direct to PDF/PPT

### Technical Improvements
- **Streaming responses**: Real-time AI feedback
- **Voice input**: Speech-to-text integration
- **Image generation**: AI-powered hero images
- **Collaboration**: Multi-user editing support

## Configuration

### Environment Variables
```bash
OPENAI_API_KEY=your-api-key-here
```

### API Endpoints
```
POST /chat - Main chat endpoint
GET /health - Health check
```

### Frontend Configuration
```typescript
// Auto-apply updates after delay
setTimeout(() => {
  onSlideUpdate(slideId, updates);
}, 2000);

// Context-aware placeholders
placeholder={activeSlide 
  ? `Ask me to improve "${activeSlide.title}"...` 
  : "Ask about your pitch deck..."
}
```

## Troubleshooting

### Common Issues
1. **No AI response**: Check OpenAI API key and network
2. **Updates not applying**: Verify slide ID matching
3. **Context lost**: Check conversation state management
4. **UI not updating**: Verify state update handlers

### Debug Steps
1. Check browser console for errors
2. Verify backend logs for API calls
3. Test with simple prompts first
4. Confirm slide data structure

## Security Considerations

### Data Privacy
- Slide content sent to OpenAI API
- No persistent storage of sensitive data
- Temporary context only

### Rate Limiting
- Implement API call limits
- Add request throttling
- Monitor usage patterns

The AI agent chat feature provides a powerful, context-aware editing experience that enhances the pitch deck creation workflow with intelligent suggestions and real-time updates. 