import { Button, Text } from "react-native-paper";
import { Link } from "expo-router";
import AppScreen from "../components/AppScreen";

export default function NotFoundScreen() {
  return (
    <AppScreen
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Text variant="headlineSmall">Oops! This page does not exist.</Text>
      <Link href="/" asChild>
        <Button mode="contained">Go back to Home screen!</Button>
      </Link>
    </AppScreen>
  );
}
