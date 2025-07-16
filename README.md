# Saanchari - Tourism Assistant for Andhra Pradesh

A multilingual tourism chatbot for Andhra Pradesh with ChatGPT-like interface, powered by Google Gemini AI, supporting English, Hindi, and Telugu languages.

## Features

- **ChatGPT-like Interface**: Clean, modern chat interface similar to ChatGPT
- **Multi-language Support**: English, Hindi, and Telugu with real-time translation
- **AI-Powered**: Uses Google Gemini AI for intelligent travel recommendations
- **Enhanced Responses**: Bold formatting, bullet points, and scannable information
- **Andhra Pradesh Tourism**: Specialized knowledge about Andhra Pradesh destinations
- **Real-time Translation**: Seamlessly switch between languages during conversation
- **Quick Suggestions**: Pre-defined travel questions to get started quickly
- **Customizable System Prompt**: Easy to modify AI behavior and response style

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Google Gemini API key (free from Google)

## Local Development Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd saanchari
npm install
```

### 2. Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key (starts with "AIza...")

### 3. Environment Setup

1. Copy the environment example file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   NODE_ENV=development
   PORT=5000
   ```

### 4. Run the Application

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
saanchari/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Backend Express application
│   ├── services/          # AI and translation services
│   ├── routes.ts          # API routes
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
└── attached_assets/       # Logo and brand assets
```

## API Endpoints

- `POST /api/chat` - Send chat messages and get AI responses
- `POST /api/translate` - Translate text between languages
- `POST /api/translate-history` - Translate chat history
- `GET /api/suggestions` - Get quick suggestion prompts

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port (default: 5000) | No |

## Color Scheme

The application uses the official Saanchari brand colors:
- Primary: #F75768 (Coral Pink)
- Secondary: #FB6957 (Orange)
- Accent: #07546B (Dark Teal)
- Neutral: #CFD1D1 (Light Gray)

## Languages Supported

- **English** (en) - Default language
- **Hindi** (hi) - हिंदी with [हिंदी] prefix
- **Telugu** (te) - తెలుగు with [తెలుగు] prefix

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Database operations (if using database)
npm run db:push
npm run db:generate
```

## Troubleshooting

### Common Issues

1. **API Key Error**: Make sure your GEMINI_API_KEY is correctly set in the `.env` file
2. **Port 5000 in use**: Change the PORT in `.env` file or stop other services using port 5000
3. **Module not found**: Run `npm install` to install all dependencies

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Check the server logs in the terminal
3. Verify your API key is valid and has sufficient quota
4. Ensure all environment variables are properly set

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational and demonstration purposes.