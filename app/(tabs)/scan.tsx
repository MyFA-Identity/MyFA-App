import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Button } from 'react-native-paper';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useContactStore } from '../../store/contactStore';
import * as Haptics from 'expo-haptics';

interface ContactPayload {
  name: string;
  securePhrase: string;
}

export default function ScanContact() {
  const [permission, requestPermission] = useCameraPermissions();
  const theme = useTheme();
  const addContact = useContactStore((state) => state.addContact);

  const handleBarcodeScanned = async ({ data }: { type: string; data: string }) => {
    try {
      const parsed = JSON.parse(data) as ContactPayload;
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addContact({
        name: parsed.name,
        securePhrase: parsed.securePhrase,
      });
    } catch (error) {
      console.warn('Failed to parse QR code', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <Button mode="contained" onPress={requestPermission}>
          Grant Permission
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <View style={styles.overlay}>
          <Text style={styles.text}>Scan a QR Code</Text>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 