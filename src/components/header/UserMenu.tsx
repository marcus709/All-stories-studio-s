import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "../ui/dropdown-menu";
import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import { Profile } from "@/integrations/supabase/types/tables.types";

interface UserMenuProps {
  session: any;
  profile: Profile | null;
  onSignOut: () => void;
  onShowAuth: (view: "signin" | "signup") => void;
}

export const UserMenu = ({ session, profile, onSignOut, onShowAuth }: UserMenuProps) => {
  return (
    <div className="flex items-center space-x-4">
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || ''} alt={profile?.username || ''} />
                <AvatarFallback className="bg-purple-500 text-white">
                  {profile?.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-slate-900 border border-slate-800" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-white">{profile?.username}</p>
                <p className="text-xs leading-none text-gray-400">{session.user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-gray-300 hover:text-white focus:bg-slate-800">
                <Link to="/dashboard" className="flex items-center">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:text-white focus:bg-slate-800">
                <Link to="/profile/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem 
              className="text-gray-300 hover:text-white focus:bg-slate-800"
              onClick={onSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="text-gray-300 hover:text-white"
            onClick={() => onShowAuth("signin")}
          >
            Sign In
          </Button>
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => onShowAuth("signup")}
          >
            Sign Up
          </Button>
        </div>
      )}
    </div>
  );
};
