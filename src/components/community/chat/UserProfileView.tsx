
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface UserProfileViewProps {
  user: any;
  onClose: () => void;
}

export const UserProfileView = ({ user, onClose }: UserProfileViewProps) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      <div className="h-14 flex items-center px-4 border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2"
          onClick={onClose}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold">Profile Details</h2>
      </div>
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex flex-col items-center mb-8">
          {user.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt={user.username || 'User'} 
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3">
              <span className="text-gray-500 text-2xl font-bold">
                {user.username?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
          
          <h1 className="text-2xl font-bold">{user.username || 'Anonymous User'}</h1>
          {user.title && <p className="text-gray-600 mt-1">{user.title}</p>}
        </div>
        
        {user.bio && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Bio</h3>
            <p className="text-gray-700">{user.bio}</p>
          </div>
        )}
        
        {user.location && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Location</h3>
            <p className="text-gray-700">{user.location}</p>
          </div>
        )}
        
        {user.genres && user.genres.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {user.genres.map((genre: string, index: number) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {user.skills && user.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill: string, index: number) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
