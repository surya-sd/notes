import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Text } from '../Text';

const COLORS = [
  '#FFFFFF', 
  '#F8F9FA', 
  '#FFE0E0', 
  '#FFE8D9', 
  '#FFF3D9', 
  '#E3F2E1', 
  '#E3F2FF', 
  '#F3E5F5', 
  '#FFE0E6', 
  '#E0E0E0', 
];

export interface ColorPickerRef {
  open: () => void;
  close: () => void;
}

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const ColorPicker = forwardRef<ColorPickerRef, ColorPickerProps>(
  ({ selectedColor, onColorSelect }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const { width } = useWindowDimensions();

    useImperativeHandle(ref, () => ({
      open: () => setIsVisible(true),
      close: () => setIsVisible(false),
    }));

    const handleColorSelect = (color: string) => {
      onColorSelect(color);
      setIsVisible(false);
    };

    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.title}>Choose Background Color</Text>
            
            <ScrollView 
              horizontal={false} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.colorGrid}
            >
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColor,
                  ]}
                  onPress={() => handleColorSelect(color)}
                >
                  {selectedColor === color && (
                    <View style={styles.checkmark} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
}); 