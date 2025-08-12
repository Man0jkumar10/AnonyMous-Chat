import { Button } from "@/components/ui/button";

interface MatchingScreenProps {
  onCancel: () => void;
}

export function MatchingScreen({ onCancel }: MatchingScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        </div>
        
        <h2 className="text-xl font-semibold text-secondary mb-4">Finding a chat partner...</h2>
        <p className="text-gray-600 mb-8">
          Please wait while we connect you with someone interesting to talk to.
        </p>
        
        <Button
          onClick={onCancel}
          variant="secondary"
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
        >
          <i className="fas fa-times mr-2"></i>
          Cancel
        </Button>
        
        <div className="mt-8 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
}
