import React, { useState } from 'react';
import {
  StyleSheet,
  Pressable,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import type { SortOption, SortDirection } from '@/types/note';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../Text';

interface SortItemProps {
  title: string;
  iconName: string;
  isActive: boolean;
  direction: SortDirection;
  onPress: () => void;
}

interface SortingMenuProps {
  sortOption: SortOption;
  sortDirection: SortDirection;
  onSortChange: (option: SortOption, direction: SortDirection) => void;
}

const SortItem = ({ title, iconName, isActive, direction, onPress }: SortItemProps) => (
  <TouchableOpacity
    style={[styles.sortItem, isActive && styles.activeSortItem]}
    onPress={onPress}
  >
    <View style={styles.sortItemLeft}>
      <Ionicons name={iconName as any} size={20} color={isActive ? '#007AFF' : '#666'} />
      <Text style={[styles.sortItemText, isActive && styles.activeSortItemText]} >
        {title}
      </Text>
    </View>
    {isActive && (
      <Ionicons
        name={direction === 'asc' ? 'arrow-up' : 'arrow-down'}
        size={20}
        color="#007AFF"
      />
    )}
  </TouchableOpacity>
);

export function SortingMenu({ sortOption, sortDirection, onSortChange }: SortingMenuProps) {
  const [isVisible, setIsVisible] = useState(false);


  const handleSort = (option: SortOption) => {
    if (option === sortOption) {
      onSortChange(option, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(option, 'desc');
    }
    setIsVisible(false);
  };

  return (
    <>
      <Pressable
        style={styles.trigger}
        onPress={() => setIsVisible(true)}
      >
        <Ionicons name="filter" size={20} color="#666" />
        <Text style={styles.triggerText}>Sort</Text>
      </Pressable>

      <Modal  
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuContainer}>
                <Text style={styles.menuTitle}>Sort by</Text>
                
                <SortItem
                  title="Name"
                  iconName="text"
                  isActive={sortOption === 'name'}
                  direction={sortDirection}
                  onPress={() => handleSort('name')}
                />
                
                <SortItem
                  title="Date Created"
                  iconName="calendar"
                  isActive={sortOption === 'date'}
                  direction={sortDirection}
                  onPress={() => handleSort('date')}
                />
                
                <SortItem
                  title="Size"
                  iconName="folder"
                  isActive={sortOption === 'size'}
                  direction={sortDirection}
                  onPress={() => handleSort('size')}
                />

                <View style={styles.currentSort}>
                  <Text style={styles.currentSortText}>
                    Current: {sortOption} ({sortDirection === 'asc' ? 'ascending' : 'descending'})
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  triggerText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '80%',
    maxWidth: 300,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  sortItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  sortItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeSortItem: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  sortItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#666',
  },
  activeSortItemText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  currentSort: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  currentSortText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
}); 