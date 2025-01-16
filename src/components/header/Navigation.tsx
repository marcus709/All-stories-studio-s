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
        className="text-white hover:text-gray-200"
      >
        Features
      </button>
      <button 
        onClick={() => onScrollToSection('pricing')} 
        className="text-white hover:text-gray-200"
      >
        Pricing
      </button>
      <Link to="/dashboard" className="text-white hover:text-gray-200">
        Dashboard
      </Link>
      <button
        onClick={onCommunityClick}
        className="text-white hover:text-gray-200"
      >
        Community
      </button>
    </nav>
  );
};