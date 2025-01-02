import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Lock, Mail, BookOpen, Wand2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AuthModalsProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: "signin" | "signup";
}

export const AuthModals = ({ isOpen, onClose, defaultView = "signin" }: AuthModalsProps) => {
  const [view, setView] = useState(defaultView);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast({
        title: "Success",
        description: "You have successfully signed in!",
      });
      onClose();
    } catch (error: any) {
      let message = "An error occurred during sign in";
      if (error.message) {
        message = error.message;
      }
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      if (error) {
        // Handle specific error cases
        if (error.message.includes("user_already_exists")) {
          throw new Error("This email is already registered. Please sign in instead.");
        }
        throw error;
      }
      toast({
        title: "Success",
        description: "Please check your email to verify your account!",
      });
      onClose();
    } catch (error: any) {
      let message = "An error occurred during sign up";
      if (error.message) {
        message = error.message;
      }
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
  };

  const switchView = (newView: "signin" | "signup") => {
    setView(newView);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side - Purple gradient background */}
          <div className="hidden md:block bg-gradient-to-br from-purple-600 to-pink-500 p-8 text-white">
            <div className="mb-8">
              <BookOpen className="w-12 h-12 text-white" />
              <DialogTitle className="text-2xl font-bold mt-4 text-white">
                All Stories Studio
              </DialogTitle>
              <p className="mt-2 text-white/80">
                Unleash your creativity with AI-powered storytelling
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <Wand2 className="w-6 h-6 mt-1" />
                <div>
                  <h3 className="font-semibold">AI Story Enhancement</h3>
                  <p className="text-sm text-white/80">
                    Transform your stories with magical AI suggestions
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Users className="w-6 h-6 mt-1" />
                <div>
                  <h3 className="font-semibold">Character Development</h3>
                  <p className="text-sm text-white/80">
                    Create deep, memorable characters effortlessly
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Auth forms */}
          <div className="p-8">
            {view === "signin" ? (
              <div>
                <DialogTitle className="text-2xl font-bold">Welcome Back!</DialogTitle>
                <p className="text-gray-500 mt-2">
                  Sign in to continue your creative journey
                </p>

                <form onSubmit={handleSignIn} className="mt-8 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-500">
                  Don't have an account?{" "}
                  <button
                    onClick={() => switchView("signup")}
                    className="text-purple-600 hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            ) : (
              <div>
                <DialogTitle className="text-2xl font-bold">Create Your Account</DialogTitle>
                <p className="text-gray-500 mt-2">
                  Join our community of storytellers
                </p>

                <form onSubmit={handleSignUp} className="mt-8 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Your name"
                        className="pl-10"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-500">
                  Already have an account?{" "}
                  <button
                    onClick={() => switchView("signin")}
                    className="text-purple-600 hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};