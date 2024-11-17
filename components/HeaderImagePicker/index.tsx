import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Text } from '../Text';
import { Ionicons } from '@expo/vector-icons';

interface HeaderImagePickerProps {
  currentImage?: string;
  onImageSelect: (imageUri: string) => void;
  onImageRemove: () => void;
}

export function HeaderImagePicker({
  currentImage,
  onImageSelect,
  onImageRemove,
}: HeaderImagePickerProps) {
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      setLoading(true);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        const fileName = `header-${Date.now()}.jpg`;
        const newPath = `${FileSystem.documentDirectory}${fileName}`;

        await FileSystem.copyAsync({
          from: imageUri,
          to: newPath,
        });

        onImageSelect(newPath);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  if (currentImage) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: currentImage }} style={styles.image} />
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.button}
            onPress={pickImage}
          >
            <Ionicons name="pencil" size={30} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.removeButton]}
            onPress={onImageRemove}
          >
            <Ionicons name="trash" size={30} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.placeholder}
      onPress={pickImage}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#007AFF" />
      ) : (
        <>
          <Ionicons name="image" size={30} color="#666" />
          <Text style={styles.placeholderText}>Add Header Image</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
  },
  placeholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
}); 