import { Link } from "react-router-dom";

interface NavigationProps {
  onScrollToSection: (sectionId: string) => void;
  onCommunityClick: () => void;
}

export const Navigation = ({ onScrollToSection, onCommunityClick }: NavigationProps) => {
  return (
    <nav className="flex items-center space-x-6">
      <button 
        onClick={() => onScrollToSection('features')} 
        className="text-gray-300 hover:text-white transition-colors"
      >
        Features
      </button>
      <button 
        onClick={() => onScrollToSection('pricing')} 
        className="text-gray-300 hover:text-white transition-colors"
      >
        Pricing
      </button>
      <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
        Dashboard
      </Link>
      <button
        onClick={onCommunityClick}
        className="text-gray-300 hover:text-white transition-colors"
      >
        Community
      </button>
    </nav>
  );
};