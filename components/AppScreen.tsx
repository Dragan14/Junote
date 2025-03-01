import React, { ReactNode } from "react";
import { View, ViewStyle, StyleProp } from "react-native";
import { useTheme } from "react-native-paper";

interface AppScreenProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const AppScreen: React.FC<AppScreenProps> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        style, // Allow for style overrides
      ]}
    >
      {children}
    </View>
  );
};

export default AppScreen;
