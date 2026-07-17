import { TextInput, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function Input({ style, ...props }) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={colors.textSecondary}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.text,
  },
});
