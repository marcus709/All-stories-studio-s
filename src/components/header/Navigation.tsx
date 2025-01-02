import { Link } from "react-router-dom";

interface NavigationProps {
  onScrollToSection: (sectionId: string) => void;
  onCommunityClick: () => void;
}

export const Navigation = ({ onScrollToSection, onCommunityClick }: NavigationProps) => {
  return (
    <nav className="hidden md:flex items-center space-x-8">
      <button 
        onClick={() => onScrollToSection('features')} 
        className="text-gray-600 hover:text-gray-900"
      >
        Features
      </button>
      <button 
        onClick={() => onScrollToSection('pricing')} 
        className="text-gray-600 hover:text-gray-900"
      >
        Pricing
      </button>
      <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
        Dashboard
      </Link>
      <button
        onClick={onCommunityClick}
        className="text-gray-600 hover:text-gray-900"
      >
        Community
      </button>
    </nav>
  );
};