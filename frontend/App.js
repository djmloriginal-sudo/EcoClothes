import { StatusBar } from 'expo-status-bar';
import StackNavigator from './navigation/StackNavigator';
import { FavoritosProvider } from './context/FavoritosContext';

export default function App() {
  return (
    <FavoritosProvider>
      <StatusBar style="light" />
      <StackNavigator />
    </FavoritosProvider>
  );
}
