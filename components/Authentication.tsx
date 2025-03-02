import { useState } from "react";
import { Button, TextInput, HelperText } from "react-native-paper";
import AppScreen from "./AppScreen";
import { emailSchema, passwordSchema } from "../schemas/validationSchemas";
import { useAuthStore } from "../stores/useAuthStore";
import { z } from "zod";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Use the auth store state and functions
  const isLoading = useAuthStore((state) => state.isLoading);
  const signInWithEmail = useAuthStore((state) => state.signInWithEmail);
  const signUpWithEmail = useAuthStore((state) => state.signUpWithEmail);

  // Validate email input
  const validateEmail = () => {
    try {
      emailSchema.parse(email);
      setEmailError("");
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message);
      }
      return false;
    }
  };

  // Validate password input
  const validatePassword = () => {
    try {
      passwordSchema.parse(password);
      setPasswordError("");
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setPasswordError(error.errors[0].message);
      }
      return false;
    }
  };

  // Validate all inputs
  const validateForm = () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    return isEmailValid && isPasswordValid;
  };

  async function handleSignIn() {
    if (!validateForm()) {
      return;
    }
    await signInWithEmail(email, password);
  }

  async function handleSignUp() {
    if (!validateForm()) {
      return;
    }
    await signUpWithEmail(email, password);
  }

  return (
    <AppScreen>
      <TextInput
        label="Email"
        left={<TextInput.Icon icon="email" />}
        onChangeText={(text) => setEmail(text)}
        onBlur={validateEmail}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
        mode="outlined"
        error={!!emailError}
      />
      {emailError ? <HelperText type="error">{emailError}</HelperText> : null}

      <TextInput
        label="Password"
        left={<TextInput.Icon icon="lock" />}
        onChangeText={(text) => setPassword(text)}
        onBlur={validatePassword}
        value={password}
        secureTextEntry={true}
        placeholder="Password"
        autoCapitalize="none"
        mode="outlined"
        error={!!passwordError}
      />
      {passwordError ? (
        <HelperText type="error">{passwordError}</HelperText>
      ) : null}

      <Button
        mode="contained"
        disabled={isLoading}
        onPress={() => handleSignIn()}
        loading={isLoading}
        style={{ marginTop: 16 }}
      >
        Sign in
      </Button>
      <Button
        mode="contained"
        disabled={isLoading}
        onPress={() => handleSignUp()}
        loading={isLoading}
        style={{ marginTop: 8 }}
      >
        Sign up
      </Button>
    </AppScreen>
  );
}
