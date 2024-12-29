import { Tabs } from "expo-router";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { useColorScheme } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <PaperProvider theme={MD3LightTheme}>
      <Tabs screenOptions={{
        headerShown: false,
      }}>
        <Tabs.Screen
          name="index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="(tabs)/generate"
          options={{
            title: "Generate",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="qrcode-plus" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/scan"
          options={{
            title: "Scan",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="qrcode-scan" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/contacts"
          options={{
            title: "Contacts",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="contacts" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}
