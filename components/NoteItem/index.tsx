import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../Text';
import type { Note } from '../../app/stores/noteStore';

interface NoteItemProps {
  note: Note;
  onPress: () => void;
}

export function NoteItem({ note, onPress }: NoteItemProps) {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: note.backgroundColor }]}
      onPress={onPress}
    >
      <Text variant="subtitle" numberOfLines={1}>
        {note.title}
      </Text>
      <Text variant="caption" numberOfLines={2} style={styles.preview}>
        {note.content}
      </Text>
      <Text variant="caption" style={styles.date}>
        {new Date(note.createdAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  preview: {
    marginTop: 8,
  },
  date: {
    marginTop: 8,
    textAlign: 'right',
  },
}); 