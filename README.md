# AI Coding Agent

A Claude-style AI Coding Agent built with React, FastAPI, and Gemini 2.5 API. This application provides a modern chat interface for AI-assisted coding with real-time streaming responses and code artifact preview.

## Features

### 🚀 Core Features
- **Real-time Chat Interface**: Claude-style chat UI with streaming responses
- **AI-Powered Code Generation**: Powered by Google's Gemini 2.5 API
- **Code Artifact Management**: Automatic detection and display of generated code
- **Dynamic Sidebar**: Toggle between Code and Preview views for generated artifacts
- **Syntax Highlighting**: Monaco Editor integration for code display
- **Live Preview**: Sandbox preview for HTML/CSS/JavaScript code
- **File Download**: Download generated code artifacts
- **Conversation Memory**: Maintains chat history for context

### 🎨 UI/UX Features
- **Modern Design**: Clean, responsive interface built with TailwindCSS
- **Dark/Light Theme**: CSS variables for easy theming
- **Smooth Animations**: CSS transitions and streaming animations
- **Mobile Responsive**: Works on desktop and mobile devices
- **Auto-scroll**: Automatic scrolling to latest messages
- **Loading States**: Visual feedback during API calls

### 🔧 Technical Features
- **Streaming Responses**: Real-time streaming from Gemini API
- **State Management**: Redux Toolkit for predictable state
- **Type Safety**: Full TypeScript support
- **Error Handling**: Comprehensive error handling and user feedback
- **CORS Support**: Proper CORS configuration for development
- **Health Checks**: API health monitoring

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **TailwindCSS** - Styling
- **Radix UI** - Accessible components
- **Monaco Editor** - Code editor
- **Lucide React** - Icons
- **Vite** - Build tool

### Backend
- **FastAPI** - Python web framework
- **Uvicorn** - ASGI server
- **Google Generative AI** - Gemini API integration
- **Pydantic** - Data validation
- **SSE-Starlette** - Server-Sent Events

### AI/ML
- **Gemini 2.5 Flash** - Large Language Model
- **Streaming API** - Real-time responses

## Project Structure

```
ai-coding-agent/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat.py          # Chat API endpoints
│   │   ├── services/
│   │   │   └── gemini_service.py # Gemini API integration
│   │   ├── config.py            # Configuration management
│   │   ├── main.py              # FastAPI app
│   │   └── models.py            # Pydantic models
│   └── requirements.txt         # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Reusable UI components
│   │   │   ├── ChatArea.tsx     # Chat messages display
│   │   │   ├── ChatInput.tsx    # Message input
│   │   │   ├── ChatMessage.tsx  # Individual message
│   │   │   ├── CodeEditor.tsx   # Code display
│   │   │   ├── CodePreview.tsx  # Live preview
│   │   │   ├── Sidebar.tsx      # Artifact sidebar
│   │   │   └── ViewArtifactButton.tsx
│   │   ├── store/
│   │   │   ├── chatSlice.ts     # Chat state management
│   │   │   ├── sidebarSlice.ts  # Sidebar state
│   │   │   └── store.ts         # Redux store
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript types
│   │   ├── lib/
│   │   │   └── utils.ts         # Utility functions
│   │   ├── App.tsx              # Main app component
│   │   └── main.tsx             # App entry point
│   ├── package.json             # Node.js dependencies
│   └── vite.config.ts           # Vite configuration
└── README.md                    # This file
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Gemini API key from Google AI Studio

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:
   Create a `.env` file in the backend directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ALLOWED_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
   API_PREFIX=/api
   ```

4. **Start the backend server**:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173`

## Usage

### Basic Chat
1. Type your message in the chat input
2. Press Enter or click the send button
3. Watch the AI response stream in real-time
4. View generated code artifacts in the sidebar

### Code Artifacts
1. When the AI generates code, a "View Generated Artifact" button appears
2. Click the button to open the sidebar
3. Toggle between "Code" and "Preview" views
4. Download code files using the download button
5. Close the sidebar using the X button

### Features in Action
- **Streaming**: Responses appear word-by-word in real-time
- **Code Detection**: Code blocks are automatically detected and extracted
- **Syntax Highlighting**: Code is displayed with proper syntax highlighting
- **Live Preview**: HTML/CSS/JavaScript can be previewed in a sandbox
- **File Management**: Generated code can be downloaded as files

## API Endpoints

### Health Check
- `GET /api/health` - Check API health status

### Chat Endpoints
- `POST /api/chat` - Non-streaming chat response
- `POST /api/chat/stream` - Streaming chat response (SSE)

### Request Format
```json
{
  "message": "Your message here",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Previous user message"
    },
    {
      "role": "assistant", 
      "content": "Previous AI response"
    }
  ]
}
```

### Streaming Response Format
```
data: {"type": "content", "data": "Hello"}
data: {"type": "code", "data": "console.log('Hello')", "language": "javascript", "filename": "script.js"}
data: {"type": "end", "data": ""}
```

## Configuration

### Environment Variables
- `GEMINI_API_KEY`: Your Gemini API key
- `ALLOWED_ORIGINS`: CORS allowed origins (JSON array)
- `API_PREFIX`: API route prefix (default: `/api`)

### Frontend Configuration
- Vite dev server runs on port 5173
- API calls are made to `http://localhost:8000`
- Monaco Editor theme: `vs-dark`

## Development

### Backend Development
- FastAPI with auto-reload enabled
- API documentation available at `http://localhost:8000/docs`
- Pydantic models for request/response validation

### Frontend Development
- Vite with HMR (Hot Module Replacement)
- TypeScript for type safety
- Redux DevTools for state debugging
- TailwindCSS for styling

### Code Quality
- ESLint for JavaScript/TypeScript linting
- Prettier for code formatting
- TypeScript strict mode enabled

## Troubleshooting

### Common Issues

1. **API Key Issues**:
   - Ensure your Gemini API key is valid
   - Check that the key has proper permissions
   - Verify the key is correctly set in the `.env` file

2. **CORS Errors**:
   - Ensure the frontend URL is in `ALLOWED_ORIGINS`
   - Check that both servers are running
   - Verify the API prefix configuration

3. **Streaming Issues**:
   - Check browser console for errors
   - Verify the SSE endpoint is working
   - Ensure proper error handling in the frontend

4. **Build Issues**:
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for TypeScript errors: `npm run lint`
   - Verify all dependencies are installed

### Debug Mode
- Backend logs are displayed in the terminal
- Frontend errors appear in browser console
- Redux DevTools available in browser extensions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Google AI for providing the Gemini API
- The React and FastAPI communities
- Radix UI for accessible components
- Monaco Editor for code editing capabilities
