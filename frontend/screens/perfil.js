import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { getUsuarioAtual, requestJson } from '../services/api';
import { colors } from '../theme/colors';

export default function Perfil({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [analises, setAnalises] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [notaMedia, setNotaMedia] = useState(null);

  useEffect(() => {
    async function carregarPerfil() {
      const usuarioAtual = getUsuarioAtual();
      if (!usuarioAtual?.id) {
        return;
      }

      setUsuario(usuarioAtual);

      try {
        const [analisesData, favoritosData] = await Promise.all([
          requestJson(`/usuarios/${usuarioAtual.id}/analises`),
          requestJson(`/usuarios/${usuarioAtual.id}/favoritos`),
        ]);

        setAnalises(analisesData || []);
        setFavoritos(favoritosData || []);

        if (analisesData?.length) {
          const somaNotas = analisesData.reduce((acc, item) => {
            const nota = Number(item.resultado?.nota ?? 0);
            return acc + (Number.isFinite(nota) ? nota : 0);
          }, 0);
          setNotaMedia((somaNotas / analisesData.length).toFixed(1));
        } else {
          setNotaMedia(null);
        }
      } catch (erro) {
        console.log('Erro ao carregar perfil:', erro.message);
      }
    }

    carregarPerfil();
  }, []);

  return (
    <ScreenContainer>
      <Header
        title="Perfil"
        subtitle="Sua jornada sustentável"
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={colors.primary} />
          </View>
          <Text style={styles.nome}>{usuario?.nome || 'Consumidor Consciente'}</Text>
          <Text style={styles.email}>{usuario?.email || 'usuario@ecoclothes.app'}</Text>
        </View>

        <Card style={styles.statsCard}>
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Ionicons name="heart" size={24} color={colors.primary} />
              <Text style={styles.statValue}>{favoritos.length}</Text>
              <Text style={styles.statLabel}>Favoritos</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="leaf" size={24} color={colors.primary} />
              <Text style={styles.statValue}>{notaMedia !== null ? notaMedia : '—'}</Text>
              <Text style={styles.statLabel}>Nota média</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Sobre você</Text>
          <Text style={styles.sectionText}>
            Este perfil faz parte do protótipo EcoClothes, desenvolvido para
            auxiliar consumidores na avaliação do impacto ambiental das roupas
            e promover decisões de compra mais conscientes.
          </Text>
        </Card>

        <Button
          title="Sair"
          variant="outline"
          onPress={() => navigation.replace('Login')}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  nome: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statsCard: {
    marginTop: 0,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
