import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { Button, TextInput } from "react-native-paper";
import AppScreen from "./AppScreen";
import { useAuthStore } from "../stores/useAuthStore";

export default function Account() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Use the auth store instead of passing session as prop
  const user = useAuthStore((state) => state.user);
  const session = useAuthStore((state) => state.session);
  const signOut = useAuthStore((state) => state.signOut);

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string;
    website: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!user) throw new Error("No user on the session!");

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppScreen>
      <TextInput
        label="Email"
        value={user?.email || ""}
        disabled
        mode="outlined"
      />
      <TextInput
        label="Username"
        value={username || ""}
        onChangeText={(text) => setUsername(text)}
        mode="outlined"
      />
      <TextInput
        label="Website"
        value={website || ""}
        onChangeText={(text) => setWebsite(text)}
        mode="outlined"
      />

      <Button
        mode="contained"
        onPress={() =>
          updateProfile({ username, website, avatar_url: avatarUrl })
        }
        disabled={loading}
      >
        {loading ? "Loading..." : "Update"}
      </Button>

      <Button mode="outlined" onPress={() => signOut()}>
        Sign Out
      </Button>
    </AppScreen>
  );
}
