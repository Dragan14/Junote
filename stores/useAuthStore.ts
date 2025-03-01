import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { User, Session } from "@supabase/supabase-js";
import { Alert } from "react-native";

type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setSession: () => Promise<void>;
  setUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,

  signInWithEmail: async (email: string, password: string) => {
    try {
      set({ isLoading: true });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({ user: data.user, session: data.session });
    } catch (error: any) {
      Alert.alert("Sign In Error", error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  signUpWithEmail: async (email: string, password: string) => {
    try {
      set({ isLoading: true });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (!data.session) {
        Alert.alert(
          "Verification Required",
          "Please check your inbox for email verification!",
        );
      } else {
        set({ user: data.user, session: data.session });
      }
    } catch (error: any) {
      Alert.alert("Sign Up Error", error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({ user: null, session: null });
    } catch (error: any) {
      Alert.alert("Sign Out Error", error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  setSession: async () => {
    try {
      set({ isLoading: true });

      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      set({ session: data.session });
    } catch (error: any) {
      Alert.alert("Session Error", error.message);
      set({ user: null, session: null });
    } finally {
      set({ isLoading: false });
    }
  },

  setUser: async () => {
    try {
      set({ isLoading: true });

      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      set({ user: data.user });
    } catch (error: any) {
      Alert.alert("User Error", error.message);
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
