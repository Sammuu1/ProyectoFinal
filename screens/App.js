import 'react-native-gesture-handler';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  SafeAreaView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// ─── Screens ──────────────────────────────────────────────────────────────────
import BranchSelection       from './branches';
import Dashboard             from './dashboard';
import Products              from './Products';
import AddProducts           from './AddProducts';
import AlertasScreen         from './AlertasScreen';
import Movimientos           from './Movimientos';

// ─── Context ──────────────────────────────────────────────────────────────────
import { InventarioProvider } from './Inventario';

const Stack = createStackNavigator();

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ navigation }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa tus credenciales');
      return;
    }
    navigation.navigate('Branches');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Vault</Text>
            <Text style={styles.subtitle}>Sistema de Gestión de Inventario</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="correo@empresa.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="........"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Olvidaste tu contraseña? </Text>
            <Text style={styles.linkText}>Recuperar</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <InventarioProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login"           component={LoginScreen} />
          <Stack.Screen name="Branches"        component={BranchSelection} />
          <Stack.Screen name="Dashboard"       component={Dashboard} />
          <Stack.Screen name="Productos"       component={Products} />
          <Stack.Screen name="AgregarProducto" component={AddProducts} />
          <Stack.Screen name="Alertas"         component={AlertasScreen} />
          <Stack.Screen name="Movimientos"     component={Movimientos} />
        </Stack.Navigator>
      </NavigationContainer>
    </InventarioProvider>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center' },
  content:       { width: '100%', alignItems: 'center', paddingHorizontal: 20 },
  card:          { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 30, elevation: 5 },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo:          { width: 100, height: 100 },
  title:         { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
  subtitle:      { fontSize: 14, color: '#666' },
  inputGroup:    { marginBottom: 20 },
  label:         { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 8 },
  input:         { backgroundColor: '#F0F2F5', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16 },
  button:        { backgroundColor: '#305CFF', borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginTop: 10 },
  buttonText:    { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  footer:        { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
  footerText:    { color: '#666', fontSize: 14 },
  linkText:      { color: '#305CFF', fontSize: 14, fontWeight: '600' },
});