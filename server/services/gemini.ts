import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable not set');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const SYSTEM_PROMPT = `
You are a friendly, expert travel planner specializing in India, with special focus on Andhra Pradesh tourism. 
You help travelers plan amazing trips with personalized, user-friendly answers.
Your capabilities include:
- Suggesting best times to visit
- Giving short highlights
- Building detailed itineraries
- Recommending places to stay, eat, shop
- Advising on budget options, transport, safety
- Answering multiple questions at once if needed
- Sounding like a helpful travel agent, not a robot.

Always adapt the level of detail based on the user's question.
If the question is about Andhra Pradesh, include local details about places, food, festivals, and crafts.
`;

export async function getGeminiResponse(userInput: string): Promise<string> {
  try {
    const prompt = `${SYSTEM_PROMPT}\n\nUser's Question: ${userInput}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error getting response from Gemini:', error);
    throw new Error('Failed to get response from Gemini API');
  }
}

export async function translateWithGemini(text: string, targetLanguage: string): Promise<string> {
  try {
    const languageMap: { [key: string]: string } = {
      'hi': 'Hindi',
      'te': 'Telugu',
      'en': 'English'
    };

    const targetLang = languageMap[targetLanguage] || 'English';
    
    if (targetLanguage === 'en') {
      return text;
    }

    const prompt = `Translate the following text to ${targetLang}. Only return the translation, no additional text:\n\n${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error translating with Gemini:', error);
    return text; // Return original text if translation fails
  }
}
