
import React, { useState } from 'react';
import ChatPanel from './components/ChatPanel';
import ImagePanel from './components/ImagePanel';
import type { ChatMessage } from './types';
import { generateImage } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: 'bot', text: 'Hello! Describe an image you would like me to create.' }
  ]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (prompt: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: prompt,
    };
    setMessages(prev => [...prev, userMessage]);

    // Prepare for generation
    setIsLoading(true);
    setError(null);
    setImageUrl(null); // Clear previous image

    try {
      const generatedUrl = await generateImage(prompt);
      setImageUrl(generatedUrl);
      
      // Add bot success message
      const botSuccessMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: "Here is the image you requested. What should we create next?",
      };
      setMessages(prev => [...prev, botSuccessMessage]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);

      // Add bot error message
      const botErrorMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: `Sorry, I couldn't create that image. Error: ${errorMessage}`,
      };
      setMessages(prev => [...prev, botErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-screen w-screen flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-1/3 lg:w-1/4 h-1/2 md:h-full flex-shrink-0">
        <ChatPanel messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
      <div className="w-full md:w-2/3 lg:w-3/4 h-1/2 md:h-full flex-grow">
        <ImagePanel imageUrl={imageUrl} isLoading={isLoading} error={error} />
      </div>
    </main>
  );
};

export default App;
