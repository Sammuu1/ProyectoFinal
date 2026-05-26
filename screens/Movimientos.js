import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    SafeAreaView, StatusBar, ScrollView, Alert,
    KeyboardAvoidingView, Platform, Modal, FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useInventario } from './Inventario';

// ─── Product Picker Modal ─────────────────────────────────────────────────────
const ProductPickerModal = ({ visible, productos, onSelect, onClose }) => (
    <Modal visible={visible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
            <View style={styles.modalSheet}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>Seleccionar producto</Text>
                <FlatList
                    data={productos}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.modalItem}
                            onPress={() => onSelect(item)}
                        >
                            <View>
                                <Text style={styles.modalItemName}>{item.nombre}</Text>
                                <Text style={styles.modalItemMeta}>{item.categoria} · Stock: {item.stock}</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={20} color="#CCC" />
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.modalDivider} />}
                />
            </View>
        </TouchableOpacity>
    </Modal>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function Movimientos({ navigation }) {
    const { productos, actualizarProducto } = useInventario();

    const [tipo, setTipo] = useState('Entrada'); // 'Entrada' | 'Salida'
    const [productoSelecto, setProductoSelecto] = useState(null);
    const [cantidad, setCantidad] = useState('');
    const [notas, setNotas] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const isEntrada = tipo === 'Entrada';

    const handleConfirmar = () => {
        if (!productoSelecto) return Alert.alert('Campo requerido', 'Selecciona un producto.');
        if (!cantidad.trim()) return Alert.alert('Campo requerido', 'Ingresa la cantidad.');

        const cant = parseInt(cantidad, 10);
        if (isNaN(cant) || cant <= 0) return Alert.alert('Cantidad inválida', 'Ingresa un número mayor a 0.');

        if (!isEntrada && cant > productoSelecto.stock) {
            return Alert.alert(
                'Stock insuficiente',
                `Solo hay ${productoSelecto.stock} unidades disponibles de ${productoSelecto.nombre}.`
            );
        }

        const nuevoStock = isEntrada
            ? productoSelecto.stock + cant
            : productoSelecto.stock - cant;

        actualizarProducto(productoSelecto.id, { stock: nuevoStock });

        Alert.alert(
            '¡Listo!',
            `${tipo} de ${cant} unidades de ${productoSelecto.nombre} registrada correctamente.`,
            [{ text: 'OK', onPress: () => navigation?.goBack() }]
        );
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Registrar Movimiento</Text>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">

                    <View style={styles.card}>

                        {/* Tipo de Movimiento toggle */}
                        <Text style={styles.label}>Tipo de Movimiento</Text>
                        <View style={styles.toggleRow}>
                            <TouchableOpacity
                                style={[styles.toggleBtn, isEntrada && styles.toggleBtnActive]}
                                onPress={() => setTipo('Entrada')}
                            >
                                {isEntrada && (
                                    <MaterialCommunityIcons name="check" size={18} color="#2E7D32" style={{ marginRight: 4 }} />
                                )}
                                <Text style={[styles.toggleText, isEntrada && styles.toggleTextActive]}>
                                    Entrada
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.toggleBtn, !isEntrada && styles.toggleBtnActiveSalida]}
                                onPress={() => setTipo('Salida')}
                            >
                                {!isEntrada && (
                                    <MaterialCommunityIcons name="check" size={18} color="#C62828" style={{ marginRight: 4 }} />
                                )}
                                <Text style={[styles.toggleText, !isEntrada && styles.toggleTextActiveSalida]}>
                                    Salida
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Producto selector */}
                        <Text style={styles.label}>Producto <Text style={styles.req}>*</Text></Text>
                        <TouchableOpacity
                            style={styles.selector}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={productoSelecto ? styles.selectorValue : styles.selectorPlaceholder}>
                                {productoSelecto ? productoSelecto.nombre : 'Seleccionar producto'}
                            </Text>
                            <MaterialCommunityIcons name="chevron-down" size={22} color="#9E9E9E" />
                        </TouchableOpacity>

                        {/* Stock hint */}
                        {productoSelecto && (
                            <View style={styles.stockHint}>
                                <MaterialCommunityIcons name="information-outline" size={15} color="#305CFF" />
                                <Text style={styles.stockHintText}>
                                    Stock actual: <Text style={{ fontWeight: '700' }}>{productoSelecto.stock}</Text> · Mín: {productoSelecto.minimo}
                                </Text>
                            </View>
                        )}

                        {/* Cantidad */}
                        <Text style={styles.label}>Cantidad <Text style={styles.req}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingresa la cantidad"
                            placeholderTextColor="#9E9E9E"
                            keyboardType="numeric"
                            value={cantidad}
                            onChangeText={setCantidad}
                        />

                        {/* Notas */}
                        <Text style={styles.label}>Notas <Text style={styles.optional}>(opcional)</Text></Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Agrega notas sobre este movimiento..."
                            placeholderTextColor="#9E9E9E"
                            multiline
                            numberOfLines={4}
                            value={notas}
                            onChangeText={setNotas}
                        />

                        {/* Confirm button */}
                        <TouchableOpacity
                            style={[styles.confirmBtn, !isEntrada && styles.confirmBtnSalida]}
                            onPress={handleConfirmar}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.confirmBtnText}>
                                Confirmar {tipo}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Info note */}
                    <View style={styles.note}>
                        <Text style={styles.noteText}>
                            <Text style={styles.noteBold}>Nota: </Text>
                            Los movimientos se registran en tiempo real y actualizan el inventario automáticamente.
                        </Text>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* Product picker modal */}
            <ProductPickerModal
                visible={modalVisible}
                productos={productos}
                onSelect={(p) => { setProductoSelecto(p); setModalVisible(false); }}
                onClose={() => setModalVisible(false)}
            />
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

    body: { padding: 16, gap: 12 },

    card: {
        backgroundColor: '#fff', borderRadius: 16, padding: 20,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
    },

    label: { fontSize: 14, fontWeight: '600', color: '#212121', marginBottom: 8, marginTop: 16 },
    req: { color: '#C62828' },
    optional: { color: '#9E9E9E', fontWeight: '400' },

    // Toggle
    toggleRow: { flexDirection: 'row', gap: 12 },
    toggleBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 14, borderRadius: 12,
        borderWidth: 1.5, borderColor: '#E0E0E0', backgroundColor: '#fff',
    },
    toggleBtnActive: {
        borderColor: '#2E7D32', backgroundColor: '#E8F5E9',
    },
    toggleBtnActiveSalida: {
        borderColor: '#C62828', backgroundColor: '#FFEBEE',
    },
    toggleText: { fontSize: 15, fontWeight: '600', color: '#9E9E9E' },
    toggleTextActive: { color: '#2E7D32' },
    toggleTextActiveSalida: { color: '#C62828' },

    // Selector
    selector: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#F5F5F5', borderRadius: 12,
        paddingHorizontal: 14, paddingVertical: 14,
        borderWidth: 1, borderColor: '#E0E0E0',
    },
    selectorPlaceholder: { fontSize: 15, color: '#9E9E9E' },
    selectorValue: { fontSize: 15, color: '#212121', fontWeight: '500' },

    stockHint: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: '#E8EFFF', borderRadius: 8,
        paddingHorizontal: 12, paddingVertical: 8, marginTop: 8,
    },
    stockHintText: { fontSize: 13, color: '#305CFF' },

    // Input
    input: {
        backgroundColor: '#F5F5F5', borderRadius: 12,
        paddingHorizontal: 14, paddingVertical: 13,
        fontSize: 15, color: '#212121',
        borderWidth: 1, borderColor: '#E0E0E0',
    },
    textArea: { minHeight: 100, textAlignVertical: 'top' },

    // Confirm button
    confirmBtn: {
        backgroundColor: '#2E7D32', borderRadius: 14,
        paddingVertical: 16, alignItems: 'center', marginTop: 24,
    },
    confirmBtnSalida: { backgroundColor: '#C62828' },
    confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

    // Note
    note: { backgroundColor: '#E3F2FD', borderRadius: 12, padding: 14 },
    noteText: { fontSize: 13, color: '#1565C0', lineHeight: 19 },
    noteBold: { fontWeight: '700' },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    modalSheet: {
        backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
        paddingTop: 12, paddingBottom: 30, maxHeight: '70%',
    },
    modalHandle: {
        width: 40, height: 4, backgroundColor: '#E0E0E0',
        borderRadius: 2, alignSelf: 'center', marginBottom: 16,
    },
    modalTitle: {
        fontSize: 17, fontWeight: '700', color: '#1A237E',
        paddingHorizontal: 20, marginBottom: 8,
    },
    modalItem: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 14,
    },
    modalItemName: { fontSize: 15, fontWeight: '600', color: '#212121' },
    modalItemMeta: { fontSize: 13, color: '#9E9E9E', marginTop: 2 },
    modalDivider: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 20 },
});