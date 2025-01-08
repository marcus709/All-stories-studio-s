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
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { capitalize } from "lodash";
import { Crown } from "lucide-react";

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
  const { plan } = useSubscription();

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'professional':
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      case 'creator':
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
          onClick={() => onShowAuth("signup")}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
        >
          Sign Up
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {plan !== 'free' && (
        <Badge 
          variant="secondary" 
          className={`capitalize flex items-center gap-1 ${getPlanColor(plan)}`}
        >
          <Crown className="h-3 w-3" />
          {plan} Plan
        </Badge>
      )}
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
              {profile?.username || session.user.email?.split('@')[0]}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {profile?.username || session.user.email?.split('@')[0]}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
              {plan !== 'free' && (
                <p className={`text-xs font-medium mt-1 ${
                  plan === 'professional' ? 'text-purple-600' : 'text-blue-600'
                }`}>
                  {capitalize(plan)} Plan
                </p>
              )}
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
    </div>
  );
};