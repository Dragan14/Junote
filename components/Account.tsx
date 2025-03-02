import { useEffect, useState, useCallback } from "react";
import { Button, TextInput, HelperText } from "react-native-paper";
import AppScreen from "./AppScreen";
import { useAuthStore } from "../stores/useAuthStore";
import { useProfileStore } from "../stores/useProfileStore";
import { usernameSchema } from "../schemas/validationSchemas";
import { z } from "zod";

export default function Account() {
  const {
    user,
    session,
    isLoading: isAuthLoading,
  } = useAuthStore((state) => ({
    user: state.user,
    session: state.session,
    isLoading: state.isLoading,
  }));
  const signOut = useAuthStore.getState().signOut;
  const getUser = useAuthStore.getState().getUser;

  const { profile, isLoading: isProfileLoading } = useProfileStore((state) => ({
    profile: state.profile,
    isLoading: state.isLoading,
  }));
  const getProfile = useProfileStore.getState().getProfile;
  const updateProfile = useProfileStore.getState().updateProfile;
  const clearProfile = useProfileStore.getState().clearProfile;

  // Form state
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  useEffect(() => {
    if (session) {
      getProfile();
      getUser();
    }
  }, [session, getProfile, getUser]);

  useEffect(() => {
    if (profile?.username) {
      setUsername(profile.username);
    }
  }, [profile]);

  // Validate username
  const validateUsername = useCallback(() => {
    try {
      usernameSchema.parse(username);
      setUsernameError("");
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setUsernameError(error.errors[0].message);
      }
      return false;
    }
  }, [username]);

  // Update profile handler
  const handleUpdateProfile = useCallback(async () => {
    if (!validateUsername()) {
      return;
    }
    await updateProfile({
      username: username.trim(),
    });
  }, [username, validateUsername, updateProfile]);

  const handleSignOut = useCallback(() => {
    clearProfile();
    signOut();
  }, [signOut, clearProfile]);

  return (
    <AppScreen>
      <TextInput
        label="Email"
        value={user?.email || ""}
        mode="outlined"
        disabled={true}
        left={<TextInput.Icon icon="email" />}
      />
      <TextInput
        label="Username"
        value={username}
        mode="outlined"
        onBlur={validateUsername}
        onChangeText={setUsername}
        disabled={isProfileLoading}
        left={<TextInput.Icon icon="account" />}
        error={!!usernameError}
      />
      {usernameError ? (
        <HelperText type="error" visible={!!usernameError}>
          {usernameError}
        </HelperText>
      ) : null}

      <Button
        mode="contained"
        onPress={handleUpdateProfile}
        disabled={isProfileLoading || username === profile?.username}
      >
        {isProfileLoading ? "Updating..." : "Update Profile"}
      </Button>

      <Button mode="outlined" onPress={handleSignOut} disabled={isAuthLoading}>
        Sign Out
      </Button>
    </AppScreen>
  );
}
