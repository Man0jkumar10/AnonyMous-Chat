import { Button } from "@/components/ui/button";

interface DisconnectedScreenProps {
  onFindNewPartner: () => void;
  onBackToHome: () => void;
}

export function DisconnectedScreen({ onFindNewPartner, onBackToHome }: DisconnectedScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-user-times text-error text-2xl"></i>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-secondary mb-4">Partner Disconnected</h2>
        <p className="text-gray-600 mb-8">
          Your chat partner has left the conversation. Would you like to find someone new to chat with?
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={onFindNewPartner}
            className="bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <i className="fas fa-search"></i>
            <span>Find New Partner</span>
          </Button>
          
          <Button
            onClick={onBackToHome}
            variant="secondary"
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <i className="fas fa-home"></i>
            <span>Back to Home</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
