import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { Cliente } from '../types/Cliente';
import { fetchClientes, deleteCliente } from '../services/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/Ionicons';
import { Swipeable } from 'react-native-gesture-handler';

export default function ClientesScreen() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();

  const cargarClientes = async () => {
    setLoading(true);
    try {
      const data = await fetchClientes();
      setClientes(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  // Refrescar datos cada vez que la pantalla vuelva a enfocarse
  useFocusEffect(
    useCallback(() => {
      cargarClientes();
    }, [])
  );

  const handleEliminar = (id: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este cliente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCliente(id);
              cargarClientes(); // Refresca lista luego de eliminar
              Alert.alert('Éxito', 'Cliente eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el cliente');
            }
          },
        },
      ]
    );
  };

  const iconSize = width > 600 ? 32 : 24;

  const renderRightActions = (id: number) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleEliminar(id)}
      activeOpacity={0.7}
    >
      <Icon name="trash" size={iconSize} color="white" />
    </TouchableOpacity>
  );

  const renderLeftActions = (cliente: Cliente) => (
    <TouchableOpacity
      style={styles.editButton}
      onPress={() => navigation.navigate('ClienteForm', { cliente })}
      activeOpacity={0.7}
    >
      <Icon name={width > 600 ? 'pencil' : 'create'} size={iconSize} color="white" />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.botonAgregar}
        onPress={() => navigation.navigate('ClienteForm')}
      >
        <Text style={styles.textoAgregar}>+ Agregar Cliente</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <FlatList
          data={clientes}
          keyExtractor={(item) => item.idCliente.toString()}
          renderItem={({ item }) => (
            <Swipeable
              renderLeftActions={() => renderLeftActions(item)}
              renderRightActions={() => renderRightActions(item.idCliente)}
              friction={2}
              overshootLeft={false}
              overshootRight={false}
            >
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('ClienteForm', { cliente: item })}
                activeOpacity={0.8}
              >
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text>{item.email}</Text>
                <Text>{item.telefono}</Text>
                <Text>{item.direccion}</Text>
              </TouchableOpacity>
            </Swipeable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  botonAgregar: {
    backgroundColor: '#007bff',
    padding: 12,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoAgregar: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    marginVertical: 5,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    marginVertical: 5,
    borderRadius: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
