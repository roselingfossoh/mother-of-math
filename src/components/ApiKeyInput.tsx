
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { setApiKey, getApiKey } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyInputProps {
  onApiKeySet: () => void;
}

const ApiKeyInput = ({ onApiKeySet }: ApiKeyInputProps) => {
  const [key, setKey] = useState(getApiKey());
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!key.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenRouter API key",
        variant: "destructive",
      });
      return;
    }
    
    setApiKey(key);
    onApiKeySet();
    
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved",
    });
  };
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Welcome to Math Mama Mentor</CardTitle>
        <CardDescription>
          To get started, please enter your OpenRouter API key
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Input
                id="apiKey"
                placeholder="Enter your OpenRouter API key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                type="password"
              />
            </div>
            <Button type="submit" className="w-full">
              Save API Key
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <p className="text-sm text-muted-foreground">
          Don't have an API key?{" "}
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-mama-purple hover:underline"
          >
            Get one from OpenRouter
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default ApiKeyInput;
