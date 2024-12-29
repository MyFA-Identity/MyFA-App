import { View, ScrollView, Pressable } from "react-native";
import { Text, Surface, useTheme } from "react-native-paper";
import { useContactStore } from "../../store/contactStore";

export default function ContactsList() {
  const theme = useTheme();
  const contacts = useContactStore((state) => state.contacts);

  const getTimeAgo = (date: Date) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    return `Added ${diff} days ago`;
  };

  return (
    <Surface style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Pressable
            style={{
              width: 38,
              height: 38,
              backgroundColor: theme.colors.primary,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              // TODO: Implement add contact modal
              useContactStore.getState().addContact({
                name: "Test Contact",
                securePhrase: "🔒🎮🎨", // Example secure phrase
              });
            }}
          >
            <Text style={{ fontSize: 24, color: theme.colors.onPrimary }}>+</Text>
          </Pressable>
        </View>
      </View>
      <ScrollView style={{ paddingHorizontal: 16 }}>
        <View style={{ gap: 12, paddingBottom: 16 }}>
          {contacts.map((contact) => (
            <Pressable 
              key={contact.id}
              onPress={() => {
                // TODO: Implement contact detail view
              }}
            >
              <Surface
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  backgroundColor: theme.colors.surfaceVariant,
                }}
              >
                <View style={{ padding: 16 }}>
                  <Text 
                    style={{ 
                      color: theme.colors.onSurface, 
                      fontSize: 24, 
                      fontWeight: '600', 
                      marginBottom: 4 
                    }}
                  >
                    {contact.name}
                  </Text>
                  <Text style={{ fontSize: 48, marginBottom: 8 }}>
                    {contact.securePhrase}
                  </Text>
                  <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
                    {getTimeAgo(contact.addedDate)}
                  </Text>
                </View>
              </Surface>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </Surface>
  );
}
