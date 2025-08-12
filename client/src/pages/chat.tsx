import { useState, useEffect } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";
import { MatchingScreen } from "@/components/chat/MatchingScreen";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { DisconnectedScreen } from "@/components/chat/DisconnectedScreen";
import { useToast } from "@/hooks/use-toast";

export default function Chat() {
  const [onlineUsers, setOnlineUsers] = useState(1247);
  const { toast } = useToast();

  const {
    connectionStatus,
    messages,
    isPartnerTyping,
    error,
    connect,
    disconnect,
    startChat,
    leaveChat,
    findNewPartner,
    sendChatMessage,
    startTyping,
    stopTyping
  } = useWebSocket();

  // Connect to WebSocket on component mount
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Handle connection status changes
  useEffect(() => {
    switch (connectionStatus) {
      case 'matched':
        toast({
          title: "Connected!",
          description: "You've been matched with a stranger. Start chatting!"
        });
        break;
      case 'disconnected_partner':
        toast({
          title: "Partner left",
          description: "Your chat partner has disconnected."
        });
        break;
    }
  }, [connectionStatus, toast]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  // Simulate online users count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => {
        const change = Math.floor(Math.random() * 20) - 10;
        return Math.max(1000, Math.min(2000, prev + change));
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleStartChat = () => {
    startChat();
  };

  const handleCancelMatching = () => {
    leaveChat();
  };

  const handleLeaveChat = () => {
    leaveChat();
  };

  const handleFindNewPartner = () => {
    findNewPartner();
  };

  const handleBackToHome = () => {
    leaveChat();
  };

  const renderCurrentScreen = () => {
    switch (connectionStatus) {
      case 'waiting':
        return <MatchingScreen onCancel={handleCancelMatching} />;
      
      case 'matched':
        return (
          <ChatInterface
            messages={messages}
            isPartnerTyping={isPartnerTyping}
            onSendMessage={sendChatMessage}
            onLeaveChat={handleLeaveChat}
            onNextPartner={handleFindNewPartner}
            onStartTyping={startTyping}
            onStopTyping={stopTyping}
          />
        );
      
      case 'disconnected_partner':
        return (
          <DisconnectedScreen
            onFindNewPartner={handleFindNewPartner}
            onBackToHome={handleBackToHome}
          />
        );
      
      default:
        return (
          <WelcomeScreen
            onStartChat={handleStartChat}
            onlineUsers={onlineUsers}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
              <i className="fas fa-comments text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-secondary">AnonyMous Chat</h1>
              <p className="text-sm text-gray-500">Connect with random strangers</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-success/10 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-success">
              {onlineUsers.toLocaleString()} online
            </span>
          </div>
          <div>
            <a href="/about" className="hover:text-secondary">About Me</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {renderCurrentScreen()}
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>© 2025 Manojkumar B G</span>
            {/* <span>•</span> */}
            {/* <a href="#" className="hover:text-primary transition-colors duration-200">Privacy Policy</a> */}
            {/* <span>•</span> */}
            {/* <a href="#" className="hover:text-primary transition-colors duration-200">Terms of Service</a> */}
          </div>
          
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2">
              <i className="fas fa-shield-alt text-success"></i>
              <span>Messages are not stored</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fas fa-clock text-primary"></i>
              <span>Real-time communication</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
