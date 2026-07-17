import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function ScreenContainer({ children, style }) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
