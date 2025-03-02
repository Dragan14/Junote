import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { User, Session } from "@supabase/supabase-js";
import { Alert } from "react-native";

type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithEmail: (
    email: string,
    password: string,
  ) => Promise<{
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    error: Error | null;
  }>;
  signUpWithEmail: (
    email: string,
    password: string,
  ) => Promise<{
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    error: Error | null;
  }>;
  signOut: () => Promise<{
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    error: Error | null;
  }>;
  refreshSession: () => Promise<{
    session: Session | null;
    isLoading: boolean;
    error: Error | null;
  }>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,

  signInWithEmail: async (email: string, password: string) => {
    set({ isLoading: true });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
      set({ isLoading: false });
      return {
        user: null,
        session: null,
        isLoading: false,
        error,
      };
    } else if (data?.user && data?.session) {
      set({ user: data.user, session: data.session, isLoading: false });
      return {
        user: data.user,
        session: data.session,
        isLoading: false,
        error: null,
      };
    }

    set({ isLoading: false });
    return {
      user: null,
      session: null,
      isLoading: false,
      error: null,
    };
  },

  signUpWithEmail: async (email: string, password: string) => {
    set({ isLoading: true });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert("Sign Up Error", error.message);
      set({ isLoading: false });
      return {
        user: null,
        session: null,
        isLoading: false,
        error,
      };
    } else if (!data.session) {
      Alert.alert(
        "Verification Required",
        "Please check your inbox for email verification!",
      );
      set({ isLoading: false });
      return {
        user: data.user || null,
        session: null,
        isLoading: false,
        error: null,
      };
    } else {
      set({ user: data.user, session: data.session, isLoading: false });
      return {
        user: data.user,
        session: data.session,
        isLoading: false,
        error: null,
      };
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Sign Out Error", error.message);
      set({ isLoading: false });
      return {
        user: get().user,
        session: get().session,
        isLoading: false,
        error,
      };
    }

    set({ user: null, session: null, isLoading: false });
    return {
      user: null,
      session: null,
      isLoading: false,
      error: null,
    };
  },

  refreshSession: async () => {
    set({ isLoading: true });

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      Alert.alert("Session Error", error.message);
      set({ user: null, session: null, isLoading: false });
      return {
        session: null,
        isLoading: false,
        error,
      };
    }

    set({
      session: data?.session || null,
      isLoading: false,
    });

    return {
      session: data?.session || null,
      isLoading: false,
      error: null,
    };
  },
}));
