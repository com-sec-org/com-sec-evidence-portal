import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type AdminUser = {
  id: string;
  email: string;
  role: "admin";
  lastLogin: string | null;
};

export function useAdminUser() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAdminUser() {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      const authUser = session.user;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authUser.id)
        .single();

      if (!profile || profile.role !== "admin") {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      if (mounted) {
        setUser({
          id: authUser.id,
          email: authUser.email ?? "",
          role: "admin",
          lastLogin: authUser.last_sign_in_at ?? null,
        });
        setLoading(false);
      }
    }

    loadAdminUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadAdminUser();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
