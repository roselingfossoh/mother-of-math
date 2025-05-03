import { toast } from "sonner";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = ""; // This should be set by the user
const OPENROUTER_MODEL = "deepseek/deepseek-r1:free"; // Use the specified model

// Interface for API responses
export interface ChatResponse {
  text: string;
  analysis?: {
    errorType?: string;
    remediation?: string;
  };
}

// Function to set API key
export const setApiKey = (key: string) => {
  localStorage.setItem("openrouter_api_key", key);
};

// Function to get API key
export const getApiKey = (): string => {
  return localStorage.getItem("openrouter_api_key") || "";
};

// Function to check if API key is set
export const hasApiKey = (): boolean => {
  return !!getApiKey();
};

// Initialize a chat session with the AI
export const initializeChat = async () => {
  // This is just a placeholder for now
  return {
    sessionId: `session_${Date.now()}`,
    createdAt: new Date().toISOString()
  };
};

// Helper function to clean markdown formatting
const cleanMarkdownFormatting = (text: string): string => {
  // Remove heading markers (###, ##, #)
  let cleaned = text.replace(/#{1,6}\s+/g, '');
  
  // Remove bold/italic markers (**, *, __, _)
  cleaned = cleaned.replace(/(\*\*|\*|__|_)(.*?)\1/g, '$2');
  
  // Remove other common markdown elements if needed
  // - Remove code blocks
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');
  
  // - Remove inline code
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
  
  // - Remove bullet points
  cleaned = cleaned.replace(/^\s*[-*+]\s+/gm, '');
  
  return cleaned;
};

// Main function to send messages to the AI
export const sendMessage = async (
  message: string,
  imageBase64?: string
): Promise<ChatResponse> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API key not set");
  }

  let systemPrompt = `You are an AI assistant for "Mothers for Mathematics", a project helping teachers and parents in Cameroon with mathematics education. You specialize in:

1. Creating structured lesson plans aligned with the Cameroon primary maths curriculum
2. Using local, culturally relevant examples in your teaching materials (like market-based word problems)
3. Providing feedback on student work using Math Error Analysis principles
4. Giving practical remediation advice for educators

If asked for a lesson plan, structure your response with:
- Learning objectives 
- Materials needed
- Lesson uestions
-high impactsteps (introduction, development, practice, conclusion)
- Assessment q teaching strategies

When analyzing student work, identify:
- Specific error types (e.g., incorrect counting, mixed grouping, etc.)
- Root causes of mathematical misunderstandings
- Practical remediation strategies that parents or teachers can implement

Always be encouraging, use simple language, and provide actionable advice.
Do not use markdown formatting like ###, **, or other markdown elements in your responses.
`;

  let userContent: any[] = [{ type: "text", text: message }];
  
  // Add image if provided
  if (imageBase64) {
    systemPrompt += "\nThe user has uploaded an image of student work. Analyze it for mathematical errors, providing specific feedback on what the student did correctly and incorrectly. Suggest practical remediation activities.";
    
    userContent.push({
      type: "image_url",
      image_url: {
        url: imageBase64,
        detail: "high"
      }
    });
  }
  
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "Math Mama Mentor"
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userContent
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(errorData.message || "Error communicating with AI");
    }
    
    const data = await response.json();
    const aiMessage = data.choices[0].message.content;
    
    // Clean markdown formatting from the AI's response
    const cleanedMessage = cleanMarkdownFormatting(aiMessage);
    
    // Parse the response to extract any error analysis
    let analysis = {};
    if (imageBase64) {
      // Try to extract error type and remediation from the AI's response
      const errorTypeMatch = cleanedMessage.match(/error type:?\s*([^\.]+)/i);
      const remediationMatch = cleanedMessage.match(/remediation:?\s*([^\.]+)/i);
      
      if (errorTypeMatch || remediationMatch) {
        analysis = {
          errorType: errorTypeMatch ? errorTypeMatch[1].trim() : undefined,
          remediation: remediationMatch ? remediationMatch[1].trim() : undefined
        };
      }
    }
    
    return {
      text: cleanedMessage,
      analysis
    };
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Failed to get response from AI. Please try again.");
    throw error;
  }
};

// Function to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};
