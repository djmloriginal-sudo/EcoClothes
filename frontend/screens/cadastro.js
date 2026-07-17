import { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { colors } from '../theme/colors';
import { requestJson } from '../services/api';

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function cadastrarUsuario() {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    try {
      setCarregando(true);
      await requestJson('/usuarios', {
        method: 'POST',
        body: JSON.stringify({ nome, email, senha }),
      });

      Alert.alert('Sucesso', 'Cadastro realizado! Faça login para continuar.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (erro) {
      Alert.alert('Erro no cadastro', erro.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ScreenContainer>
      <Header
        title="Cadastro"
        subtitle="Junte-se ao consumo consciente"
        icon={<Ionicons name="person-add" size={32} color={colors.accent} />}
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Input placeholder="Nome completo" value={nome} onChangeText={setNome} />
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
        <Button title={carregando ? 'Cadastrando...' : 'Cadastrar'} onPress={cadastrarUsuario} disabled={carregando} />
        <Button
          title="Já tenho conta"
          variant="outline"
          onPress={() => navigation.navigate('Login')}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
  },
});
