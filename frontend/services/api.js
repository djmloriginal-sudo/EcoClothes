import Constants from 'expo-constants';
import { Platform } from 'react-native';

function getApiBaseUrl() {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }

  const manifest = Constants.expoConfig || Constants.manifest || {};
  const debuggerHost = manifest.debuggerHost || manifest.hostUri || '';

  if (debuggerHost) {
    const host = debuggerHost.split(':')[0];
    return `http://${host}:3000`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  if (Platform.OS === 'ios') {
    return 'http://127.0.0.1:3000';
  }

  return 'http://localhost:3000';
}

export const API_BASE_URL = getApiBaseUrl();

export function getUsuarioAtual() {
  return globalThis.usuario || null;
}

export function setUsuarioAtual(usuario) {
  globalThis.usuario = usuario;
  return usuario;
}

export async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = { mensagem: text };
  }

  if (!response.ok) {
    throw new Error(data?.mensagem || 'Erro na solicitação');
  }

  return data;
}
