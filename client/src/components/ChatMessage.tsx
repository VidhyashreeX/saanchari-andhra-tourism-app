import { Message } from '@shared/types';
import { MapPin } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const showLanguageBadge = message.language && message.language !== 'en' && !isUser;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'items-start space-x-3'} mb-6 fade-in`}>
      {!isUser && (
        <div className="w-10 h-10 bg-saanchari-accent rounded-full flex items-center justify-center flex-shrink-0">
          <MapPin className="text-white" size={16} />
        </div>
      )}
      
      <div className={`message-bubble ${
        isUser 
          ? 'bg-saanchari-primary text-white ml-12' 
          : 'bg-white border border-gray-200'
      } rounded-2xl px-5 py-4 shadow-sm`}>
        {showLanguageBadge && (
          <span className={`language-badge ${message.language === 'hi' ? 'hindi' : 'telugu'}`}>
            {message.language?.toUpperCase()}
          </span>
        )}
        <p className={`${isUser ? 'text-white' : 'text-saanchari-dark'} leading-relaxed`}>
          {message.text}
        </p>
      </div>
    </div>
  );
}
