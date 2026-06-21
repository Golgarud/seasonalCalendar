import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/services/auth-context';

export default function AccountScreen() {
  const { user, signOut } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <ThemedText type="subtitle" style={styles.title}>
          Account
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText style={styles.name}>{user?.name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {user?.email}
          </ThemedText>
        </ThemedView>

        <Pressable onPress={signOut} style={styles.signOut}>
          <ThemedText style={styles.signOutText}>Sign out</ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: Spacing.three },
  title: { marginVertical: Spacing.three },
  card: { borderRadius: Spacing.three, padding: Spacing.four, gap: Spacing.half },
  name: { fontSize: 20, fontWeight: '600' },
  signOut: {
    marginTop: Spacing.four,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    backgroundColor: '#e5484d',
  },
  signOutText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
