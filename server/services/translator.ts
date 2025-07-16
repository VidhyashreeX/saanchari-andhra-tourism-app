import { translateWithGemini } from './gemini';

export interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export async function translateText(
  text: string,
  targetLanguage: string,
  isUserMessage: boolean = false
): Promise<TranslationResult> {
  try {
    // Skip translation if target is English or text is empty
    if (targetLanguage === 'en' || !text.trim()) {
      return {
        translatedText: text,
        sourceLanguage: 'en',
        targetLanguage
      };
    }

    // Clean text by removing existing language prefixes
    const cleanText = text.replace(/^\[हिंदी\]\s*/, '').replace(/^\[తెలుగు\]\s*/, '').trim();
    
    // Translate using Gemini
    const translatedText = await translateWithGemini(cleanText, targetLanguage);
    
    // Add language prefix for non-English translations
    let finalText = translatedText;
    if (targetLanguage === 'hi') {
      finalText = `[हिंदी] ${translatedText}`;
    } else if (targetLanguage === 'te') {
      finalText = `[తెలుగు] ${translatedText}`;
    }

    return {
      translatedText: finalText,
      sourceLanguage: 'en',
      targetLanguage
    };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      translatedText: text,
      sourceLanguage: 'en',
      targetLanguage
    };
  }
}

export async function translateChatHistory(
  messages: Array<{ text: string; sender: 'user' | 'bot' }>,
  targetLanguage: string
): Promise<Array<{ text: string; sender: 'user' | 'bot' }>> {
  if (targetLanguage === 'en') {
    // Remove language prefixes for English
    return messages.map(msg => ({
      ...msg,
      text: msg.text.replace(/^\[हिंदी\]\s*/, '').replace(/^\[తెలుగు\]\s*/, '').trim()
    }));
  }

  // Translate all messages
  const translatedMessages = await Promise.all(
    messages.map(async (msg) => {
      const result = await translateText(msg.text, targetLanguage, msg.sender === 'user');
      return {
        ...msg,
        text: result.translatedText
      };
    })
  );

  return translatedMessages;
}
