import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { v4 as uuidv4 } from "uuid";
import { insertConversationSchema, insertMessageSchema } from "@shared/schema";
import { i18nTranslations } from "@shared/i18n";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Get all symptom categories
  app.get("/api/symptom-categories", async (req, res) => {
    try {
      const categories = await storage.getSymptomCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch symptom categories" });
    }
  });

  // Get all health facilities
  app.get("/api/health-facilities", async (req, res) => {
    try {
      const facilities = await storage.getHealthFacilities();
      res.json(facilities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch health facilities" });
    }
  });

  // Create a new conversation or return existing one
  app.post("/api/conversations", async (req, res) => {
    try {
      const { sessionId, language } = req.body;
      
      // Validate the sessionId
      let conversationSessionId = sessionId;
      if (!conversationSessionId) {
        conversationSessionId = uuidv4();
      }
      
      // Check if conversation exists
      let conversation = await storage.getConversation(conversationSessionId);
      
      // If not, create a new one
      if (!conversation) {
        const insertData = {
          sessionId: conversationSessionId,
          language: language || "en",
          messages: []
        };
        
        const result = insertConversationSchema.safeParse(insertData);
        if (!result.success) {
          return res.status(400).json({ message: "Invalid conversation data", errors: result.error });
        }
        
        conversation = await storage.createConversation(result.data);
        
        // Add initial welcome message in selected language
        const translations = i18nTranslations[language || "en"];
        await storage.addMessageToConversation({
          conversationId: conversation.id,
          role: "system",
          content: translations.welcome
        });
      }
      
      // Get all messages for the conversation
      const messages = await storage.getMessagesForConversation(conversation.id);
      
      res.json({
        conversation,
        messages,
        sessionId: conversationSessionId
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create or retrieve conversation" });
    }
  });

  // Add message to conversation
  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { role, content } = req.body;
      
      const insertData = {
        conversationId,
        role,
        content
      };
      
      const result = insertMessageSchema.safeParse(insertData);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid message data", errors: result.error });
      }
      
      const message = await storage.addMessageToConversation(result.data);
      
      // Generate a response from the system based on the user's message
      if (role === "user") {
        // Simplified logic - in a real app, this would involve more sophisticated NLP
        // For now we'll just simulate a response
        const conversation = await storage.getConversation(req.body.sessionId);
        if (conversation) {
          const language = conversation.language || "en";
          const translations = i18nTranslations[language];
          
          // Get all messages to analyze conversation context
          const messages = await storage.getMessagesForConversation(conversationId);
          
          // Simplified triage logic
          let responseContent = "";
          
          if (content.toLowerCase().includes("emergency") || 
              content.toLowerCase().includes("accident") ||
              content.toLowerCase().includes("severe")) {
            responseContent = translations.triage.emergency;
          } else if (content.toLowerCase().includes("pain") ||
                     content.toLowerCase().includes("fever") || 
                     content.toLowerCase().includes("sick")) {
            responseContent = translations.triage.urgent;
          } else {
            responseContent = translations.triage.nonUrgent;
          }
          
          // Add system response
          const systemResponse = await storage.addMessageToConversation({
            conversationId,
            role: "system",
            content: responseContent
          });
          
          // Add follow-up question
          const followUpResponse = await storage.addMessageToConversation({
            conversationId,
            role: "system",
            content: translations.triage.followUp
          });
          
          return res.json({
            userMessage: message,
            systemResponses: [systemResponse, followUpResponse]
          });
        }
      }
      
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Failed to add message to conversation" });
    }
  });

  // Get i18n translations
  app.get("/api/translations/:language", (req, res) => {
    const language = req.params.language;
    const translations = i18nTranslations[language] || i18nTranslations.en;
    res.json(translations);
  });

  const httpServer = createServer(app);

  return httpServer;
}
