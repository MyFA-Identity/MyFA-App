import { useEffect, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { generateSecret, generateTotp, generatePassphrase } from '../../services/totp';
import { useTotpStore } from '../../store/totpStore';

export default function GenerateTotpScreen() {
  const [secret, setSecret] = useState<string>('');
  const [code, setCode] = useState<string>('------');
  const config = useTotpStore((state) => state.config);
  const [remaining, setRemaining] = useState<number>(config.timeStep);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadOrCreateSecret = async () => {
      try {
        // Try to load existing secret from SecureStore
        const storedSecret = await SecureStore.getItemAsync('totpSecret');
        if (storedSecret) {
          setSecret(storedSecret);
        } else {
          // Otherwise, generate a new secret
          const newSecret = await generateSecret();
          setSecret(newSecret);
          await SecureStore.setItemAsync('totpSecret', newSecret);
        }
      } catch (err) {
        console.warn('Error loading or creating secret:', err);
      }
    };

    loadOrCreateSecret();
  }, []);

  useEffect(() => {
    if (!secret) return;

    const handleTick = async () => {
      // Generate TOTP code
      const newCode = await generateTotp(secret);
      setCode(newCode);

      // Calculate how many seconds remain in the current 30s window
      const nowInSeconds = Math.floor(Date.now() / 1000);
      const remainder = config.timeStep - (nowInSeconds % config.timeStep);
      setRemaining(remainder);
    };

    // Initial TOTP code
    handleTick();

    // Update based on timeStep
    intervalRef.current = setInterval(handleTick, 1000);

    // Cleanup previous interval when timeStep changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [secret, config.timeStep]);

  const regenerateSecret = async () => {
    try {
      const newSecret = await generateSecret();
      setSecret(newSecret);
      await SecureStore.setItemAsync('totpSecret', newSecret);
    } catch (err) {
      console.warn('Error regenerating secret:', err);
    }
  };

  const nextUpdateTime = new Date(Math.ceil(Date.now() / (config.timeStep * 1000)) * (config.timeStep * 1000));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My TOTP Auth</Text>
      
      <Text style={styles.label}>Secret:</Text>
      <Text style={styles.value}>{secret}</Text>

      <Text style={styles.label}>Current TOTP Code:</Text>
      <Text style={styles.code}>{code}</Text>

      <Text style={styles.passphrase}>{generatePassphrase(code)}</Text>

      <Text style={styles.countdown}>
        Expires in {remaining} second{remaining !== 1 ? 's' : ''} – 
        Next update at {nextUpdateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>

      <Button title="Regenerate Secret" onPress={regenerateSecret} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: '600',
  },
  label: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  code: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
  },
  passphrase: {
    fontSize: 18,
    color: '#444',
    marginTop: 8,
    marginBottom: 8,
    fontStyle: 'italic'
  },
  countdown: {
    marginTop: 8,
    fontSize: 16,
    color: 'tomato',
    marginBottom: 20,
  }
});
