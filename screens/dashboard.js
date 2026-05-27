import React, { useEffect, useMemo, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Platform,
    SafeAreaView,
    StatusBar,
    Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useInventario } from './Inventario';

const StatCard = ({ icon, color, value, label, fullWidth = false }) => (
    <View style={[styles.statCard, fullWidth && styles.fullWidthCard]}>
        <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
            <MaterialCommunityIcons name={icon} size={24} color={color} />
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const QuickAccessItem = ({ icon, color, title, subtitle, badge, onPress }) => (
    <TouchableOpacity style={styles.accessCard} activeOpacity={0.7} onPress={onPress}>
        <View style={styles.accessLeft}>
            <View style={[styles.accessIcon, { backgroundColor: color + '15' }]}>
                <MaterialCommunityIcons name={icon} size={26} color={color} />
            </View>
            <View>
                <Text style={styles.accessTitle}>{title}</Text>
                <Text style={styles.accessSubtitle}>{subtitle}</Text>
            </View>
        </View>

        {badge > 0 && (
            <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>{badge}</Text>
            </View>
        )}
    </TouchableOpacity>
);

export default function Dashboard({ route, navigation }) {
    const { branchId, branchName, userData } = route.params || {};
    const { productos, setSucursalId } = useInventario();

    const [nombreSucursal, setNombreSucursal] = useState(branchName || 'Sucursal');
    const [menuVisible, setMenuVisible] = useState(false);

    const isAdmin = userData?.role === 'admin';

    useEffect(() => {
        if (branchId) {
            setSucursalId(branchId);
        }
    }, [branchId]);

    useEffect(() => {
        const cargarSucursal = async () => {
            if (!branchId) return;

            try {
                const sucursalRef = doc(db, 'sucursales', branchId);
                const sucursalSnap = await getDoc(sucursalRef);

                if (sucursalSnap.exists()) {
                    const data = sucursalSnap.data();
                    setNombreSucursal(data.name || data.nombre || branchName || 'Sucursal');
                }
            } catch (error) {
                console.log('Error cargando sucursal:', error);
            }
        };

        cargarSucursal();
    }, [branchId]);

    const totalProductos = productos.length;

    const stockBajo = useMemo(() => {
        return productos.filter(
            p => Number(p.stock) > 0 && Number(p.stock) < Number(p.minimo)
        ).length;
    }, [productos]);

    const sinExistencias = useMemo(() => {
        return productos.filter(p => Number(p.stock) === 0).length;
    }, [productos]);

    const totalAlertas = stockBajo + sinExistencias;

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setMenuVisible(false);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.log('Logout error:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <Modal visible={menuVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.sideMenu}>
                        <View style={styles.menuHeader}>
                            <View style={styles.menuBrandRow}>
                                <View style={styles.logoBox}>
                                    <MaterialCommunityIcons name="package-variant-closed" size={28} color="white" />
                                </View>

                                <View>
                                    <Text style={styles.menuTitle}>Vault</Text>
                                    <Text style={styles.menuSubtitle}>Menú principal</Text>
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => setMenuVisible(false)}>
                                <MaterialCommunityIcons name="close" size={28} color="#1A1A1A" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.userCard}>
                            <View style={styles.userIconBox}>
                                <MaterialCommunityIcons name="account-outline" size={28} color="#305CFF" />
                            </View>

                            <View>
                                <Text style={styles.userName}>{userData?.nombre || 'Usuario'}</Text>
                                <Text style={styles.userEmail}>{userData?.email || 'usuario@empresa.com'}</Text>
                            </View>
                        </View>

                        <View style={styles.menuSection}>
                            {isAdmin && (
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={() => {
                                        setMenuVisible(false);
                                        navigation.navigate('Branches', { userData });
                                    }}
                                >
                                    <MaterialCommunityIcons name="storefront-outline" size={25} color="#344054" />
                                    <Text style={styles.menuItemText}>Cambiar Sucursal</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={[styles.menuItem, styles.menuItemActive]}
                                onPress={() => setMenuVisible(false)}
                            >
                                <MaterialCommunityIcons name="view-dashboard-outline" size={25} color="#344054" />
                                <Text style={styles.menuItemText}>Dashboard</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    setMenuVisible(false);
                                    navigation.navigate('Productos', {
                                        branchId,
                                        branchName: nombreSucursal,
                                        userData,
                                    });
                                }}
                            >
                                <MaterialCommunityIcons name="package-variant" size={25} color="#344054" />
                                <Text style={styles.menuItemText}>Productos</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    setMenuVisible(false);
                                    navigation.navigate('Movimientos', {
                                        branchId,
                                        branchName: nombreSucursal,
                                        userData,
                                    });
                                }}
                            >
                                <MaterialCommunityIcons name="swap-horizontal" size={25} color="#344054" />
                                <Text style={styles.menuItemText}>Movimientos</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    setMenuVisible(false);
                                    navigation.navigate('Alertas', {
                                        branchId,
                                        branchName: nombreSucursal,
                                        userData,
                                    });
                                }}
                            >
                                <MaterialCommunityIcons name="bell-outline" size={25} color="#344054" />
                                <Text style={styles.menuItemText}>Alertas</Text>
                            </TouchableOpacity>

                            {isAdmin && (
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={() => {
                                        setMenuVisible(false);
                                        navigation.navigate('InventarioValor', {
                                            branchId,
                                            branchName: nombreSucursal,
                                            userData,
                                        });
                                    }}
                                >
                                    <MaterialCommunityIcons name="currency-usd" size={25} color="#344054" />
                                    <Text style={styles.menuItemText}>Inventario Valorizado</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <MaterialCommunityIcons name="logout" size={25} color="#E50914" />
                            <Text style={styles.logoutText}>Cerrar Sesión</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => setMenuVisible(true)}>
                        <MaterialCommunityIcons name="menu" size={30} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.bellContainer}
                        onPress={() => navigation.navigate('Alertas', { branchId, branchName: nombreSucursal, userData })}
                    >
                        <MaterialCommunityIcons name="bell-outline" size={28} color="white" />

                        {totalAlertas > 0 && (
                            <View style={styles.bellBadge}>
                                <Text style={styles.bellBadgeText}>{totalAlertas}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <Text style={styles.headerTitle}>{nombreSucursal}</Text>
                <Text style={styles.headerSubtitle}>Dashboard de inventario</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.statsGrid}>
                    <StatCard
                        icon="package-variant"
                        color="#305CFF"
                        value={totalProductos}
                        label="Total Productos"
                    />
                    <StatCard
                        icon="trending-down"
                        color="#FBC02D"
                        value={stockBajo}
                        label="Stock Bajo"
                    />
                </View>

                <StatCard
                    icon="alert-circle-outline"
                    color="#FF5252"
                    value={sinExistencias}
                    label="Sin Existencias"
                    fullWidth
                />

                <Text style={styles.sectionTitle}>Acceso Rápido</Text>

                <QuickAccessItem
                    icon="package-variant"
                    color="#305CFF"
                    title="Productos"
                    subtitle="Ver catálogo completo"
                    onPress={() => navigation.navigate('Productos', { branchId, branchName: nombreSucursal, userData })}
                />

                <QuickAccessItem
                    icon="swap-horizontal"
                    color="#4CAF50"
                    title="Movimientos"
                    subtitle="Registrar entrada/salida"
                    onPress={() => navigation.navigate('Movimientos', { branchId, branchName: nombreSucursal, userData })}
                />

                <QuickAccessItem
                    icon="bell-ring-outline"
                    color="#FF5252"
                    title="Alertas"
                    subtitle="Ver productos críticos"
                    badge={totalAlertas}
                    onPress={() => navigation.navigate('Alertas', { branchId, branchName: nombreSucursal, userData })}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: {
        backgroundColor: '#305CFF',
        paddingHorizontal: 20,
        paddingBottom: 30,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    bellContainer: { position: 'relative' },
    bellBadge: {
        position: 'absolute',
        right: -2,
        top: -2,
        backgroundColor: '#FF5252',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#305CFF',
        paddingHorizontal: 3,
    },
    bellBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
    headerTitle: { color: 'white', fontSize: 28, fontWeight: 'bold' },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
        marginTop: 4,
    },
    scrollContent: { padding: 20 },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        width: '48%',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    fullWidthCard: {
        width: '100%',
        flexDirection: 'column',
        marginBottom: 25,
    },
    iconBox: {
        width: 45,
        height: 45,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
    statLabel: { fontSize: 14, color: '#666', marginTop: 2 },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 15,
    },
    accessCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    accessLeft: { flexDirection: 'row', alignItems: 'center' },
    accessIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    accessTitle: { fontSize: 17, fontWeight: 'bold', color: '#1A1A1A' },
    accessSubtitle: { fontSize: 13, color: '#777', marginTop: 2 },
    notificationBadge: {
        backgroundColor: '#FF5252',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.38)',
        flexDirection: 'row',
    },
    sideMenu: {
        width: '78%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        paddingTop: 55,
        paddingHorizontal: 22,
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    menuBrandRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    logoBox: {
        width: 56,
        height: 56,
        borderRadius: 14,
        backgroundColor: '#305CFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    menuTitle: { fontSize: 27, fontWeight: 'bold', color: '#111827' },
    menuSubtitle: { fontSize: 15, color: '#6B7280', marginTop: 4 },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 18,
        padding: 16,
        marginBottom: 24,
    },
    userIconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E8EFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    userName: { fontSize: 17, fontWeight: 'bold', color: '#111827' },
    userEmail: { fontSize: 14, color: '#6B7280', marginTop: 3 },
    menuSection: { gap: 6 },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 14,
        borderRadius: 14,
    },
    menuItemActive: { backgroundColor: '#F1F3F7' },
    menuItemText: {
        fontSize: 17,
        fontWeight: '600',
        marginLeft: 16,
        color: '#344054',
    },
    logoutButton: {
        position: 'absolute',
        bottom: 45,
        left: 22,
        right: 22,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 22,
    },
    logoutText: {
        marginLeft: 16,
        fontSize: 17,
        fontWeight: 'bold',
        color: '#E50914',
    },
});