import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Cliente } from '../types/Cliente';
import { createCliente, updateCliente } from '../services/api';

type Props = {
  route: RouteProp<RootStackParamList, 'ClienteForm'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'ClienteForm'>;
};

export default function ClienteFormScreen({ route, navigation }: Props) {
  const clienteEditando = route.params?.cliente;

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  useEffect(() => {
    if (clienteEditando) {
      setNombre(clienteEditando.nombre);
      setEmail(clienteEditando.email);
      setTelefono(clienteEditando.telefono);
      setDireccion(clienteEditando.direccion);
    }
  }, [clienteEditando]);

  const handleGuardar = async () => {
    if (!nombre || !email) {
      Alert.alert('Error', 'Nombre y correo son obligatorios');
      return;
    }

    try {
      if (clienteEditando) {
        await updateCliente(clienteEditando.idCliente, {
          ...clienteEditando,
          nombre,
          email,
          telefono,
          direccion,
        });
      } else {
        await createCliente({ nombre, email, telefono, direccion });
      }

      Alert.alert('Éxito', 'Cliente guardado correctamente');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar el cliente');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={direccion}
        onChangeText={setDireccion}
      />
      <Button title="Guardar" onPress={handleGuardar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
});
