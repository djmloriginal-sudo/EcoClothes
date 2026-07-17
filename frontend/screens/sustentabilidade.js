import { ScrollView, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import Card from '../components/Card';
import { colors } from '../theme/colors';

export default function Sustentabilidade({ navigation }) {
  return (
    <ScreenContainer>
      <Header
        title="Sustentabilidade"
        subtitle="Consumo consciente na moda"
        icon={<Ionicons name="earth" size={32} color={colors.accent} />}
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.title}>O que é sustentabilidade?</Text>
          <Text style={styles.text}>
            Sustentabilidade é a capacidade de atender às necessidades atuais sem
            prejudicar as futuras gerações. Na indústria da moda, isso implica
            reconsiderar o consumo de água, energia, matérias-primas e o
            gerenciamento de resíduos têxteis.
          </Text>
        </Card>

        <Card>
          <Text style={styles.title}>Consumo consciente</Text>
          <Text style={styles.text}>
            O consumo consciente vai além de escolhas pessoais e abrange práticas
            sociais influenciadas pela cultura, informação e situação econômica.
            Analisar as consequências ambientais das roupas é fundamental para
            minimizar os prejuízos causados pela produção e pelo descarte excessivo.
          </Text>
        </Card>

        <Card>
          <Text style={styles.title}>Impactos da indústria têxtil</Text>
          <Text style={styles.text}>
            A indústria da moda é responsável por cerca de 2% a 8% das emissões
            globais de gases de efeito estufa. A produção de uma única camiseta de
            algodão pode utilizar até 2.700 litros de água — o equivalente ao
            consumo de uma pessoa durante dois anos e meio.
          </Text>
        </Card>

        <Card>
          <Text style={styles.title}>Como o EcoClothes ajuda</Text>
          <Text style={styles.text}>
            O aplicativo aproxima o consumidor das informações que realmente importam,
            facilitando decisões com menos impacto no meio ambiente. Ao escanear
            etiquetas e visualizar a nota ecológica, você pode comparar peças e
            escolher alternativas mais sustentáveis.
          </Text>
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
