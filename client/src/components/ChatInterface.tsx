import { Message, Language } from '@shared/types';
import { ChatMessage } from './ChatMessage';
import { MessageInput } from './MessageInput';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isTyping: boolean;
  currentLanguage: Language;
}

export function ChatInterface({ messages, onSendMessage, isTyping, currentLanguage }: ChatInterfaceProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="message-container flex-1 px-6 py-6 bg-saanchari-light overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start space-x-3 mb-6">
              <div className="w-8 h-8 bg-saanchari-accent rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0">
        <MessageInput
          onSendMessage={onSendMessage}
          isTyping={isTyping}
          currentLanguage={currentLanguage}
        />
      </div>
    </div>
  );
}
