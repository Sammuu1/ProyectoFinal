import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Platform,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StatCard = ({ icon, color, value, label, fullWidth = false }) => (
    <View style={[styles.statCard, fullWidth && styles.fullWidthCard]}>
        <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
            <MaterialCommunityIcons name={icon} size={24} color={color} />
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const QuickAccessItem = ({ icon, color, title, subtitle, badge }) => (
    <TouchableOpacity style={styles.accessCard} activeOpacity={0.7}>
        <View style={styles.accessLeft}>
            <View style={[styles.accessIcon, { backgroundColor: color + '15' }]}>
                <MaterialCommunityIcons name={icon} size={26} color={color} />
            </View>
            <View>
                <Text style={styles.accessTitle}>{title}</Text>
                <Text style={styles.accessSubtitle}>{subtitle}</Text>
            </View>
        </View>
        {badge && (
            <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>{badge}</Text>
            </View>
        )}
    </TouchableOpacity>
);

export default function Dashboard({ route, navigation }) {
    const { branchName = 'Sucursal Seleccionada' } = route.params || {};

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <MaterialCommunityIcons name="menu" size={28} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.bellContainer}>
                        <MaterialCommunityIcons name="bell-outline" size={28} color="white" />
                        <View style={styles.bellBadge}>
                            <Text style={styles.bellBadgeText}>2</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Text style={styles.headerTitle}>Dashboard</Text>
                <Text style={styles.headerSubtitle}>{branchName}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.statsGrid}>
                    <StatCard
                        icon="package-variant"
                        color="#305CFF"
                        value="8"
                        label="Total Productos"
                    />
                    <StatCard
                        icon="trending-down"
                        color="#FBC02D"
                        value="2"
                        label="Stock Bajo"
                    />
                </View>

                <StatCard
                    icon="alert-circle-outline"
                    color="#FF5252"
                    value="0"
                    label="Sin Existencias"
                    fullWidth
                />

                <Text style={styles.sectionTitle}>Acceso Rápido</Text>

                <QuickAccessItem
                    icon="package-variant"
                    color="#305CFF"
                    title="Productos"
                    subtitle="Ver catálogo completo"
                />

                <QuickAccessItem
                    icon="swap-horizontal"
                    color="#4CAF50"
                    title="Movimientos"
                    subtitle="Registrar entrada/salida"
                />

                <QuickAccessItem
                    icon="bell-ring-outline"
                    color="#FF5252"
                    title="Alertas"
                    subtitle="Ver productos críticos"
                    badge="2"
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
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
    bellContainer: {
        position: 'relative',
    },
    bellBadge: {
        position: 'absolute',
        right: -2,
        top: -2,
        backgroundColor: '#FF5252',
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#305CFF',
    },
    bellBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    headerTitle: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
        marginTop: 4,
    },
    scrollContent: {
        padding: 20,
    },
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
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
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
    accessLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    accessIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    accessTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    accessSubtitle: {
        fontSize: 13,
        color: '#777',
        marginTop: 2,
    },
    notificationBadge: {
        backgroundColor: '#FF5252',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});