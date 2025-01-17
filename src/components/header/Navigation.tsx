import { Link } from "react-router-dom";

interface NavigationProps {
  onScrollToSection: (sectionId: string) => void;
  onCommunityClick: () => void;
}

export const Navigation = ({ onScrollToSection, onCommunityClick }: NavigationProps) => {
  return (
    <nav className="flex items-center space-x-8">
      <div className="group relative">
        <button 
          onClick={() => onScrollToSection('features')} 
          className="text-gray-300 hover:text-white transition-colors font-mono text-sm py-2"
        >
          Features
          <div className="absolute inset-x-0 h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform" />
        </button>
      </div>

      <div className="group relative">
        <button 
          onClick={() => onScrollToSection('pricing')} 
          className="text-gray-300 hover:text-white transition-colors font-mono text-sm py-2"
        >
          Pricing
          <div className="absolute inset-x-0 h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform" />
        </button>
      </div>

      <div className="group relative">
        <Link 
          to="/dashboard" 
          className="text-gray-300 hover:text-white transition-colors font-mono text-sm py-2"
        >
          Dashboard
          <div className="absolute inset-x-0 h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform" />
        </Link>
      </div>

      <div className="group relative">
        <button
          onClick={onCommunityClick}
          className="text-gray-300 hover:text-white transition-colors font-mono text-sm py-2"
        >
          Community
          <div className="absolute inset-x-0 h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform" />
        </button>
      </div>
    </nav>
  );
};