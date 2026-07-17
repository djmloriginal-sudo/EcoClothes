import { ScrollView, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import MenuItem from '../components/MenuItem';
import Card from '../components/Card';
import { colors } from '../theme/colors';

export default function Home({ navigation }) {
  const menuItems = [
    {
      title: 'Materiais',
      subtitle: 'Conheça os tecidos e seus impactos',
      icon: 'shirt-outline',
      screen: 'Materiais',
    },
    {
      title: 'Sustentabilidade',
      subtitle: 'O que é consumo consciente',
      icon: 'earth-outline',
      screen: 'Sustentabilidade',
    },
    {
      title: 'Fast Fashion',
      subtitle: 'Impactos do modelo descartável',
      icon: 'flash-outline',
      screen: 'FastFashion',
    },
    {
      title: 'ODS 12',
      subtitle: 'Consumo e produção responsáveis',
      icon: 'cart-outline',
      screen: 'ODS12',
    },
    {
      title: 'ODS 13',
      subtitle: 'Ação contra mudanças climáticas',
      icon: 'cloud-outline',
      screen: 'ODS13',
    },
    {
      title: 'Dicas',
      subtitle: 'Hábitos para moda sustentável',
      icon: 'bulb-outline',
      screen: 'Dicas',
    },
    {
      title: 'Comunidade',
      subtitle: 'Veja roupas cadastradas por outros usuários',
      icon: 'people-outline',
      screen: 'Comunidade',
    },
    {
      title: 'Sobre o Projeto',
      subtitle: 'Conheça o EcoClothes',
      icon: 'information-circle-outline',
      screen: 'Sobre',
    },
  ];

  return (
    <ScreenContainer>
      <Header
        title="EcoClothes"
        subtitle="Moda consciente e sustentável"
        icon={<Ionicons name="leaf" size={32} color={colors.accent} />}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card>
          <Text style={styles.welcomeTitle}>Bem-vindo!</Text>
          <Text style={styles.welcomeText}>
            Escaneie etiquetas de roupas para descobrir a composição dos tecidos
            e avaliar o impacto ambiental das suas peças.
          </Text>
        </Card>

        {menuItems.map((item) => (
          <MenuItem
            key={item.screen}
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
            onPress={() => navigation.navigate(item.screen)}
          />
        ))}
        <Text style={styles.footer}>ODS 12 e 13 — Agenda 2030 da ONU</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 12,
    marginVertical: 20,
  },
});
