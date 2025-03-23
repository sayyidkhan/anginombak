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

/**
 * Enhance a text prompt to make it more detailed and creative
 * @param prompt The original text prompt to enhance
 * @returns The enhanced text prompt
 */
export const enhancePrompt = async (prompt: string): Promise<string> => {
  const systemPrompt = 
    "You are a creative writing assistant. Your task is to enhance the user's prompt by making it more detailed, " +
    "creative, and engaging. Add descriptive elements, sensory details, and make it more vivid without changing " +
    "the core meaning or intent. Keep the enhanced version concise but impactful. " +
    "DO NOT use any markdown formatting like asterisks, underscores, or hashtags in your response. " +
    "Return plain text only.";
  
  const enhancedText = await generateContentWithSystemPrompt(systemPrompt, prompt);
  
  // Additional cleanup to remove any markdown that might have been included
  return enhancedText
    .replace(/\*\*/g, '') // Remove bold formatting
    .replace(/\*/g, '')   // Remove italic formatting
    .replace(/\_\_/g, '') // Remove underscores
    .replace(/\_/g, '')   // Remove single underscores
    .replace(/\#\s/g, '') // Remove heading markers
    .trim();
};

/**
 * Generate adventure content based on prompt data
 * @param promptData Object containing all the prompt data (player1, player2, startLocation, etc.)
 * @returns The generated adventure content
 */
export const generateAdventureContent = async (
  promptData: {
    player1: string;
    player2: string;
    startLocation: {lat: number, lng: number, name: string} | null;
    checkpoints: number;
    duration: number;
    isPublic: boolean;
  }
): Promise<string> => {
  try {
    const systemPrompt = 
      "You are Mr Ombak 🌊, an adventure planning assistant. Your task is to create a detailed adventure plan based on the following information:\n\n" +
      "1. Player 1's interests and preferences\n" +
      "2. Player 2's interests and preferences\n" +
      "3. Starting location\n" +
      "4. Number of checkpoints to visit\n" +
      "5. Total duration of the adventure in minutes\n\n" +
      "Create a detailed adventure plan with the exact number of checkpoints requested. For each checkpoint, provide:\n" +
      "- A name and description of the location\n" +
      "- Activities to do there that combine both players' interests\n" +
      "- Estimated time to spend at the location\n" +
      "- A fun fact or interesting detail about the place\n\n" +
      "Format your response in a structured way with clear headings and sections. Be creative but practical, considering the total duration and starting location.";

    const userPrompt = 
      `Player 1 interests: ${promptData.player1}\n\n` +
      `Player 2 interests: ${promptData.player2}\n\n` +
      `Starting location: ${promptData.startLocation?.name || 'Not specified'} ` +
      `(Coordinates: ${promptData.startLocation?.lat}, ${promptData.startLocation?.lng})\n\n` +
      `Number of checkpoints: ${promptData.checkpoints}\n\n` +
      `Total duration: ${promptData.duration} minutes`;

    return generateContentWithSystemPrompt(systemPrompt, userPrompt);
  } catch (error) {
    console.error('Error generating adventure content:', error);
    throw error;
  }
};

export default {
  generateContent,
  generateContentWithSystemPrompt,
  enhancePrompt,
  generateAdventureContent
};
