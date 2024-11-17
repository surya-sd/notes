import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';

interface CustomTextProps extends TextProps {
  variant?: 'default' | 'title' | 'subtitle' | 'caption';
}

export function Text({ variant = 'default', style, ...props }: CustomTextProps) {
  return (
    <RNText style={[styles[variant], style]} {...props} />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  caption: {
    fontSize: 14,
    color: '#666',
  },
}); 