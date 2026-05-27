import React, { useState, useMemo } from 'react';
import {
    View, Text, TextInput, FlatList, TouchableOpacity,
    StyleSheet, SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { useInventario } from './Inventario';

const CATEGORIAS = ['Todas', 'Masas', 'Salsas', 'Carnes', 'Lácteos'];

const STATUS_CONFIG = {
    ok: { label: 'OK', bg: '#E8F5E9', text: '#2E7D32', bar: '#4CAF50' },
    stock_bajo: { label: 'Stock Bajo', bg: '#FFF8E1', text: '#F59E0B', bar: '#F59E0B' },
    sin_stock: { label: 'Sin Stock', bg: '#FFEBEE', text: '#C62828', bar: '#EF5350' },
};

const getStatus = (stock, minimo) => {
    if (stock === 0) return 'sin_stock';
    if (stock < minimo) return 'stock_bajo';
    return 'ok';
};

const ProductCard = ({ item, onPress }) => {
    const status = getStatus(item.stock, item.minimo);
    const cfg = STATUS_CONFIG[status];
    const ratio = item.minimo > 0 ? Math.min(item.stock / (item.minimo * 1.5), 1) : 0;

    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress?.(item)} activeOpacity={0.75}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardNombre} numberOfLines={1}>{item.nombre}</Text>
                <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
                    <Text style={[styles.badgeText, { color: cfg.text }]}>{cfg.label}</Text>
                </View>
            </View>

            <View style={styles.cardMeta}>
                <Text style={styles.categoria}>{item.categoria}</Text>
                <View style={styles.stockRow}>
                    <Text style={styles.stockLabel}>Stock: </Text>
                    <Text style={styles.stockValue}>{item.stock}</Text>
                    <Text style={styles.minimoLabel}>  Min: {item.minimo}</Text>
                </View>
            </View>

            <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${ratio * 100}%`, backgroundColor: cfg.bar }]} />
            </View>
        </TouchableOpacity>
    );
};

export default function Products({ navigation, route }) {
    const { productos } = useInventario(); 
    const [search, setSearch] = useState('');
    const [categoria, setCategoria] = useState('Todas');
    const { userData } = route.params || {};
    const isAdmin = userData?.role === 'admin';

    const filtered = useMemo(() => {
        return productos.filter(p => {
            const matchCat = categoria === 'Todas' || p.categoria === categoria;
            const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase());
            return matchCat && matchSearch;
        });
    }, [productos, search, categoria]); 

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Productos</Text>
                {isAdmin && (
                    <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() =>
                            navigation?.navigate('AgregarProducto', {
                                userData,
                            })
                        }
                    >
                        <Text style={styles.addBtnText}>＋</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar producto..."
                    placeholderTextColor="#9E9E9E"
                    value={search}
                    onChangeText={setSearch}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')}>
                        <Text style={styles.clearBtn}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chipsScroll}
                contentContainerStyle={styles.chipsContent}
            >
                {CATEGORIAS.map(cat => {
                    const active = cat === categoria;
                    return (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.chip, active && styles.chipActive]}
                            onPress={() => setCategoria(cat)}
                        >
                            <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <FlatList
                data={filtered}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ProductCard
                        item={item}
                    />
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📦</Text>
                        <Text style={styles.emptyText}>No se encontraron productos</Text>
                    </View>
                }
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F5F5F5' },

    header: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
        paddingHorizontal: 16, paddingVertical: 14,
        borderBottomWidth: 1, borderBottomColor: '#EEEEEE',
    },
    backBtn: { marginRight: 12, padding: 4 },
    backArrow: { fontSize: 22, color: '#1A237E', fontWeight: '600' },
    headerTitle: { flex: 1, fontSize: 22, fontWeight: '700', color: '#1A237E' },
    addBtn: {
        backgroundColor: '#2E7D32', width: 36, height: 36,
        borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    },
    addBtnText: { color: '#fff', fontSize: 22, lineHeight: 26 },

    searchContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEEEEE',
        marginHorizontal: 16, marginTop: 14, marginBottom: 10,
        borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
    },
    searchIcon: { fontSize: 16, marginRight: 8 },
    searchInput: { flex: 1, fontSize: 15, color: '#212121' },
    clearBtn: { fontSize: 14, color: '#9E9E9E', paddingLeft: 8 },

    chipsScroll: { flexGrow: 0, marginBottom: 8 },
    chipsContent: { paddingHorizontal: 16, gap: 8 },
    chip: {
        paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
        backgroundColor: '#fff', borderWidth: 1, borderColor: '#E0E0E0',
    },
    chipActive: { backgroundColor: '#2E7D32', borderColor: '#2E7D32' },
    chipText: { fontSize: 13, fontWeight: '500', color: '#616161' },
    chipTextActive: { color: '#fff' },

    listContent: { paddingHorizontal: 16, paddingBottom: 24, gap: 12 },

    card: {
        backgroundColor: '#fff', borderRadius: 14, padding: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 4,
    },
    cardNombre: { flex: 1, fontSize: 16, fontWeight: '700', color: '#1A237E', marginRight: 8 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    badgeText: { fontSize: 12, fontWeight: '600' },
    cardMeta: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 10,
    },
    categoria: { fontSize: 13, color: '#757575' },
    stockRow: { flexDirection: 'row', alignItems: 'baseline' },
    stockLabel: { fontSize: 13, color: '#757575' },
    stockValue: { fontSize: 13, fontWeight: '700', color: '#212121' },
    minimoLabel: { fontSize: 13, color: '#9E9E9E' },

    barTrack: { height: 6, backgroundColor: '#EEEEEE', borderRadius: 3, overflow: 'hidden' },
    barFill: { height: '100%', borderRadius: 3 },

    emptyState: { alignItems: 'center', marginTop: 60 },
    emptyIcon: { fontSize: 48, marginBottom: 12 },
    emptyText: { fontSize: 15, color: '#9E9E9E' },
});