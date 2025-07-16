# 🌍 Saanchari - AI-Powered Tourism Assistant for Andhra Pradesh

<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Google_Generative_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Generative AI">
</div>

## ✨ Overview

Saanchari is an intelligent, multilingual tourism assistant designed specifically for Andhra Pradesh. Powered by Google's Gemini AI, it provides personalized travel recommendations, cultural insights, and real-time assistance in English, Hindi, and Telugu. The application features a modern, ChatGPT-like interface with seamless language switching capabilities.

## 🚀 Key Features

- **Multilingual Support**: Native support for English, Hindi, and Telugu with real-time translation
- **AI-Powered Recommendations**: Utilizes Google's Gemini AI for intelligent, context-aware travel suggestions
- **Interactive Chat Interface**: Clean, responsive UI with typing indicators and message history
- **Quick Suggestions**: Pre-defined prompts for common tourism queries
- **Rich Media Support**: Displays images and formatted content for better user experience
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠️ Technical Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **State Management**: React Query
- **Styling**: Tailwind CSS with custom theming
- **UI Components**: Radix UI primitives
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js with Express
- **AI Integration**: Google Gemini API
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: OpenAPI/Swagger

### AI & ML
- **Generative AI**: Google Gemini Pro
- **Language Model**: Gemini 1.0 Pro
- **Context Window**: 30,720 tokens
- **Multimodal Capabilities**: Text and image understanding

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/VidhyashreeX/saanchari-andhra-tourism-app.git
   cd saanchari-andhra-tourism-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Google Gemini API key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5000
   - API Server: http://localhost:5000/api

## 🏗️ Project Structure

```
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   └── src/               # Source code
│       ├── components/    # Reusable UI components
│       ├── pages/         # Page components
│       ├── hooks/         # Custom React hooks
│       └── lib/           # Utility functions and API clients
├── server/                # Backend Express application
│   ├── services/          # Business logic and external services
│   ├── routes.ts          # API route definitions
│   └── index.ts           # Server entry point
├── shared/                # Shared types and utilities
└── .github/               # GitHub workflows and templates
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/chat` | Process chat messages with AI |
| POST   | `/api/translate` | Translate text between supported languages |
| GET    | `/api/suggestions` | Get quick suggestion prompts |

## 🔒 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# JWT Configuration (optional)
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

## 🎨 UI Components

The application uses a custom design system built with:
- **Radix UI** for accessible primitives
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Icons** for iconography

## 🤖 AI Integration

### Google Gemini AI
- **Model**: Gemini 1.0 Pro
- **Features**:
  - Natural language understanding
  - Context-aware responses
  - Support for code generation
  - Image understanding capabilities

### Prompt Engineering

Custom system prompt template:
```
You are Saanchari, an AI travel assistant for Andhra Pradesh. Your responses should be:
- Informative and engaging
- Culturally sensitive
- Available in English, Hindi, and Telugu
- Formatted with markdown for better readability
```

## 🛡️ Security

- Input sanitization
- Rate limiting
- JWT authentication
- Environment-based configuration
- Secure headers

## 📦 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Support
```bash
docker build -t saanchari .
docker run -p 5000:5000 saanchari
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google AI for the Gemini API
- The React and Node.js communities
- All contributors and testers

## 📬 Contact

For questions or feedback, please open an issue or contact the maintainers.