import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "./useAuthStore";
import { Alert } from "react-native";

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  updated_at: string | null;
}

type ProfileState = {
  profile: Profile | null;
  isLoading: boolean;

  // Get the user profile from Supabase
  setProfile: () => Promise<void>;

  // Update the user profile
  updateProfile: (updates: Partial<Profile>) => Promise<void>;

  // Clear profile data (used during sign out)
  clearProfile: () => void;
};

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,

  setProfile: async () => {
    try {
      const session = useAuthStore.getState().session;

      set({ isLoading: true });

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user.id)
        .single();

      if (error) throw error;

      set({ profile: data as Profile });
    } catch (error: any) {
      Alert.alert("Profile Error", error.message);
      set({ profile: null });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    try {
      const session = useAuthStore.getState().session;

      set({ isLoading: true });

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", session?.user.id);

      if (error) throw error;

      Alert.alert("Profile Updated");

      // Refresh the profile after updating
      await get().setProfile();
    } catch (error: any) {
      Alert.alert("Update Failed", error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  clearProfile: () => {
    try {
      set({ profile: null });
    } catch (error: any) {
      Alert.alert("Failed to clear profile data", error.message);
    }
  },
}));
