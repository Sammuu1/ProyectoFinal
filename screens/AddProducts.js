import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    SafeAreaView, StatusBar, ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useInventario } from './Inventario';

const CATEGORIAS = ['Masas', 'Salsas', 'Carnes', 'Lácteos', 'Bebidas', 'Otros'];

export default function AddProducts({ navigation }) {
    const { agregarProducto } = useInventario();

    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState('');
    const [stock, setStock] = useState('');
    const [minimo, setMinimo] = useState('');

    const handleGuardar = () => {
        if (!nombre.trim()) return Alert.alert('Campo requerido', 'Ingresa el nombre del producto.');
        if (!categoria) return Alert.alert('Campo requerido', 'Selecciona una categoría.');
        if (!stock.trim()) return Alert.alert('Campo requerido', 'Ingresa el stock inicial.');
        if (!minimo.trim()) return Alert.alert('Campo requerido', 'Ingresa el stock mínimo.');

        agregarProducto({
            nombre: nombre.trim(),
            categoria,
            stock: parseInt(stock, 10),
            minimo: parseInt(minimo, 10),
        });

        navigation?.goBack(); // Productos re-renders automatically ✓
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Agregar Producto</Text>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">

                    {/* Nombre */}
                    <Text style={styles.label}>Nombre del producto <Text style={styles.req}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej. Salsa de tomate"
                        placeholderTextColor="#9E9E9E"
                        value={nombre}
                        onChangeText={setNombre}
                    />

                    {/* Categoría */}
                    <Text style={styles.label}>Categoría <Text style={styles.req}>*</Text></Text>
                    <View style={styles.chipsWrap}>
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
                    </View>

                    {/* Stock inicial + Mínimo side by side */}
                    <View style={styles.row}>
                        <View style={styles.halfField}>
                            <Text style={styles.label}>Stock inicial <Text style={styles.req}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                placeholderTextColor="#9E9E9E"
                                keyboardType="numeric"
                                value={stock}
                                onChangeText={setStock}
                            />
                        </View>
                        <View style={styles.halfField}>
                            <Text style={styles.label}>Stock mínimo <Text style={styles.req}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                placeholderTextColor="#9E9E9E"
                                keyboardType="numeric"
                                value={minimo}
                                onChangeText={setMinimo}
                            />
                        </View>
                    </View>

                    {/* Info note */}
                    <View style={styles.note}>
                        <Text style={styles.noteText}>
                            <Text style={styles.noteBold}>Nota: </Text>
                            El producto aparecerá de inmediato en tu inventario.
                        </Text>
                    </View>

                    {/* Save button */}
                    <TouchableOpacity style={styles.saveBtn} onPress={handleGuardar} activeOpacity={0.85}>
                        <Text style={styles.saveBtnText}>Guardar Producto</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
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

    body: { padding: 16, gap: 4 },

    label: { fontSize: 14, fontWeight: '600', color: '#212121', marginTop: 16, marginBottom: 6 },
    req: { color: '#C62828' },

    input: {
        backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
        fontSize: 15, color: '#212121',
        borderWidth: 1, borderColor: '#E0E0E0',
    },

    chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
        backgroundColor: '#fff', borderWidth: 1, borderColor: '#E0E0E0',
    },
    chipActive: { backgroundColor: '#2E7D32', borderColor: '#2E7D32' },
    chipText: { fontSize: 13, fontWeight: '500', color: '#616161' },
    chipTextActive: { color: '#fff' },

    row: { flexDirection: 'row', gap: 12 },
    halfField: { flex: 1 },

    note: {
        backgroundColor: '#E3F2FD', borderRadius: 12,
        padding: 14, marginTop: 24,
    },
    noteText: { fontSize: 13, color: '#1565C0', lineHeight: 19 },
    noteBold: { fontWeight: '700' },

    saveBtn: {
        backgroundColor: '#2E7D32', borderRadius: 14,
        paddingVertical: 16, alignItems: 'center', marginTop: 16,
    },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});