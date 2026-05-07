import 'react-native-gesture-handler'; // IMPORTANTE: Debe ser la primera línea
import { Buffer } from 'buffer';
global.Buffer = Buffer;
import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  SafeAreaView, KeyboardAvoidingView, Platform, Alert, ScrollView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';

import BranchSelection from './branches';
import Dashboard from './dashboard';

const Stack = createStackNavigator();
//const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={drawerStyles.header}>
          <View style={drawerStyles.headerTitleRow}>
            <View style={drawerStyles.logoBox}>
              <MaterialCommunityIcons name="package-variant-closed" size={20} color="white" />
            </View>
            <Text style={drawerStyles.brandTitle}>Inventario Pro</Text>
          </View>
          <Text style={drawerStyles.brandSubtitle}>Menú principal de navegación</Text>
        </View>

        <View style={drawerStyles.userSection}>
          <View style={drawerStyles.avatar}>
            <MaterialCommunityIcons name="account" size={24} color="#305CFF" />
          </View>
          <View>
            <Text style={drawerStyles.userName}>Admin Usuario</Text>
            <Text style={drawerStyles.userEmail}>admin@empresa.com</Text>
          </View>
        </View>

        <View style={drawerStyles.menuList}>
          <DrawerMenuItem icon="home-outline" label="Cambiar Sucursal" onPress={() => props.navigation.navigate('Branches')} />
          <DrawerMenuItem icon="view-dashboard-outline" label="Dashboard" onPress={() => props.navigation.closeDrawer()} />
          <DrawerMenuItem icon="package-variant" label="Productos" />
          <DrawerMenuItem icon="swap-horizontal" label="Movimientos" />
          <DrawerMenuItem icon="bell-outline" label="Alertas" badge="2" />
          <DrawerMenuItem icon="currency-usd" label="Inventario Valorizado" />
        </View>

        <View style={drawerStyles.divider} />

        <TouchableOpacity style={drawerStyles.logoutButton} onPress={() => props.navigation.replace('Login')}>
          <MaterialCommunityIcons name="logout" size={22} color="#FF5252" />
          <Text style={drawerStyles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

const DrawerMenuItem = ({ icon, label, onPress, badge }) => (
  <TouchableOpacity style={drawerStyles.item} onPress={onPress}>
    <View style={drawerStyles.itemLeft}>
      <MaterialCommunityIcons name={icon} size={22} color="#444" />
      <Text style={drawerStyles.itemLabel}>{label}</Text>
    </View>
    {badge && (
      <View style={drawerStyles.badge}><Text style={drawerStyles.badgeText}>{badge}</Text></View>
    )}
  </TouchableOpacity>
);

/*unction DrawerNavigator() {
  return (
    <Drawer.Navigator 
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false, drawerStyle: { width: '80%' } }}
    >
      <Drawer.Screen name="DashboardMain" component={Dashboard} />
    </Drawer.Navigator>
  );
}*/

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
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
            <Text style={styles.title}>Inventario Pro</Text>
            <Text style={styles.subtitle}>
              Sistema de Gestión de Inventario
            </Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput style={styles.input} placeholder="correo@empresa.com" placeholderTextColor="#999" value={email} onChangeText={setEmail} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput style={styles.input} placeholder="........" placeholderTextColor="#999" secureTextEntry value={password} onChangeText={setPassword} />
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

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Branches" component={BranchSelection} />
        {/* Usamos el DrawerNavigator para la pantalla de Dashboard */}
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center' },
  content: { width: '100%', alignItems: 'center', paddingHorizontal: 20 },
  card: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 30, elevation: 5 },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo: { width: 100, height: 100 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
  subtitle: { fontSize: 14, color: '#666' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 8 },
  input: { backgroundColor: '#F0F2F5', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16 },
  button: { backgroundColor: '#305CFF', borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
  footerText: { color: '#666', fontSize: 14 },
  linkText: { color: '#305CFF', fontSize: 14, fontWeight: '600' },
});

const drawerStyles = StyleSheet.create({
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  logoBox: { backgroundColor: '#305CFF', padding: 6, borderRadius: 8, marginRight: 10 },
  brandTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  brandSubtitle: { fontSize: 12, color: '#888', marginTop: 4 },
  userSection: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#F8F9FA', margin: 15, borderRadius: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8EFFF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  userName: { fontWeight: 'bold', color: '#1A1A1A', fontSize: 14 },
  userEmail: { fontSize: 12, color: '#666' },
  menuList: { paddingHorizontal: 10 },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 15 },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  itemLabel: { marginLeft: 15, fontSize: 15, color: '#333', fontWeight: '500' },
  badge: { backgroundColor: '#FF5252', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 10, marginHorizontal: 20 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 15 },
  logoutText: { color: '#FF5252', marginLeft: 15, fontWeight: 'bold', fontSize: 15 }
});