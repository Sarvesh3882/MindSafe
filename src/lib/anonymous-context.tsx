"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

interface AnonymousContextType {
  isAnonymous: boolean;
  setAnonymous: (value: boolean) => void;
  clearAnonymous: () => void;
}

const AnonymousContext = createContext<AnonymousContextType>({
  isAnonymous: false,
  setAnonymous: () => {},
  clearAnonymous: () => {},
});

const STORAGE_KEY = "mindsafe_anonymous_mode";

export function AnonymousProvider({ children }: { children: ReactNode }) {
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    async function init() {
      // Check sessionStorage first for immediate hydration
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored === "true") setIsAnonymous(true);

      // Then verify against real auth — if real user exists, clear anonymous mode
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          sessionStorage.removeItem(STORAGE_KEY);
          setIsAnonymous(false);
        }
      } catch {
        // If auth check fails, keep whatever was in sessionStorage
      }
    }

    init();
  }, []);

  function setAnonymous(value: boolean) {
    setIsAnonymous(value);
    if (value) {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  function clearAnonymous() {
    setIsAnonymous(false);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AnonymousContext.Provider value={{ isAnonymous, setAnonymous, clearAnonymous }}>
      {children}
    </AnonymousContext.Provider>
  );
}

export function useAnonymous() {
  return useContext(AnonymousContext);
}
