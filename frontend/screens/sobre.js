import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import Card from '../components/Card';
import { colors } from '../theme/colors';

export default function Sobre({ navigation }) {
  return (
    <ScreenContainer>
      <Header
        title="Sobre o Projeto"
        subtitle="EcoClothes — TCC"
        icon={<Ionicons name="information-circle" size={32} color={colors.accent} />}
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <View style={styles.logoRow}>
            <Ionicons name="leaf" size={40} color={colors.primary} />
            <Text style={styles.appName}>EcoClothes</Text>
          </View>
          <Text style={styles.text}>
            Uma aplicação para um consumo mais consciente e sustentável na moda.
            O protótipo permite escanear etiquetas de peças de roupa, identificar
            os materiais utilizados e apresentar informações sobre impacto ambiental
            e nível de sustentabilidade.
          </Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Autores</Text>
          <Text style={styles.text}>Lorenzo Miguel</Text>
          <Text style={styles.text}>Matheus Pereira</Text>
          <Text style={styles.text}>Vinicius Cardoso</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Orientadores</Text>
          <Text style={styles.text}>Carlos Tadeu Queiroz Morais</Text>
          <Text style={styles.text}>Rafaella Egues da Rosa</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Objetivo</Text>
          <Text style={styles.text}>
            Desenvolver um aplicativo que auxilie consumidores na avaliação do
            impacto ambiental das roupas, promovendo decisões de compra mais
            conscientes e sustentáveis, alinhado aos ODS 12 e 13 da Agenda 2030.
          </Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Funcionalidades</Text>
          <View style={styles.feature}>
            <Ionicons name="scan" size={18} color={colors.primary} />
            <Text style={styles.featureText}>Escaneamento de etiquetas (protótipo)</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="analytics" size={18} color={colors.primary} />
            <Text style={styles.featureText}>Análise de composição e nota ecológica</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="shirt" size={18} color={colors.primary} />
            <Text style={styles.featureText}>Banco de dados de tecidos</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="heart" size={18} color={colors.primary} />
            <Text style={styles.featureText}>Favoritos para comparação</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="book" size={18} color={colors.primary} />
            <Text style={styles.featureText}>Conteúdo educativo sobre sustentabilidade</Text>
          </View>
        </Card>

        <Text style={styles.footer}>
          Palavras-chave: consumo consciente, sustentabilidade, indústria da moda,
          aplicativo móvel, fast fashion.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 4,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 10,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
    marginHorizontal: 16,
    marginTop: 8,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
