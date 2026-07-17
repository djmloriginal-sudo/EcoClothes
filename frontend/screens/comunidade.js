import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { getUsuarioAtual, requestJson } from '../services/api';
import { colors } from '../theme/colors';

export default function Comunidade({ navigation }) {
  const [analises, setAnalises] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const usuarioAtual = getUsuarioAtual();

  useEffect(() => {
    async function carregarAnalises() {
      try {
        setCarregando(true);
        const resposta = await requestJson('/analises');
        setAnalises(resposta || []);
      } catch (erroDoFetch) {
        setErro(erroDoFetch.message || 'Erro ao carregar comunidade.');
      } finally {
        setCarregando(false);
      }
    }

    carregarAnalises();
  }, []);

  async function excluirAnalise(id) {
    try {
      await requestJson(`/analises/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({ usuarioId: usuarioAtual?.id, role: usuarioAtual?.role }),
      });
      setAnalises((prev) => prev.filter((item) => item.id !== id));
    } catch (erro) {
      setErro(erro.message || 'Erro ao excluir análise.');
    }
  }

  function renderItem({ item }) {
    const ehMinhaAnalise = usuarioAtual?.id === item.usuarioId;
    const podeExcluir = usuarioAtual?.role === 'admin' || ehMinhaAnalise;

    return (
      <Card style={styles.itemCard}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemUser}>{item.usuarioNome || 'Usuário'}{ehMinhaAnalise ? ' • Minha análise' : ''}</Text>
          <Text style={styles.itemDate}>{new Date(item.dataCriacao).toLocaleDateString()}</Text>
        </View>
        <Text style={styles.itemComposicao}>{item.composicao}</Text>
        <View style={styles.itemResumo}>
          <Text style={styles.itemNota}>Nota: {item.resultado?.nota ?? '—'}</Text>
          <Text style={styles.itemNivel}>{item.resultado?.nivel ?? '—'}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.verButton}
            onPress={() => navigation.navigate('ResultadoAnalise', { composicao: item.composicao })}
          >
            <Text style={styles.verButtonText}>Ver análise</Text>
          </TouchableOpacity>
          {podeExcluir && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => excluirAnalise(item.id)}
            >
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    );
  }

  return (
    <ScreenContainer>
      <Header
        title="Comunidade"
        subtitle="Veja roupas cadastradas por outros usuários"
        icon={<Ionicons name="people" size={32} color={colors.accent} />}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <Card style={styles.cardIntro}>
          <Text style={styles.introTitle}>Comunidade EcoClothes</Text>
          <Text style={styles.introText}>
            Acompanhe as peças que outros usuários cadastraram e veja como elas foram analisadas. Em breve teremos chat para trocar ideias com a comunidade.
          </Text>
          <Button
            title="Abrir chat da comunidade"
            variant="outline"
            onPress={() => navigation.navigate('ChatComunidade')}
          />
        </Card>

        {carregando ? (
          <Text style={styles.statusText}>Carregando roupas cadastradas...</Text>
        ) : erro ? (
          <Text style={[styles.statusText, styles.errorText]}>{erro}</Text>
        ) : analises.length === 0 ? (
          <Text style={styles.statusText}>Ainda não há roupas cadastradas na comunidade.</Text>
        ) : (
          <FlatList
            data={analises}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingBottom: 16,
  },
  cardIntro: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  statusText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 24,
    marginHorizontal: 16,
    fontSize: 14,
  },
  errorText: {
    color: colors.danger,
  },
  list: {
    paddingBottom: 24,
  },
  itemCard: {
    padding: 18,
    marginHorizontal: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemUser: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  itemDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  itemComposicao: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 10,
  },
  itemResumo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemNota: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
  itemNivel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  verButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  verButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
