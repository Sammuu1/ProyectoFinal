import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CustomDrawer(props) {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.header}>
                    <View style={styles.headerTitleRow}>
                        <View style={styles.logoBox}>
                            <MaterialCommunityIcons name="package-variant-closed" size={24} color="white" />
                        </View>
                        <Text style={styles.brandTitle}>Inventario Pro</Text>
                    </View>
                    <Text style={styles.brandSubtitle}>Menú principal de navegación</Text>
                </View>

                <View style={styles.userSection}>
                    <View style={styles.avatar}>
                        <MaterialCommunityIcons name="account" size={24} color="#305CFF" />
                    </View>
                    <View>
                        <Text style={styles.userName}>Admin Usuario</Text>
                        <Text style={styles.userEmail}>admin@empresa.com</Text>
                    </View>
                </View>

                <View style={styles.drawerItems}>
                    <DrawerItem icon="store-outline" label="Cambiar Sucursal" onPress={() => props.navigation.navigate('Branches')} />
                    <DrawerItem icon="view-dashboard-outline" label="Dashboard" onPress={() => props.navigation.navigate('DashboardMain')} />
                    <DrawerItem icon="package-variant" label="Productos" />
                    <DrawerItem icon="swap-horizontal" label="Movimientos" />
                    <DrawerItem icon="bell-outline" label="Alertas" badge="2" />
                    <DrawerItem icon="currency-usd" label="Inventario Valorizado" />
                </View>

                <View style={styles.divider} />

                <TouchableOpacity style={styles.logoutButton} onPress={() => props.navigation.replace('Login')}>
                    <MaterialCommunityIcons name="logout" size={22} color="#FF5252" />
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </DrawerContentScrollView>
        </SafeAreaView>
    );
}

const DrawerItem = ({ icon, label, onPress, badge }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
        <View style={styles.itemLeft}>
            <MaterialCommunityIcons name={icon} size={22} color="#444" />
            <Text style={styles.itemLabel}>{label}</Text>
        </View>
        {badge && (
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
            </View>
        )}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
    logoBox: { backgroundColor: '#305CFF', padding: 5, borderRadius: 8, marginRight: 10 },
    brandTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
    brandSubtitle: { fontSize: 13, color: '#888', marginTop: 5 },
    userSection: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#F8F9FA', margin: 10, borderRadius: 12 },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8EFFF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    userName: { fontWeight: 'bold', color: '#1A1A1A' },
    userEmail: { fontSize: 12, color: '#666' },
    drawerItems: { paddingHorizontal: 10, marginTop: 10 },
    item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 15 },
    itemLeft: { flexDirection: 'row', alignItems: 'center' },
    itemLabel: { marginLeft: 15, fontSize: 15, color: '#333', fontWeight: '500' },
    badge: { backgroundColor: '#FF5252', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
    badgeText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 10 },
    logoutButton: { flexDirection: 'row', alignItems: 'center', padding: 25 },
    logoutText: { color: '#FF5252', marginLeft: 15, fontWeight: 'bold', fontSize: 15 }
});