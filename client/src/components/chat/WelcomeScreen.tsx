import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onStartChat: () => void;
  onlineUsers: number;
}

export function WelcomeScreen({ onStartChat, onlineUsers }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-user-friends text-primary text-3xl"></i>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-secondary mb-4">Ready to Chat?</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Connect with a random stranger for an anonymous conversation. 
          No registration required - just click start and begin chatting!
        </p>
        
        <Button
          onClick={onStartChat}
          size="lg"
          className="bg-primary hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center space-x-3 mx-auto"
        >
          <i className="fas fa-play text-lg"></i>
          <span className="text-lg">Start Chatting</span>
        </Button>
        
        <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <i className="fas fa-shield-alt text-success"></i>
            <span>Anonymous</span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="fas fa-bolt text-warning"></i>
            <span>Real-time</span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="fas fa-trash-alt text-error"></i>
            <span>No logs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
