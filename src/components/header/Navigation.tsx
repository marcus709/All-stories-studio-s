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
        className="text-purple-200/80 hover:text-purple-100 transition-colors font-mono text-sm"
      >
        Features
      </button>
      <button 
        onClick={() => onScrollToSection('pricing')} 
        className="text-purple-200/80 hover:text-purple-100 transition-colors font-mono text-sm"
      >
        Pricing
      </button>
      <Link to="/dashboard" className="text-purple-200/80 hover:text-purple-100 transition-colors font-mono text-sm">
        Dashboard
      </Link>
      <button
        onClick={onCommunityClick}
        className="text-purple-200/80 hover:text-purple-100 transition-colors font-mono text-sm"
      >
        Community
      </button>
    </nav>
  );
};