import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Newspaper, Users, Bookmark, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

export const CommunitySidebar = () => {
  const location = useLocation();
  
  const items = [
    {
      title: "Home",
      icon: Home,
      href: "/community",
      exact: true
    },
    {
      title: "Feed",
      icon: Newspaper,
      href: "/community/feed"
    },
    {
      title: "Groups",
      icon: Users,
      href: "/community/groups"
    },
    {
      title: "Topics",
      icon: Hash,
      href: "/community/topics"
    },
    {
      title: "Saved",
      icon: Bookmark,
      href: "/community/saved"
    }
  ];

  return (
    <ScrollArea className="h-full py-2">
      <div className="space-y-1 px-2">
        {items.map((item) => {
          const isActive = item.exact 
            ? location.pathname === item.href
            : location.pathname.startsWith(item.href);

          return (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                isActive && "bg-accent"
              )}
              asChild
            >
              <Link to={item.href}>
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
};