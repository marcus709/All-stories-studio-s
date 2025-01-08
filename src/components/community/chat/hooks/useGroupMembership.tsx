import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

export const useGroupMembership = (groupId: string) => {
  const session = useSession();
  const [isMember, setIsMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMembership = async () => {
      try {
        if (!session?.user?.id) {
          setIsMember(false);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("group_members")
          .select()
          .eq("group_id", groupId)
          .eq("user_id", session.user.id)
          .single();

        if (error) {
          console.error("Error checking membership:", error);
          setIsMember(false);
        } else {
          setIsMember(!!data);
        }
      } catch (error) {
        console.error("Error checking membership:", error);
        setIsMember(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMembership();
  }, [groupId, session?.user?.id]);

  return { isMember, isLoading };
};