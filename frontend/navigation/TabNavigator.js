import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../theme/colors';

import Home from '../screens/home';
import Escanear from '../screens/escanear';
import Favoritos from '../screens/favoritos';
import Perfil from '../screens/perfil';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ title: 'Início' }} />
      <Tab.Screen name="Escanear" component={Escanear} options={{ title: 'Escanear' }} />
      <Tab.Screen name="Favoritos" component={Favoritos} options={{ title: 'Favoritos' }} />
      <Tab.Screen name="Perfil" component={Perfil} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}
