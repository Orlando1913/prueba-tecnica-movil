import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import ClientesScreen from '../screens/ClientesScreen';
import ClienteFormScreen from '../screens/ClienteFormScreen';
import { Cliente } from '../types/Cliente';

export type RootStackParamList = {
  Login: undefined;
  Clientes: undefined;
  ClienteForm: { cliente?: Cliente };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Iniciar Sesión' }} />
      <Stack.Screen name="Clientes" component={ClientesScreen} options={{ title: 'Clientes' }} />
      <Stack.Screen name="ClienteForm" component={ClienteFormScreen} options={{ title: 'Formulario Cliente' }} />
    </Stack.Navigator>
  );
}
