import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../components/Text';
import { NoteItem } from '../components/NoteItem';
import { useNoteStore } from '@/stores/noteStore';
import { SortingMenu } from '@/components/SortingMenu/SortingMenu';

export default function HomeScreen() {
  const { getSortedNotes, sortOption, sortDirection, setSorting } = useNoteStore();
  const notes = getSortedNotes();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="title">Notes</Text>
        <View style={styles.headerRight}>
          <SortingMenu
            sortOption={sortOption}
            sortDirection={sortDirection}
            onSortChange={setSorting}
          />
          <TouchableOpacity 
            onPress={() => router.push('/note/new')}
            style={styles.addButton}
          >
            <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={notes}
        renderItem={({ item }) => (
          <NoteItem
            note={item}
            onPress={() => router.push(`/note/${item.id}`)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No notes yet. Tap + to create one!
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  addButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 