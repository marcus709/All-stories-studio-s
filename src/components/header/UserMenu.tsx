import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Session } from "@supabase/supabase-js";

interface UserMenuProps {
  session: Session | null;
  profile: {
    id: string;
    username: string | null;
    avatar_url: string | null;
  } | null;
  onSignOut: () => Promise<void>;
  onShowAuth: (view: "signin" | "signup") => void;
}

export const UserMenu = ({ session, profile, onSignOut, onShowAuth }: UserMenuProps) => {
  if (!session) {
    return (
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost"
          onClick={() => onShowAuth("signin")}
        >
          Sign In
        </Button>
        <Button 
          className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
          onClick={() => onShowAuth("signup")}
        >
          Sign Up
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.username || undefined} />
            <AvatarFallback>
              {profile?.username?.[0]?.toUpperCase() || 
               session.user.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">
            {profile?.username || "Marcus"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.username || "Marcus"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/settings">
          <DropdownMenuItem className="cursor-pointer">
            Profile Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem 
          onClick={onSignOut}
          className="text-red-500 hover:text-red-600 cursor-pointer"
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};