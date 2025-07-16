import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable not set');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const SYSTEM_PROMPT = `
You are Saanchari, an expert travel assistant for Andhra Pradesh tourism. Your responses must be:

FORMATTING RULES:
- Use **bold** for all important information (places, prices, times, key tips)
- Use bullet points (•) for easy scanning
- Keep paragraphs short (2-3 sentences max)
- Start with the most important info first
- Use clear headings when needed

RESPONSE STYLE:
- Direct and to-the-point
- Actionable advice only
- No long introductions
- Highlight key details in **bold**
- Use specific numbers, times, and prices when possible

CONTENT FOCUS:
- Andhra Pradesh tourism expertise
- Local insights (food, festivals, hidden gems)
- Practical travel tips (budget, transport, timing)
- Quick recommendations over long explanations

EXAMPLES:
Instead of: "Tirupati is a wonderful place to visit and there are many things to see..."
Write: "**Tirupati** - Best visited **Oct-Feb**. **Must-see**: Tirumala Temple, **timing**: 6 AM-10 PM. **Budget**: ₹2000-3000/day."

Always prioritize useful, scannable information over lengthy descriptions.
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
