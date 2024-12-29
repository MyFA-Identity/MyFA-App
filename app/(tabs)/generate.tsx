import { View } from "react-native";
import { Text, Surface } from "react-native-paper";

export default function GenerateContact() {
  return (
    <Surface style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text variant="headlineMedium">Generate Contact</Text>
        <Text variant="bodyMedium">Create a new contact QR code</Text>
      </View>
    </Surface>
  );
}
