import { useState } from "react";
import { Menu, MenuItem } from "@/components/ui/navbar-menu";
import { useNavigate, useLocation } from "react-router-dom";

interface NavigationProps {
  onScrollToSection: (sectionId: string) => void;
  onCommunityClick: () => void;
}

export const Navigation = ({ onScrollToSection, onCommunityClick }: NavigationProps) => {
  const [active, setActive] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we're on the landing page
  const isLandingPage = location.pathname === '/';
  const textColorClass = isLandingPage ? 'text-white' : 'text-black';

  return (
    <Menu setActive={setActive}>
      <div 
        className={`cursor-pointer ${textColorClass} hover:opacity-[0.9]`}
        onClick={() => navigate('/dashboard')}
      >
        Dashboard
      </div>
      <div 
        className={`cursor-pointer ${textColorClass} hover:opacity-[0.9]`}
        onClick={onCommunityClick}
      >
        Community
      </div>
    </Menu>
  );
};

export const HoveredLink = ({ children, onClick, ...rest }: any) => {
  return (
    <div
      onClick={onClick}
      className="text-neutral-700 hover:text-black cursor-pointer"
      {...rest}
    >
      {children}
    </div>
  );
};