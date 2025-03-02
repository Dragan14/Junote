import { Button, Text } from "react-native-paper";
import { Link } from "expo-router";
import AppScreen from "../../components/AppScreen";
import Account from "../../components/Account";
import { ScrollView } from "react-native";

export default function Index() {
  return (
    <AppScreen
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <ScrollView>
        <Text>Edit app/index.tsx to edit this screen.</Text>
        <Link href="/+not-found" asChild>
          <Button mode="contained">Go to Not Found Screen</Button>
        </Link>
        <Account />
      </ScrollView>
    </AppScreen>
  );
}
