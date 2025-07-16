import type { Express } from "express";
import { createServer, type Server } from "http";
import { getGeminiResponse } from "./services/gemini";
import { translateText, translateChatHistory } from "./services/translator";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, language = 'en', history = [] } = req.body;

      if (!message || !message.trim()) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Get response from Gemini
      const response = await getGeminiResponse(message.trim());

      // Translate response if needed
      let translatedResponse = response;
      if (language !== 'en') {
        const translationResult = await translateText(response, language, false);
        translatedResponse = translationResult.translatedText;
      }

      res.json({
        response: translatedResponse,
        originalResponse: response,
        language
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Translation endpoint
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLanguage, isUserMessage = false } = req.body;

      if (!text || !targetLanguage) {
        return res.status(400).json({ error: "Text and target language are required" });
      }

      const result = await translateText(text, targetLanguage, isUserMessage);
      res.json(result);
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ error: "Failed to translate text" });
    }
  });

  // Translate chat history endpoint
  app.post("/api/translate-history", async (req, res) => {
    try {
      const { messages, targetLanguage } = req.body;

      if (!messages || !Array.isArray(messages) || !targetLanguage) {
        return res.status(400).json({ error: "Messages array and target language are required" });
      }

      const translatedMessages = await translateChatHistory(messages, targetLanguage);
      res.json({ messages: translatedMessages });
    } catch (error) {
      console.error("History translation error:", error);
      res.status(500).json({ error: "Failed to translate chat history" });
    }
  });

  // Quick suggestions endpoint
  app.get("/api/suggestions", (req, res) => {
    const suggestions = [
      {
        id: '1',
        text: {
          en: "Best time to visit Tirupati",
          hi: "तिरुपति जाने का सबसे अच्छा समय",
          te: "తిరుపతి సందర్శించడానికి ఉత్తమ సమయం"
        }
      },
      {
        id: '2',
        text: {
          en: "Local food in Hyderabad",
          hi: "हैदराबाद का स्थानीय खाना",
          te: "హైదరాబాద్‌లో స్థానిక ఆహారం"
        }
      },
      {
        id: '3',
        text: {
          en: "Budget travel tips",
          hi: "बजट यात्रा की टिप्स",
          te: "బడ్జెట్ ప్రయాణ చిట్కాలు"
        }
      }
    ];

    res.json(suggestions);
  });

  const httpServer = createServer(app);
  return httpServer;
}
