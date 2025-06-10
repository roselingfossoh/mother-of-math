import { toast } from "sonner";
import { checkEnvironmentVariables } from "@/utils/envCheck";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Use a more cost-effective model
const OPENROUTER_MODEL = "google/gemini-2.5-flash-preview-05-20";

// Interface for API responses
export interface ChatResponse {
  text: string;
  analysis?: {
    errorType?: string;
    remediation?: string;
  };
}

// Function to get API key with validation
export const getApiKey = (): string | undefined => {
  const key = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  // Debug logging
  console.log('Environment check:', {
    hasKey: !!key,
    keyLength: key?.length,
    keyPrefix: key?.substring(0, 7),
    allEnvVars: Object.keys(import.meta.env)
  });

  if (!key) {
    console.error('API key is missing');
    return undefined;
  }

  if (!key.startsWith('sk-or-v1-')) {
    console.error('API key format is invalid - should start with sk-or-v1-');
    return undefined;
  }

  return key;
};

// Function to check if API key is set
export const hasApiKey = (): boolean => {
  return !!import.meta.env.VITE_OPENROUTER_API_KEY;
};

// Initialize a chat session with the AI
export const initializeChat = async () => {
  return {
    sessionId: `session_${Date.now()}`,
    createdAt: new Date().toISOString()
  };
};

// Main function to send messages to the AI
export const sendMessage = async (
  message: string,
  imageBase64?: string
): Promise<ChatResponse> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    const error = new Error("API key not configured properly");
    console.error("API Configuration Error:", {
      message: error.message,
      envVars: Object.keys(import.meta.env),
      hasKey: !!apiKey
    });
    toast.error("API Key is not configured. Please check your .env file.");
    throw error;
  }

  let systemPrompt = `You are an AI assistant for "Mothers for Mathematics", a project helping teachers and parents in Cameroon with mathematics education. You specialize in:

1. Creating structured lesson plans aligned with the Cameroon primary maths curriculum
2. Using local, culturally relevant examples in your teaching materials (like market-based word problems)
3. Providing feedback on student work using Math Error Analysis principles
4. Giving practical remediation advice for educators

If asked for a lesson plan, structure your response with:
- Learning objectives 
- Materials needed
- Lesson steps (introduction, development, practice, conclusion)
- Assessment questions
- Teaching strategies

When analyzing student work, identify:
- Specific error types (e.g., incorrect counting, mixed grouping, etc.)
- Root causes of mathematical misunderstandings
- Practical remediation strategies that parents or teachers can implement

Always be encouraging, use simple language, and provide actionable advice.
Use markdown formatting, including headings, to structure the analysis and make it easy to read.`;

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
        max_tokens: 1000,
        stream: false
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Details:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (response.status === 401) {
        toast.error("Invalid API key. Please check your OpenRouter API key.");
        throw new Error("Invalid API key");
      }
      
      throw new Error(errorData.message || "API request failed");
    }
    
    const data = await response.json();
    const aiMessage = data.choices[0].message.content;
    
    // Parse the response to extract any error analysis
    let analysis = {};
    if (imageBase64) {
      const errorTypeMatch = aiMessage.match(/error type:?\s*([^\.]+)/i);
      const remediationMatch = aiMessage.match(/remediation:?\s*([^\.]+)/i);
      
      if (errorTypeMatch || remediationMatch) {
        analysis = {
          errorType: errorTypeMatch ? errorTypeMatch[1].trim() : undefined,
          remediation: remediationMatch ? remediationMatch[1].trim() : undefined
        };
      }
    }
    
    return {
      text: aiMessage,
      analysis
    };
  } catch (error) {
    console.error("API Request Error:", error);
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
