import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function EcoScoreBadge({ nota, nivel, cor, size = 'large' }) {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  return (
    <View style={[styles.container, isLarge && styles.largeContainer]}>
      <View
        style={[
          styles.circle,
          isSmall && styles.smallCircle,
          { borderColor: cor || colors.primary },
          isLarge && styles.largeCircle,
        ]}
      >
        <Text style={[styles.nota, isSmall && styles.smallNota, isLarge && styles.largeNota]}>
          {nota}
        </Text>
        {!isSmall && <Text style={styles.maxNota}>/10</Text>}
      </View>
      {nivel ? (
        <Text style={[styles.nivel, { color: cor || colors.primary }]}>{nivel}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  largeContainer: {
    paddingVertical: 16,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    flexDirection: 'row',
  },
  smallCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
  },
  largeCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
  },
  smallNota: {
    fontSize: 16,
  },
  nota: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  largeNota: {
    fontSize: 40,
  },
  maxNota: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  nivel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
});
