import React, { useState, useMemo } from 'react';
import {
    View, Text, TextInput, FlatList, TouchableOpacity,
    StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useInventario } from './Inventario';

const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;

const pct = (margen, costoTotal) => {
    if (!costoTotal || costoTotal === 0) return '0.0';
    return ((margen / costoTotal) * 100).toFixed(1);
};

const ProductCard = ({ item }) => {
    const stock = Number(item.stock || 0);
    const minimo = Number(item.minimo || 0);
    const costoUnitario = Number(item.costoUnitario || 0);
    const precioVenta = Number(item.precioVenta || 0);

    const costoTotal = costoUnitario * stock;
    const ventaTotal = precioVenta * stock;
    const margen = ventaTotal - costoTotal;
    const margenPct = pct(margen, costoTotal);

    return (
        <View style={styles.card}>
            <Text style={styles.cardNombre}>{item.nombre}</Text>

            {item.descripcion ? (
                <Text style={styles.cardDesc}>{item.descripcion}</Text>
            ) : null}

            <View style={styles.metaRow}>
                {item.sku ? <Text style={styles.metaText}>SKU: {item.sku}</Text> : null}
                {item.sku ? <Text style={styles.metaDot}>•</Text> : null}
                <Text style={styles.metaText}>{item.categoria || 'Sin categoría'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.stockGrid}>
                <View style={styles.stockBox}>
                    <Text style={styles.stockBoxLabel}>Stock Actual</Text>
                    <Text style={styles.stockBoxValue}>{stock} unidades</Text>
                </View>

                <View style={styles.stockBox}>
                    <Text style={styles.stockBoxLabel}>Stock Mínimo</Text>
                    <Text style={styles.stockBoxValue}>{minimo} unidades</Text>
                </View>
            </View>

            <View style={styles.priceGrid}>
                <View style={[styles.priceBox, styles.priceBoxCosto]}>
                    <Text style={styles.priceLabel}>Costo Unitario</Text>
                    <Text style={styles.priceCosto}>{fmt(costoUnitario)}</Text>
                </View>

                <View style={[styles.priceBox, styles.priceBoxVenta]}>
                    <Text style={styles.priceLabel}>Precio Venta</Text>
                    <Text style={styles.precioVenta}>{fmt(precioVenta)}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Valor en Stock (Costo):</Text>
                <Text style={styles.totalCosto}>{fmt(costoTotal)}</Text>
            </View>

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Valor en Stock (Venta):</Text>
                <Text style={styles.totalVenta}>{fmt(ventaTotal)}</Text>
            </View>

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Margen Potencial:</Text>
                <Text style={styles.totalMargen}>{fmt(margen)} ({margenPct}%)</Text>
            </View>
        </View>
    );
};

export default function InventarioValor({ navigation }) {
    const { productos } = useInventario();
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const q = search.toLowerCase();

        return productos.filter(p =>
            p.nombre?.toLowerCase().includes(q) ||
            p.sku?.toLowerCase().includes(q) ||
            p.categoria?.toLowerCase().includes(q)
        );
    }, [productos, search]);

    const totales = useMemo(() => {
        return filtered.reduce((acc, p) => {
            const stock = Number(p.stock || 0);
            const costoUnitario = Number(p.costoUnitario || 0);
            const precioVenta = Number(p.precioVenta || 0);

            acc.costo += costoUnitario * stock;
            acc.venta += precioVenta * stock;

            return acc;
        }, { costo: 0, venta: 0 });
    }, [filtered]);

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>

                <View>
                    <Text style={styles.headerTitle}>Inventario Valorizado</Text>
                    <Text style={styles.headerSub}>{filtered.length} productos</Text>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <MaterialCommunityIcons
                    name="magnify"
                    size={20}
                    color="#9E9E9E"
                    style={{ marginRight: 8 }}
                />

                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por nombre, SKU o categoría..."
                    placeholderTextColor="#9E9E9E"
                    value={search}
                    onChangeText={setSearch}
                />

                {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')}>
                        <MaterialCommunityIcons name="close" size={18} color="#9E9E9E" />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.totalesRow}>
                <View style={[styles.totalesCard, styles.totalesCardCosto]}>
                    <Text style={styles.totalesLabel}>Valor Total (Costo)</Text>
                    <Text style={styles.totalesCosto}>{fmt(totales.costo)}</Text>
                </View>

                <View style={[styles.totalesCard, styles.totalesCardVenta]}>
                    <Text style={styles.totalesLabel}>Valor Total (Venta)</Text>
                    <Text style={styles.totalesVenta}>{fmt(totales.venta)}</Text>
                </View>
            </View>

            <View style={styles.listDivider} />

            <FlatList
                data={filtered}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <ProductCard item={item} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons
                            name="package-variant-closed"
                            size={48}
                            color="#CCC"
                        />
                        <Text style={styles.emptyText}>No se encontraron productos</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F5F5F5' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        gap: 12,
    },
    backBtn: { padding: 4 },
    backArrow: { fontSize: 22, color: '#1A237E', fontWeight: '600' },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#1A237E' },
    headerSub: { fontSize: 13, color: '#9E9E9E', marginTop: 1 },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEEEEE',
        marginHorizontal: 16,
        marginTop: 14,
        marginBottom: 12,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    searchInput: { flex: 1, fontSize: 14, color: '#212121' },

    totalesRow: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    totalesCard: {
        flex: 1,
        borderRadius: 14,
        padding: 14,
    },
    totalesCardCosto: { backgroundColor: '#EEF2FF' },
    totalesCardVenta: { backgroundColor: '#F0FFF4' },
    totalesLabel: { fontSize: 13, color: '#616161', marginBottom: 4 },
    totalesCosto: { fontSize: 22, fontWeight: '700', color: '#305CFF' },
    totalesVenta: { fontSize: 22, fontWeight: '700', color: '#2E7D32' },

    listDivider: { height: 1, backgroundColor: '#E0E0E0', marginBottom: 4 },
    listContent: { padding: 16, gap: 14 },

    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    cardNombre: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A237E',
        marginBottom: 2,
    },
    cardDesc: {
        fontSize: 13,
        color: '#757575',
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    metaText: { fontSize: 13, color: '#9E9E9E' },
    metaDot: { fontSize: 13, color: '#BDBDBD' },

    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },

    stockGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
    stockBox: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        borderRadius: 10,
        padding: 12,
    },
    stockBoxLabel: { fontSize: 12, color: '#9E9E9E', marginBottom: 4 },
    stockBoxValue: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },

    priceGrid: { flexDirection: 'row', gap: 12 },
    priceBox: {
        flex: 1,
        borderRadius: 10,
        padding: 12,
        borderWidth: 1.5,
    },
    priceBoxCosto: { borderColor: '#305CFF', backgroundColor: '#F5F8FF' },
    priceBoxVenta: { borderColor: '#2E7D32', backgroundColor: '#F0FFF4' },
    priceLabel: { fontSize: 12, color: '#9E9E9E', marginBottom: 4 },
    priceCosto: { fontSize: 18, fontWeight: '700', color: '#305CFF' },
    precioVenta: { fontSize: 18, fontWeight: '700', color: '#2E7D32' },

    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    totalLabel: { fontSize: 14, color: '#616161' },
    totalCosto: { fontSize: 14, fontWeight: '700', color: '#305CFF' },
    totalVenta: { fontSize: 14, fontWeight: '700', color: '#2E7D32' },
    totalMargen: { fontSize: 14, fontWeight: '700', color: '#7B1FA2' },

    emptyState: { alignItems: 'center', marginTop: 60, gap: 12 },
    emptyText: { fontSize: 15, color: '#9E9E9E' },
});