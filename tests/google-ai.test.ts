import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { describe, it, expect } from "@jest/globals";

// Load environment variables
dotenv.config();

describe("Google AI API Tests", () => {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not set in environment variables");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  it("should generate content using Gemini Pro model", async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = "Explain how AI works in a few words";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    expect(text).toBeDefined();
    expect(typeof text).toBe("string");
    expect(text.length).toBeGreaterThan(0);
  }, 10000); // Increased timeout for API call

  it("should handle errors gracefully", async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Invalid prompt that should trigger an error
    const prompt = "";
    
    await expect(model.generateContent(prompt)).rejects.toThrow();
  });
}); 