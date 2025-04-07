import axios from 'axios';
import { Cliente } from '../types/Cliente';

const API_URL = 'http://192.168.0.19:8080';

export const api = axios.create({
  baseURL: API_URL,
});


export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};


export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data.token;
};


export const fetchClientes = async () => {
  const response = await api.get('/clientes');
  return response.data;
};

export const createCliente = async (cliente: Omit<Cliente, 'idCliente'>) => {
    const response = await api.post('/clientes', cliente);
    return response.data;
  };
  
  export const updateCliente = async (id: number, cliente: Cliente) => {
    const response = await api.put(`/clientes/${id}`, cliente);
    return response.data;
  };
  
  export const deleteCliente = async (id: number) => {
    const response = await api.delete(`/clientes/${id}`);
    return response.data;
  };