import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { generateContent } from '../../services/GeminiService';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: string;
}

const AiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm Mr Ombak 🌊. How can I help with your adventure planning today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      text: inputText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Get response from Gemini API
      const response = await generateContent(inputText);
      
      // Add AI response
      const aiMessage: Message = {
        text: response,
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      const errorMessage: Message = {
        text: "Sorry, I couldn't process your request. Please try again later.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isExpanded) {
    return (
      <div className="flex items-center justify-center" style={{ zIndex: 9999 }}>
        <Button
          className="p-button-rounded p-button-secondary bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg"
          style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setIsExpanded(true)}
          tooltip="I'm Mr Ombak 🌊"
          tooltipOptions={{ position: 'left' }}
        >
          <i className="pi pi-comments text-3xl text-white" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-80 shadow-lg" style={{ maxHeight: '600px', zIndex: 9999 }}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-3 sticky top-0 bg-white z-10 pb-2 pt-3 border-b border-gray-100">
          <h3 className="text-lg font-medium">I'm Mr Ombak 🌊</h3>
          <Button
            icon="pi pi-times"
            className="p-button-rounded bg-indigo-500 text-white hover:bg-indigo-600"
            style={{ width: '30px', height: '30px', padding: 0 }}
            onClick={() => setIsExpanded(false)}
            aria-label="Close"
          />
        </div>
        
        <div 
          className="bg-gray-50 p-3 rounded-lg mb-3 overflow-y-auto"
          style={{ 
            height: '400px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#9ca3af #f3f4f6',
            overflowY: 'scroll',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="flex flex-col">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-3 flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`p-3 rounded-lg max-w-[80%] shadow-sm ${
                    message.isUser 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                  <span className="text-xs opacity-70 block text-right mt-1">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-center my-3">
                <ProgressSpinner style={{ width: '30px', height: '30px' }} />
              </div>
            )}
            
            {/* Empty div for scrolling to bottom */}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </div>
        
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex w-full gap-2 items-end">
            <InputTextarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={2}
              className="flex-grow"
              placeholder="Ask about adventure ideas..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              icon="pi pi-send"
              className="p-button-rounded bg-indigo-500 text-white hover:bg-indigo-600"
              style={{ width: '40px', height: '40px', minWidth: '40px', padding: 0 }}
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim()}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AiChat;
