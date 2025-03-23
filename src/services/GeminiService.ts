/**
 * Gemini AI API Service
 * This service provides methods to interact with Google's Gemini AI API
 */

// API key should be stored in .env file as VITE_GEMINI_API_KEY
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface GeminiRequestContent {
  parts: {
    text: string;
  }[];
}

interface GeminiRequest {
  contents: GeminiRequestContent[];
}

interface GeminiResponsePart {
  text: string;
}

interface GeminiResponseCandidate {
  content: {
    parts: GeminiResponsePart[];
  };
  finishReason: string;
  index: number;
}

interface GeminiResponse {
  candidates: GeminiResponseCandidate[];
  promptFeedback?: {
    blockReason?: string;
    safetyRatings?: any[];
  };
}

/**
 * Generate content using Gemini AI
 * @param prompt The text prompt to send to Gemini
 * @returns The generated text response
 */
export const generateContent = async (prompt: string): Promise<string> => {
  try {
    const requestBody: GeminiRequest = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    
    // Check if the response was blocked for safety reasons
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Prompt was blocked: ${data.promptFeedback.blockReason}`);
    }
    
    // Extract the generated text from the first candidate
    if (data.candidates && data.candidates.length > 0) {
      const textParts = data.candidates[0].content.parts.map(part => part.text);
      return textParts.join('');
    }
    
    return 'No response generated';
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    throw error;
  }
};

/**
 * Generate content with a system prompt to guide the AI's behavior
 * @param systemPrompt Instructions for how the AI should behave
 * @param userPrompt The user's input prompt
 * @returns The generated text response
 */
export const generateContentWithSystemPrompt = async (
  systemPrompt: string,
  userPrompt: string
): Promise<string> => {
  const combinedPrompt = `${systemPrompt}\n\nUser input: ${userPrompt}`;
  return generateContent(combinedPrompt);
};

export default {
  generateContent,
  generateContentWithSystemPrompt
};
