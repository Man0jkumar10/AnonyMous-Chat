import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ChatMessage } from "@/hooks/useWebSocket";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isPartnerTyping: boolean;
  onSendMessage: (message: string) => void;
  onLeaveChat: () => void;
  onNextPartner: () => void;
  onStartTyping: () => void;
  onStopTyping: () => void;
}

export function ChatInterface({
  messages,
  isPartnerTyping,
  onSendMessage,
  onLeaveChat,
  onNextPartner,
  onStartTyping,
  onStopTyping
}: ChatInterfaceProps) {
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPartnerTyping]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText("");
      handleStopTyping();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    handleStartTyping();
  };

  const handleStartTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      onStartTyping();
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      onStopTyping();
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="bg-surface border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-success to-green-500 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-white text-sm"></i>
            </div>
            <div>
              <h3 className="font-semibold text-secondary">Connected to Stranger</h3>
              <div className="flex items-center space-x-2 text-sm text-success">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={onNextPartner}
              className="bg-warning hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2"
              title="Find new partner"
            >
              <i className="fas fa-forward text-sm"></i>
              <span>Next</span>
            </Button>
            
            <Button
              onClick={onLeaveChat}
              variant="destructive"
              className="bg-error hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <i className="fas fa-sign-out-alt text-sm"></i>
              <span>Leave</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 message-animation ${
              message.isSent ? 'justify-end' : ''
            }`}
          >
            {!message.isSent && (
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-user text-white text-xs"></i>
              </div>
            )}
            
            <div className="max-w-xs lg:max-w-md">
              <div
                className={`px-4 py-3 rounded-2xl shadow-sm ${
                  message.isSent
                    ? 'chat-bubble-sent text-white rounded-tr-none'
                    : 'chat-bubble-received text-secondary rounded-tl-none'
                }`}
              >
                <p>{message.content}</p>
              </div>
              <p
                className={`text-xs text-gray-500 mt-1 px-2 ${
                  message.isSent ? 'text-right' : ''
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>

            {message.isSent && (
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-user text-white text-xs"></i>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isPartnerTyping && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-user text-white text-xs"></i>
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-surface border-t border-gray-200 px-4 py-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              type="text"
              value={messageText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 pr-16"
              maxLength={500}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-xs text-gray-400">{messageText.length}/500</span>
            </div>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="bg-primary hover:bg-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-paper-plane text-lg"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}
