import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ApiError } from '@/services/api';
import { useAuth } from '@/services/auth-context';

export default function LoginScreen() {
  const theme = useTheme();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isRegister = mode === 'register';

  async function submit() {
    setError(null);
    setBusy(true);
    try {
      if (isRegister) {
        await signUp(name.trim(), email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
      // Redirect is handled by RootNavigator once `user` is set.
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Something went wrong. Check the API is running.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.form}>
          <ThemedText type="subtitle" style={styles.heading}>
            Seasonal Calendar
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.tagline}>
            {isRegister ? 'Create your family account' : 'Welcome back'}
          </ThemedText>

          {isRegister && (
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Name"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="words"
              style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
            />
          )}

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            inputMode="email"
            style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder={isRegister ? 'Password (min 8 chars)' : 'Password'}
            placeholderTextColor={theme.textSecondary}
            secureTextEntry
            style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
          />

          {error && (
            <ThemedText type="small" style={styles.error}>
              {error}
            </ThemedText>
          )}

          <Pressable
            onPress={submit}
            disabled={busy}
            style={[styles.button, { backgroundColor: '#3c87f7', opacity: busy ? 0.6 : 1 }]}>
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>{isRegister ? 'Create account' : 'Log in'}</ThemedText>
            )}
          </Pressable>

          <Pressable onPress={() => { setMode(isRegister ? 'login' : 'register'); setError(null); }}>
            <ThemedText type="link" themeColor="textSecondary" style={styles.switch}>
              {isRegister ? 'Already have an account? Log in' : "No account yet? Sign up"}
            </ThemedText>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.four },
  form: { gap: Spacing.three, maxWidth: 420, width: '100%', alignSelf: 'center' },
  heading: { textAlign: 'center' },
  tagline: { textAlign: 'center', marginBottom: Spacing.two },
  input: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  error: { color: '#e5484d' },
  button: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  switch: { textAlign: 'center', marginTop: Spacing.two },
});
