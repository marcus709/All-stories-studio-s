import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, MenuItem, HoveredLink } from "@/components/ui/navbar-menu";

interface NavigationProps {
  onScrollToSection: (sectionId: string) => void;
  onCommunityClick: () => void;
}

export const Navigation = ({ onScrollToSection, onCommunityClick }: NavigationProps) => {
  const [active, setActive] = useState<string | null>(null);

  return (
    <Menu setActive={setActive}>
      <MenuItem setActive={setActive} active={active} item="Features">
        <div className="flex flex-col space-y-4 text-sm">
          <HoveredLink onClick={() => onScrollToSection('features')}>
            Story Development
          </HoveredLink>
          <HoveredLink onClick={() => onScrollToSection('features')}>
            Character Creation
          </HoveredLink>
          <HoveredLink onClick={() => onScrollToSection('features')}>
            AI Assistance
          </HoveredLink>
        </div>
      </MenuItem>
      <MenuItem setActive={setActive} active={active} item="Pricing">
        <div className="flex flex-col space-y-4 text-sm">
          <HoveredLink onClick={() => onScrollToSection('pricing')}>
            Free Plan
          </HoveredLink>
          <HoveredLink onClick={() => onScrollToSection('pricing')}>
            Professional
          </HoveredLink>
          <HoveredLink onClick={() => onScrollToSection('pricing')}>
            Enterprise
          </HoveredLink>
        </div>
      </MenuItem>
      <MenuItem setActive={setActive} active={active} item="Dashboard">
        <div className="flex flex-col space-y-4 text-sm">
          <HoveredLink to="/dashboard">Overview</HoveredLink>
          <HoveredLink to="/dashboard/stories">My Stories</HoveredLink>
          <HoveredLink to="/dashboard/characters">Characters</HoveredLink>
        </div>
      </MenuItem>
      <MenuItem setActive={setActive} active={active} item="Community">
        <div className="flex flex-col space-y-4 text-sm">
          <HoveredLink onClick={onCommunityClick}>Writers Hub</HoveredLink>
          <HoveredLink onClick={onCommunityClick}>Story Sharing</HoveredLink>
          <HoveredLink onClick={onCommunityClick}>Collaborations</HoveredLink>
        </div>
      </MenuItem>
    </Menu>
  );
};