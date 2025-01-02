import React from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface ProfileFormProps {
  profile: {
    username: string;
    bio: string;
    website: string;
  };
  onChange: (field: string, value: string) => void;
}

export function ProfileForm({ profile, onChange }: ProfileFormProps) {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input
          value={profile.username}
          onChange={(e) => onChange("username", e.target.value)}
          placeholder="Enter your name"
          className="bg-white"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Bio</label>
        <Textarea
          value={profile.bio}
          onChange={(e) => onChange("bio", e.target.value)}
          placeholder="Tell us about yourself"
          className="min-h-[100px] bg-white"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Website</label>
        <Input
          value={profile.website}
          onChange={(e) => onChange("website", e.target.value)}
          placeholder="Enter your website URL"
          className="bg-white"
        />
      </div>
    </>
  );
}