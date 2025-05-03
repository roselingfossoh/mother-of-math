import { useState, useEffect } from "react";
import ChatMessage, { MessageType } from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WelcomeMessage from "@/components/WelcomeMessage";
import ApiKeyInput from "@/components/ApiKeyInput";
import { hasApiKey, sendMessage, fileToBase64 } from "@/services/api";
import { anonymizeImage } from "@/utils/imageAnalysis";
import { toast } from "sonner";

interface ChatMessageData {
  id: string;
  content: string | { text?: string; imageUrl?: string };
  type: MessageType;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasKey, setHasKey] = useState(hasApiKey());
  const [showWelcome, setShowWelcome] = useState(true);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  
  // Initialize with welcome message
  useEffect(() => {
    if (hasKey && messages.length === 0) {
      setShowWelcome(true);
    }
  }, [hasKey, messages.length]);
  
  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    const userMessageId = Date.now().toString();
    const userMessage = {
      id: userMessageId,
      content: message,
      type: "user" as MessageType,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setShowWelcome(false);
    setIsLoading(true);
    
    try {
      // Get response from API
      const response = await sendMessage(message);
      
      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: response.text,
          type: "assistant" as MessageType,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUploadImage = async (file: File) => {
    try {
      setIsLoading(true);
      
      // Convert file to base64
      const base64 = await fileToBase64(file);
      
      // Anonymize image for privacy
      const processedImage = await anonymizeImage(base64);
      
      // Add user message with image to chat
      const userMessageId = Date.now().toString();
      const userMessage = {
        id: userMessageId,
        content: {
          text: "I've uploaded student work for analysis",
          imageUrl: processedImage,
        },
        type: "user" as MessageType,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, userMessage]);
      setShowWelcome(false);
      
      // Get response from API with image
      const response = await sendMessage(
        "Please analyze this student's math work and provide feedback on any errors and remediation advice.",
        processedImage
      );
      
      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: response.text,
          type: "assistant" as MessageType,
          timestamp: new Date(),
        },
      ]);
      
      // If we have error analysis, show a toast with quick summary
      if (response.analysis && response.analysis.errorType) {
        toast.info(`Detected issue: ${response.analysis.errorType}`, {
          duration: 5000,
        });
      }

      // Add to recent activity
      setRecentActivity((prev) => [
        ...prev,
        `Uploaded on ${new Date().toLocaleString()}`,
      ]);
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApiKeySet = () => {
    setHasKey(true);
  };
  
  if (!hasKey) {
    return (
      <div className="min-h-screen flex flex-col bg-mama-light">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <ApiKeyInput onApiKeySet={handleApiKeySet} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-mama-light">
      <Header />
      <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full p-4 md:p-8 bg-[url('/cameroon-pattern.svg')] bg-repeat bg-[length:180px_180px] md:rounded-3xl border border-mama-purple/10 shadow-xl relative overflow-hidden">
        {/* Cameroonian pattern SVG overlay (for extra vibrance, optional) */}
        <div className="pointer-events-none absolute inset-0 opacity-10 z-0" style={{background: "url('/cameroon-pattern.svg') repeat"}} />
        {showWelcome && (
          <WelcomeMessage onExamplePrompt={handleSendMessage} />
        )}
        <div className="flex-1 overflow-y-auto mb-4 z-10">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg.content}
              type={msg.type}
              timestamp={msg.timestamp}
            />
          ))}
          {isLoading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-pulse-gentle flex items-center">
                <div className="h-2 w-2 bg-mama-purple rounded-full mr-1"></div>
                <div className="h-2 w-2 bg-mama-purple rounded-full mr-1 animation-delay-200"></div>
                <div className="h-2 w-2 bg-mama-purple rounded-full animation-delay-500"></div>
                <span className="ml-2 text-sm text-mama-purple font-semibold">Mothers for Mathematics is thinking...</span>
              </div>
            </div>
          )}
        </div>
        <div className="sticky bottom-0 z-10">
          <ChatInput
            onSendMessage={handleSendMessage}
            onUploadImage={handleUploadImage}
            isLoading={isLoading}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
