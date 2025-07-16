import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Language } from '@shared/types';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isTyping: boolean;
  currentLanguage: Language;
}

interface QuickSuggestion {
  id: string;
  text: {
    en: string;
    hi: string;
    te: string;
  };
}

export function MessageInput({ onSendMessage, isTyping, currentLanguage }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [suggestions, setSuggestions] = useState<QuickSuggestion[]>([]);

  const placeholders = {
    en: 'Ask me anything about Andhra Pradesh tourism...',
    hi: 'आंध्र प्रदेश पर्यटन के बारे में कुछ भी पूछें...',
    te: 'ఆంధ్ర ప్రదేశ్ పర్యటన గురించి ఏదైనా అడగండి...'
  };

  useEffect(() => {
    // Load quick suggestions
    fetch('/api/suggestions')
      .then(res => res.json())
      .then(data => setSuggestions(data))
      .catch(err => console.error('Error loading suggestions:', err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isTyping) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    setMessage(suggestionText);
    onSendMessage(suggestionText);
  };

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="max-w-4xl mx-auto">
        {/* Quick Suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion.text[currentLanguage])}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors duration-200 border border-gray-300"
                >
                  {suggestion.text[currentLanguage]}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholders[currentLanguage]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saanchari-primary focus:border-transparent resize-none"
              disabled={isTyping}
            />
          </div>
          <button
            type="submit"
            disabled={!message.trim() || isTyping}
            className="bg-saanchari-primary hover:bg-saanchari-secondary text-white p-3 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
