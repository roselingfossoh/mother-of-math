import { toast } from "sonner";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = "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";
const OPENROUTER_MODEL = "anthropic/claude-3-sonnet";

// Interface for API responses
export interface ChatResponse {
  text: string;
  analysis?: {
    errorType?: string;
    remediation?: string;
  };
}

// Function to get API key
export const getApiKey = (): string => {
  return OPENROUTER_API_KEY;
};

// Function to check if API key is set
export const hasApiKey = (): boolean => {
  return true; // Since we're using a hardcoded key
};

// Initialize a chat session with the AI
export const initializeChat = async () => {
  // This is just a placeholder for now
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
Use markdown formatting, including headings, to structure the analysis and make it easy to read.
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
    
    
    // Parse the response to extract any error analysis
    let analysis = {};
    if (imageBase64) {
      // Try to extract error type and remediation from the AI's response
      // Note: We are no longer cleaning markdown, so the regex might need adjustment
      // to handle potential markdown in the matches. For simplicity now, we keep
      // the original regex but be aware it might not capture perfectly if markdown
      // is heavily used within the errorType or remediation phrases themselves.
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
