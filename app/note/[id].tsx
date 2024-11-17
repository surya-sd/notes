import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Clipboard,
  AppState,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ColorPicker, ColorPickerRef } from '../../components/ColorPicker';
import { HeaderImagePicker } from '../../components/HeaderImagePicker';
import { Icon } from '../../components/Icon';
import { Text } from '../../components/Text';
import { useNoteStore } from '@/stores/noteStore';
import debounce from 'lodash/debounce';
import { Ionicons } from '@expo/vector-icons';


export default function NoteEditorScreen() {
  const { id } = useLocalSearchParams();
  const isNewNote = id === 'new';
  const colorPickerRef = useRef<ColorPickerRef>(null);
  const titleInputRef = useRef<TextInput>(null);
  const { addNote, updateNote, notes, deleteNote } = useNoteStore();

  const existingNote = !isNewNote ? notes.find(n => n.id === id) : null;

  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [backgroundColor, setBackgroundColor] = useState(existingNote?.backgroundColor || '#FFFFFF');
  const [headerImage, setHeaderImage] = useState<string | undefined>(existingNote?.headerImage);
  const [isSaving, setIsSaving] = useState(false);
  const hasUnsavedChanges = useRef(false);
  const currentNoteId = useRef<string | null>(existingNote?.id || null);

  const saveNote = useCallback(
    debounce(async (noteData) => {
      try {
        setIsSaving(true);
        const noteToSave = {
          title: noteData.title,
          content: noteData.content,
          backgroundColor: noteData.backgroundColor,
          headerImage: noteData.headerImage,
        };

        if (!currentNoteId.current) {
          const savedNote = await addNote(noteToSave);
          currentNoteId.current = savedNote.id;
        } else {
          await updateNote(currentNoteId.current, noteToSave);
        }
        hasUnsavedChanges.current = false;
      } catch (error) {
        console.error('Error saving note:', error);
      } finally {
        setIsSaving(false);
      }
    }, 1500),
    [addNote, updateNote]
  );

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    hasUnsavedChanges.current = true;
    
    if (newContent.trim() || title.trim()) {
      saveNote({
        title,
        content: newContent,
        backgroundColor,
        headerImage,
      });
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    hasUnsavedChanges.current = true;
    
    if (newTitle.trim() || content.trim()) {
      saveNote({
        title: newTitle,
        content,
        backgroundColor,
        headerImage,
      });
    }
  };

  const handleHeaderImageChange = (imageUri: string | undefined) => {
    setHeaderImage(imageUri);
    hasUnsavedChanges.current = true;
    
    saveNote({
      title,
      content,
      backgroundColor,
      headerImage: imageUri,
    });
  };

  const handleBack = () => {
    if (hasUnsavedChanges.current) {
      saveNote.flush();
    }
    router.push('/'); 
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' && hasUnsavedChanges.current) {
        saveNote.flush();
      }
    });

    return () => {
      subscription.remove();
      if (hasUnsavedChanges.current) {
        saveNote.flush();
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      const noteText = `${title}\n\n${content}`;
      await Clipboard.setString(noteText);
      Alert.alert('Success', 'Note copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy note');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(id as string);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleColorChange = (color: string) => {
    setBackgroundColor(color);
    hasUnsavedChanges.current = true;
    
    saveNote({
      title,
      content,
      backgroundColor: color,
      headerImage,
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { backgroundColor }]}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={30} color="#666" />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleCopy}
          >
            <Ionicons name="copy-outline" size={30} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => colorPickerRef.current?.open()}
          >
            <Ionicons name="color-palette-outline" size={30} color="#666" />
          </TouchableOpacity>

          {!isNewNote && (
            <TouchableOpacity 
              onPress={handleDelete}
              style={[styles.headerButton, styles.deleteButton]}
            >
              <Ionicons name="trash-outline" size={30} color="#FF3B30" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        style={[styles.content, { backgroundColor }]}
        keyboardShouldPersistTaps="handled"
      >
        <HeaderImagePicker
          currentImage={headerImage}
          onImageSelect={handleHeaderImageChange}
          onImageRemove={() => handleHeaderImageChange(undefined)}
        />

        <TextInput
          ref={titleInputRef}
          style={styles.titleInput}
          value={title}
          onChangeText={handleTitleChange}
          placeholder="Note Title"
          placeholderTextColor="#999"
          selectionColor="#007AFF"
          autoFocus={isNewNote}
        />

        <TextInput
          style={styles.contentInput}
          value={content}
          onChangeText={handleContentChange}
          placeholder="Start writing..."
          placeholderTextColor="#999"
          selectionColor="#007AFF"
          multiline
          textAlignVertical="top"
        />
      </ScrollView>

      {isSaving && (
        <View style={styles.savingIndicator}>
          <Text style={styles.savingText}>Saving...</Text>
        </View>
      )}

      <ColorPicker
        ref={colorPickerRef}
        selectedColor={backgroundColor}
        onColorSelect={handleColorChange}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 16,
    padding: 0,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 200,
    padding: 0,
  },
  savingIndicator: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  savingText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  deleteButton: {
    marginLeft: 8,
  },
}); 