import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Notes',
        }}
      />
      <Stack.Screen
        name="note/[id]"
        options={{
          title: 'Note',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
