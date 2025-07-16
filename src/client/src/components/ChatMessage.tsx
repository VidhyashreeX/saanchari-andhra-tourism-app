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
        <div className={`${isUser ? 'text-white' : 'text-saanchari-dark'} leading-relaxed`}>
          {message.text.split('\n').map((line, index) => {
            // Handle bullet points
            if (line.startsWith('•')) {
              return (
                <div key={index} className="flex items-start mb-1">
                  <span className="mr-2 font-bold">•</span>
                  <span dangerouslySetInnerHTML={{ __html: line.substring(1).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              );
            }
            // Handle regular lines with bold formatting
            return (
              <p key={index} className={`${line.trim() ? 'mb-2' : ''}`}>
                <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
