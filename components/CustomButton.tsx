import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/Typography';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const CustomButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  isLoading = false,
  style,
  textStyle
}: CustomButtonProps) => {
  const getBackgroundStyle = () => {
    switch (variant) {
      case 'primary': return { backgroundColor: Colors.primary };
      case 'secondary': return { backgroundColor: Colors.surface };
      case 'outline': return { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.primary };
      default: return { backgroundColor: Colors.primary };
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary': return { color: Colors.white };
      case 'secondary': return { color: Colors.text };
      case 'outline': return { color: Colors.primary };
      default: return { color: Colors.white };
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getBackgroundStyle(), style]}
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? Colors.primary : Colors.white} />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    ...Typography.title,
  },
});
