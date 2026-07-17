import { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { colors } from '../theme/colors';

const EXEMPLOS = [
  '65% Algodão, 35% Poliéster',
  '100% Linho',
  '80% Algodão Orgânico, 20% Elastano',
];

export default function Escanear({ navigation }) {
  const [composicao, setComposicao] = useState('');

  function simularEscaneamento() {
    Alert.alert(
      'Câmera',
      'A integração com a câmera será implementada em uma versão futura. Por enquanto, insira a composição manualmente ou use um exemplo.',
      [{ text: 'OK' }]
    );
  }

  function analisar() {
    if (!composicao.trim()) {
      Alert.alert('Atenção', 'Insira a composição da etiqueta ou use um exemplo.');
      return;
    }
    navigation.navigate('ResultadoAnalise', { composicao });
  }

  return (
    <ScreenContainer>
      <Header
        title="Escanear Etiqueta"
        subtitle="Identifique os materiais da peça"
        icon={<Ionicons name="scan" size={32} color={colors.accent} />}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card>
          <View style={styles.cameraPlaceholder}>
            <View style={styles.cameraFrame}>
              <Ionicons name="camera" size={64} color={colors.primaryLight} />
              <Text style={styles.cameraText}>Área da câmera</Text>
              <Text style={styles.cameraSubtext}>
                Interface preparada para integração futura
              </Text>
            </View>
            <Button title="Abrir Câmera" onPress={simularEscaneamento} />
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Composição manual</Text>
          <Text style={styles.sectionHint}>
            Digite a composição como aparece na etiqueta (ex: 65% Algodão, 35% Poliéster)
          </Text>
          <Input
            placeholder="Ex: 65% Algodão, 35% Poliéster"
            value={composicao}
            onChangeText={setComposicao}
            multiline
            style={styles.textArea}
          />
          <Text style={styles.exemplosTitle}>Exemplos rápidos:</Text>
          {EXEMPLOS.map((exemplo) => (
            <Button
              key={exemplo}
              title={exemplo}
              variant="outline"
              onPress={() => setComposicao(exemplo)}
              style={styles.exemploBtn}
            />
          ))}
          <Button title="Analisar Composição" onPress={analisar} />
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  cameraPlaceholder: {
    alignItems: 'center',
  },
  cameraFrame: {
    width: '100%',
    height: 200,
    backgroundColor: colors.overlay,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cameraText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 8,
  },
  cameraSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  sectionHint: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  exemplosTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  exemploBtn: {
    paddingVertical: 10,
  },
});
