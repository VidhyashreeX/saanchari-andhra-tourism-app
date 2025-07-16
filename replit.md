# Saanchari - Travel Assistant for Andhra Pradesh

## Overview

Saanchari is a multilingual travel assistant web application specifically designed for Andhra Pradesh tourism. The application provides travel recommendations, itinerary planning, and local insights through an AI-powered chatbot interface that supports English, Hindi, and Telugu languages.

### Recent Changes (January 2025)
- ✅ Updated to use exact Saanchari brand colors (#F75768, #FB6957, #07546B, #CFD1D1)
- ✅ Implemented ChatGPT-like interface with full-height layout
- ✅ Added comprehensive local development setup with .env file support
- ✅ Created setup script and development documentation
- ✅ Enhanced message styling with rounded corners and proper spacing
- ✅ Added dotenv package for environment variable management

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom Saanchari brand colors
- **State Management**: React hooks for local state, TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for chat and translation services
- **Middleware**: Express middleware for logging, JSON parsing, and error handling

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database)
- **Schema**: User management with username/password authentication
- **Migrations**: Drizzle Kit for database schema management

## Key Components

### AI Integration
- **Primary AI**: Google Gemini 2.5 Flash model for travel recommendations
- **Translation Service**: Gemini-powered translation for Hindi and Telugu
- **System Prompts**: Specialized prompts for Andhra Pradesh tourism expertise

### Chat System
- **Real-time Chat**: Message-based conversation interface
- **Message Types**: User messages and bot responses with timestamps
- **Language Support**: Dynamic language switching with message prefixes
- **UI Components**: Custom chat interface with typing indicators

### Translation System
- **Multi-language Support**: English, Hindi ([हिंदी] prefix), Telugu ([తెలుగు] prefix)
- **Smart Translation**: Context-aware translation with language detection
- **Fallback Handling**: Graceful error handling for translation failures

### User Interface
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Component Library**: Comprehensive UI components (buttons, cards, forms, etc.)
- **Accessibility**: ARIA labels and keyboard navigation support
- **Dark Mode**: CSS variables for theme switching capability

## Data Flow

1. **User Input**: User types message in chat interface
2. **Language Detection**: System identifies selected language preference
3. **API Request**: Message sent to `/api/chat` endpoint with language context
4. **AI Processing**: Gemini API processes travel-related query
5. **Translation**: Response translated to user's preferred language if needed
6. **Response Delivery**: Formatted message displayed with appropriate language prefix
7. **State Update**: Chat history updated with new message exchange

## External Dependencies

### AI Services
- **Google Gemini API**: Primary AI model for travel recommendations
- **API Key**: Required environment variable `GEMINI_API_KEY`

### Database Services
- **Neon Database**: PostgreSQL hosting service
- **Connection**: Environment variable `DATABASE_URL`

### UI Libraries
- **Radix UI**: Headless UI components for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Build tool with Hot Module Replacement
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite development server with HMR
- **API Proxy**: Vite proxies API requests to Express server
- **Environment Variables**: Separate configs for development and production

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves frontend assets in production

### Database Management
- **Schema Sync**: `npm run db:push` applies schema changes
- **Migrations**: Drizzle generates and applies database migrations
- **Connection Pooling**: Neon serverless driver for efficient connections

### Environment Configuration
- **Required Variables**: `GEMINI_API_KEY` (required), `DATABASE_URL` (optional)
- **Development**: Uses .env file with dotenv package for local development
- **Production**: Environment variables for sensitive configuration

### Local Development Setup
- **Setup Script**: `setup.sh` automates initial setup
- **Environment File**: `.env.example` provides template for local configuration
- **Documentation**: `README.md` and `DEVELOPMENT.md` provide comprehensive setup guides
- **Dependencies**: dotenv package handles environment variable loading

### Error Handling
- **Client-side**: React error boundaries and toast notifications
- **Server-side**: Express error middleware with structured logging
- **Database**: Connection retry logic and transaction management
- **AI Services**: Fallback responses for API failures