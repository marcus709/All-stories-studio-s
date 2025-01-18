import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
          className="text-purple-200 hover:text-purple-100 hover:bg-purple-900/20 font-mono"
        >
          Sign In
        </Button>
        <Button 
          onClick={() => onShowAuth("signup")}
          className="bg-purple-500 hover:bg-purple-600 text-white border-0 font-mono"
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
          <Crown className="h-3 w-3 text-white" />
          {plan} Plan
        </Badge>
      )}
      <DropdownMenu modal={true}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2 px-2 hover:bg-purple-900/20">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.username || undefined} />
              <AvatarFallback>
                {profile?.username?.[0]?.toUpperCase() || 
                 session.user.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-mono text-white">
              {profile?.username || session.user.email?.split('@')[0]}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-56 bg-white border border-gray-200" 
          align="end" 
          forceMount
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            const dropdown = target.closest('[role="menu"]');
            if (dropdown) {
              (dropdown as any)._closeDropdown?.();
            }
          }}
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-gray-900">
                {profile?.username || session.user.email?.split('@')[0]}
              </p>
              <p className="text-xs leading-none text-gray-500">
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
          <DropdownMenuSeparator className="bg-gray-100" />
          <DropdownMenuItem 
            className="cursor-pointer text-gray-700 focus:text-gray-900 focus:bg-gray-50"
            onClick={() => navigate("/profile/settings")}
          >
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={onSignOut}
            className="text-red-500 hover:text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};