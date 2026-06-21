import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { calendars } from '@/services/endpoints';
import type { Calendar } from '@/services/types';

export default function CalendarsScreen() {
  const theme = useTheme();
  const qc = useQueryClient();
  const [newName, setNewName] = useState('');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['calendars'],
    queryFn: calendars.list,
  });

  const create = useMutation({
    mutationFn: (name: string) => calendars.create(name),
    onSuccess: () => {
      setNewName('');
      qc.invalidateQueries({ queryKey: ['calendars'] });
    },
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <ThemedText type="subtitle" style={styles.title}>
          Calendars
        </ThemedText>

        <ThemedView style={styles.createRow}>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            placeholder="New calendar name"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
          />
          <Pressable
            onPress={() => newName.trim() && create.mutate(newName.trim())}
            disabled={create.isPending || !newName.trim()}
            style={[styles.addBtn, { backgroundColor: '#3c87f7', opacity: newName.trim() ? 1 : 0.5 }]}>
            <ThemedText style={styles.addBtnText}>{create.isPending ? '…' : 'Add'}</ThemedText>
          </Pressable>
        </ThemedView>

        {isLoading ? (
          <ActivityIndicator style={styles.center} />
        ) : isError ? (
          <Pressable onPress={() => refetch()} style={styles.center}>
            <ThemedText themeColor="textSecondary">Couldn&apos;t load calendars. Tap to retry.</ThemedText>
          </Pressable>
        ) : (
          <FlatList
            data={data ?? []}
            keyExtractor={(c) => String(c.id)}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <ThemedText themeColor="textSecondary" style={styles.center}>
                No calendars yet — create your first one above.
              </ThemedText>
            }
            renderItem={({ item }) => <CalendarRow calendar={item} />}
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

function CalendarRow({ calendar }: { calendar: Calendar }) {
  // Tapping a calendar will open its monthly grid in Phase 2.
  return (
    <ThemedView type="backgroundElement" style={styles.row}>
      <ThemedText style={styles.rowTitle}>{calendar.name}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {calendar.hemisphere === 'south' ? 'Southern' : 'Northern'} hemisphere
        {calendar.role ? ` · ${calendar.role}` : ''}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: Spacing.three },
  title: { marginVertical: Spacing.three },
  createRow: { flexDirection: 'row', gap: Spacing.two, marginBottom: Spacing.three },
  input: {
    flex: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  addBtn: { borderRadius: Spacing.two, paddingHorizontal: Spacing.four, justifyContent: 'center' },
  addBtnText: { color: '#fff', fontWeight: '700' },
  list: { gap: Spacing.two, paddingBottom: Spacing.six },
  row: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.half },
  rowTitle: { fontSize: 18, fontWeight: '600' },
  center: { textAlign: 'center', marginTop: Spacing.five },
});
