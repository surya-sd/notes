import * as FileSystem from 'expo-file-system';

const STORAGE_PATH = `${FileSystem.documentDirectory}notes-storage.json`;

export const storage = {
  async set(key: string, value: string) {
    try {
      let data = {};
      try {
        const existingData = await FileSystem.readAsStringAsync(STORAGE_PATH);
        data = JSON.parse(existingData);
      } catch {
      }
      
      data = { ...data, [key]: value };
      await FileSystem.writeAsStringAsync(STORAGE_PATH, JSON.stringify(data));
    } catch (error) {
      console.error('Storage set error:', error);
      throw new Error('Failed to save data');
    }
  },

  async getString(key: string): Promise<string | null> {
    try {
      const data = await FileSystem.readAsStringAsync(STORAGE_PATH);
      const parsed = JSON.parse(data);
      return parsed[key] || null;
    } catch {
      return null;
    }
  }
}; 