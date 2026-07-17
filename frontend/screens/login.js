import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import Input from '../components/Input';
import Button from '../components/Button';
import { colors } from '../theme/colors';
import { requestJson } from '../services/api';
import { useFavoritos } from '../context/FavoritosContext';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { atualizarUsuario } = useFavoritos();

  async function fazerLogin() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha email e senha.');
      return;
    }

    try {
      setCarregando(true);
      const resposta = await requestJson('/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
      });

      atualizarUsuario(resposta.data);
      navigation.replace('MainTabs');
    } catch (erro) {
      Alert.alert('Erro ao entrar', erro.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={64} color={colors.primary} />
          <Text style={styles.logoText}>EcoClothes</Text>
          <Text style={styles.tagline}>Consumo consciente na moda</Text>
        </View>

        <View style={styles.form}>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
          <Button title={carregando ? 'Entrando...' : 'Entrar'} onPress={fazerLogin} disabled={carregando} />
          <Button
            title="Esqueci a senha"
            variant="outline"
            onPress={() => navigation.navigate('RecuperarSenha')}
          />
          <Button
            title="Criar conta"
            variant="outline"
            onPress={() => navigation.navigate('Cadastro')}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 12,
  },
  tagline: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  form: {
    width: '100%',
  },
});
