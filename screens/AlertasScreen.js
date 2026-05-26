import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useInventario } from './Inventario';

// ─── Alert Card ───────────────────────────────────────────────────────────────
const AlertCard = ({ item, type }) => {
    const isSinStock = type === 'sin_stock';
    const ratio = item.minimo > 0 ? Math.min(item.stock / (item.minimo * 1.5), 1) : 0;

    const config = isSinStock
        ? { border: '#EF5350', iconBg: '#FFEBEE', iconColor: '#C62828', barColor: '#EF5350' }
        : { border: '#F59E0B', iconBg: '#FFF8E1', iconColor: '#F59E0B', barColor: '#F59E0B' };

    return (
        <View style={[styles.card, { borderColor: config.border }]}>
            <View style={styles.cardTop}>
                <View style={[styles.iconBox, { backgroundColor: config.iconBg }]}>
                    <MaterialCommunityIcons
                        name={isSinStock ? 'alert-circle-outline' : 'alert-outline'}
                        size={24}
                        color={config.iconColor}
                    />
                </View>
                <View style={styles.cardInfo}>
                    <Text style={styles.cardName}>{item.nombre}</Text>
                    <View style={styles.locationRow}>
                        <MaterialCommunityIcons name="map-marker-outline" size={14} color="#9E9E9E" />
                        <Text style={styles.locationText}>Sucursal Centro</Text>
                    </View>
                </View>
            </View>

            <View style={styles.stockRow}>
                <Text style={styles.stockLabel}>
                    Stock actual: <Text style={[styles.stockValue, { color: config.iconColor }]}>{item.stock}</Text>
                </Text>
                <Text style={styles.minimoText}>Mín: {item.minimo}</Text>
            </View>

            <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${ratio * 100}%`, backgroundColor: config.barColor }]} />
            </View>
        </View>
    );
};

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon, color, label, count }) => (
    <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name={icon} size={18} color={color} />
        <Text style={[styles.sectionTitle, { color }]}>{label} ({count})</Text>
    </View>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = () => (
    <View style={styles.emptyState}>
        <MaterialCommunityIcons name="check-circle-outline" size={64} color="#4CAF50" />
        <Text style={styles.emptyTitle}>¡Todo en orden!</Text>
        <Text style={styles.emptySubtitle}>No hay alertas de inventario en este momento.</Text>
    </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AlertasScreen({ navigation }) {
    const { productos } = useInventario();

    const sinStock = productos.filter(p => p.stock === 0);
    const stockBajo = productos.filter(p => p.stock > 0 && p.stock < p.minimo);
    const totalAlertas = sinStock.length + stockBajo.length;

    // Build flat list data with section headers
    const listData = [];

    if (sinStock.length > 0) {
        listData.push({ type: 'header_sin_stock', id: 'h1', count: sinStock.length });
        sinStock.forEach(p => listData.push({ ...p, type: 'sin_stock', id: `s_${p.id}` }));
    }

    if (stockBajo.length > 0) {
        listData.push({ type: 'header_stock_bajo', id: 'h2', count: stockBajo.length });
        stockBajo.forEach(p => listData.push({ ...p, type: 'stock_bajo', id: `b_${p.id}` }));
    }

    const renderItem = ({ item }) => {
        if (item.type === 'header_sin_stock') {
            return (
                <SectionHeader
                    icon="alert-circle-outline"
                    color="#C62828"
                    label="Sin Stock"
                    count={item.count}
                />
            );
        }
        if (item.type === 'header_stock_bajo') {
            return (
                <SectionHeader
                    icon="alert-outline"
                    color="#F59E0B"
                    label="Stock Bajo"
                    count={item.count}
                />
            );
        }
        return <AlertCard item={item} type={item.type} />;
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Alertas</Text>
            </View>

            {/* Summary pills */}
            <View style={styles.summaryRow}>
                <View style={styles.pill}>
                    <View style={[styles.dot, { backgroundColor: '#EF5350' }]} />
                    <Text style={styles.pillText}>{sinStock.length} Sin stock</Text>
                </View>
                <View style={styles.pill}>
                    <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.pillText}>{stockBajo.length} Stock bajo</Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* List or empty state */}
            {totalAlertas === 0 ? (
                <EmptyState />
            ) : (
                <FlatList
                    data={listData}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F5F5F5' },

    header: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
        paddingHorizontal: 16, paddingVertical: 14,
        borderBottomWidth: 1, borderBottomColor: '#EEEEEE',
    },
    backBtn: { marginRight: 12, padding: 4 },
    backArrow: { fontSize: 22, color: '#1A237E', fontWeight: '600' },
    headerTitle: { fontSize: 22, fontWeight: '700', color: '#1A237E' },

    summaryRow: {
        flexDirection: 'row', gap: 16,
        paddingHorizontal: 16, paddingVertical: 12,
        backgroundColor: '#fff',
    },
    pill: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dot: { width: 10, height: 10, borderRadius: 5 },
    pillText: { fontSize: 14, color: '#424242', fontWeight: '500' },

    divider: { height: 1, backgroundColor: '#EEEEEE' },

    listContent: { padding: 16, gap: 12 },

    sectionHeader: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        marginTop: 8, marginBottom: 4,
    },
    sectionTitle: { fontSize: 15, fontWeight: '700' },

    card: {
        backgroundColor: '#fff', borderRadius: 14, padding: 16,
        borderWidth: 1.5,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
    },
    cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    iconBox: {
        width: 44, height: 44, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center', marginRight: 12,
    },
    cardInfo: { flex: 1 },
    cardName: { fontSize: 16, fontWeight: '700', color: '#1A237E' },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 },
    locationText: { fontSize: 13, color: '#9E9E9E' },

    stockRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    stockLabel: { fontSize: 13, color: '#616161', fontWeight: '500' },
    stockValue: { fontWeight: '700' },
    minimoText: { fontSize: 13, color: '#9E9E9E' },

    barTrack: { height: 6, backgroundColor: '#EEEEEE', borderRadius: 3, overflow: 'hidden' },
    barFill: { height: '100%', borderRadius: 3 },

    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: '#212121', marginTop: 16 },
    emptySubtitle: { fontSize: 14, color: '#9E9E9E', textAlign: 'center', marginTop: 8 },
});