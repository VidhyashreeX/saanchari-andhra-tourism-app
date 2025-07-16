import { useState, useEffect, useRef } from 'react';
import { ChatInterface } from '../components/ChatInterface';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import type { Message, Language } from '@shared/types';
import logoImage from '@assets/logo_1752630933565.png';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Add welcome message
    const welcomeMessages = {
      en: "Namaste! I'm Saanchari, your expert travel assistant for Andhra Pradesh. I can help you plan amazing trips, suggest the best places to visit, recommend local food, and provide travel tips. What would you like to know about Andhra Pradesh?",
      hi: "[हिंदी] नमस्ते! मैं साँचारी हूँ, आंध्र प्रदेश के लिए आपकी विशेषज्ञ यात्रा सहायक। मैं आपको अद्भुत यात्राओं की योजना बनाने, घूमने के लिए सबसे अच्छी जगहों का सुझाव देने, स्थानीय भोजन की सिफारिश करने और यात्रा की सुझाव देने में मदद कर सकती हूँ। आप आंध्र प्रदेश के बारे में क्या जानना चाहते हैं?",
      te: "[తెలుగు] నమస్తే! నేను సాంచారి, ఆంధ్ర ప్రదేశ్ కోసం మీ నిపుణ ప్రయాణ సహాయకుడిని. అద్భుతమైన యాత్రలను ప్లాన్ చేయడంలో, సందర్శించడానికి ఉత్తమ ప్రదేశాలను సూచించడంలో, స్థానిక ఆహారాన్ని సిఫార్సు చేయడంలో మరియు ప్రయాణ చిట్కాలను అందించడంలో నేను మీకు సహాయం చేయగలను. మీరు ఆంధ్ర ప్రదేశ్ గురించి ఏమి తెలుసుకోవాలనుకుంటున్నారు?"
    };

    setMessages([{
      id: '1',
      text: welcomeMessages[currentLanguage],
      sender: 'bot',
      timestamp: new Date(),
      language: currentLanguage
    }]);
  }, [currentLanguage]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
      language: currentLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          language: currentLanguage,
          history: messages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
        language: currentLanguage
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        language: currentLanguage
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLanguageChange = async (language: Language) => {
    if (language === currentLanguage) return;

    setCurrentLanguage(language);
    
    // Translate existing messages
    if (messages.length > 0) {
      try {
        const response = await fetch('/api/translate-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: messages.map(msg => ({
              text: msg.text,
              sender: msg.sender
            })),
            targetLanguage: language
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(prev => prev.map((msg, index) => ({
            ...msg,
            text: data.messages[index]?.text || msg.text,
            language: language
          })));
        }
      } catch (error) {
        console.error('Error translating history:', error);
      }
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center">
          <img 
            src={logoImage} 
            alt="Saanchari Logo" 
            className="h-12 w-auto mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold text-saanchari-primary">Saanchari</h1>
            <p className="text-sm text-saanchari-dark">Your Travel Companion</p>
          </div>
        </div>
        
        <LanguageSwitcher 
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />
      </header>

      {/* Chat Interface */}
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
        currentLanguage={currentLanguage}
      />

      <div ref={messagesEndRef} />
    </div>
  );
}
