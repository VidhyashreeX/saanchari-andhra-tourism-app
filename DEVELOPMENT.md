# Local Development Guide

## Quick Start for Local Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key (free from Google)

### Setup Steps

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd saanchari
   npm install
   ```

2. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env and add your API key
   nano .env
   ```

3. **Get Google Gemini API Key**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with Google account
   - Create API key
   - Copy and paste in .env file

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access Application**
   - Open browser to: http://localhost:5000
   - Test with different languages
   - Try the quick suggestion buttons

### Project Structure for Developers

```
saanchari/
├── client/src/
│   ├── components/
│   │   ├── ChatInterface.tsx    # Main chat container
│   │   ├── ChatMessage.tsx      # Individual message display
│   │   ├── MessageInput.tsx     # Input field and suggestions
│   │   └── LanguageSwitcher.tsx # Language selection buttons
│   ├── pages/
│   │   └── Home.tsx             # Main page component
│   └── index.css                # Brand colors and styles
├── server/
│   ├── services/
│   │   ├── gemini.ts           # Gemini AI integration
│   │   └── translator.ts       # Translation service
│   ├── routes.ts               # API endpoints
│   └── index.ts                # Server entry point
└── shared/
    └── types.ts                # TypeScript interfaces
```

### API Endpoints

- `POST /api/chat` - Chat with AI assistant
- `POST /api/translate` - Translate text
- `POST /api/translate-history` - Translate chat history
- `GET /api/suggestions` - Get quick suggestions

### Environment Variables

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
NODE_ENV=development
PORT=5000
```

### Testing the Application

1. **Test Basic Chat**
   - Send a message in English
   - Verify AI responds about Andhra Pradesh tourism

2. **Test Language Translation**
   - Switch to Hindi (हिंदी) or Telugu (తెలుగు)
   - Verify interface translates
   - Send a message and check response has language prefix

3. **Test Quick Suggestions**
   - Click on suggestion buttons
   - Verify they send the correct message

### Common Development Issues

1. **API Key Error**
   - Check .env file has correct GEMINI_API_KEY
   - Verify API key is valid at Google AI Studio

2. **Port 5000 in use**
   - Change PORT in .env file
   - Or stop other services using port 5000

3. **Module not found**
   - Run `npm install` to install dependencies
   - Check if any packages are missing

### Code Style Guidelines

- Use TypeScript for type safety
- Follow existing component patterns
- Use Tailwind CSS for styling
- Keep components focused and reusable
- Use proper error handling

### Making Changes

1. **Adding New Features**
   - Create components in appropriate directories
   - Update types in shared/types.ts
   - Add API endpoints in server/routes.ts

2. **Styling Changes**
   - Use Saanchari brand colors in index.css
   - Follow existing design patterns
   - Test responsive design

3. **AI/Translation Changes**
   - Modify services/gemini.ts for AI behavior
   - Update services/translator.ts for translation logic
   - Test with all supported languages

### Deployment

The application is designed to work on:
- Replit (primary deployment)
- Local development
- Any Node.js hosting platform

For production deployment, ensure:
- Environment variables are properly set
- Build process completes successfully
- All dependencies are installed