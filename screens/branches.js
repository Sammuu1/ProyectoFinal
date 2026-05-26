import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
 
// ─── Branch Card ──────────────────────────────────────────────────────────────
const BranchCard = ({ branch, onPress }) => {
    const isOk = branch.status === 'OK';
 
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
            <View style={styles.leftSection}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="storefront-outline" size={28} color="#305CFF" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.branchName} numberOfLines={1}>{branch.name}</Text>
                    <Text style={styles.branchCity}>{branch.city}</Text>
                </View>
            </View>
 
            <View style={styles.rightSection}>
                <View style={[styles.badge, isOk ? styles.badgeOk : styles.badgeWarning]}>
                    <MaterialCommunityIcons
                        name={isOk ? "check-circle-outline" : "alert-circle-outline"}
                        size={16}
                        color={isOk ? "#28A745" : "#B58105"}
                    />
                    <Text style={[styles.badgeText, isOk ? styles.textOk : styles.textWarning]}>
                        {branch.status}
                    </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#CCC" />
            </View>
        </TouchableOpacity>
    );
};
 
// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function BranchSelection({ navigation }) {
    const [branches, setBranches] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(null);
 
    useEffect(() => {
        // onSnapshot gives real-time updates —
        // if you add/edit a branch in Firebase it updates instantly in the app
        const unsubscribe = onSnapshot(
            collection(db, 'sucursales'),
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setBranches(data);
                setLoading(false);
            },
            (err) => {
                console.error('Error fetching branches:', err);
                setError('No se pudieron cargar las sucursales.');
                setLoading(false);
            }
        );
 
        // Cleanup listener when screen unmounts
        return () => unsubscribe();
    }, []);
 
    const handleBranchSelect = (branch) => {
        navigation.navigate('Dashboard', {
            branchId:   branch.id,
            branchName: branch.name,
            branchCity: branch.city,
        });
    };
 
    // Loading state
    if (loading) {
        return (
            <SafeAreaView style={styles.centered}>
                <ActivityIndicator size="large" color="#305CFF" />
                <Text style={styles.loadingText}>Cargando sucursales...</Text>
            </SafeAreaView>
        );
    }
 
    // Error state
    if (error) {
        return (
            <SafeAreaView style={styles.centered}>
                <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#FF5252" />
                <Text style={styles.errorText}>{error}</Text>
            </SafeAreaView>
        );
    }
 
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Seleccionar Sucursal</Text>
                <Text style={styles.headerSubtitle}>Elige una sucursal para continuar</Text>
            </View>
 
            <FlatList
                data={branches}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <BranchCard
                        branch={item}
                        onPress={() => handleBranchSelect(item)}
                    />
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <MaterialCommunityIcons name="storefront-outline" size={48} color="#CCC" />
                        <Text style={styles.emptyText}>No hay sucursales registradas.</Text>
                    </View>
                }
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}
 
// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        gap: 12,
    },
    loadingText: { fontSize: 15, color: '#666' },
    errorText:   { fontSize: 15, color: '#FF5252', textAlign: 'center', paddingHorizontal: 30 },
    emptyText:   { fontSize: 15, color: '#9E9E9E', marginTop: 8 },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    headerTitle:    { fontSize: 26, fontWeight: 'bold', color: '#1A1A1A' },
    headerSubtitle: { fontSize: 16, color: '#666', marginTop: 4 },
    listContent:    { padding: 20 },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    leftSection:  { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconContainer: { backgroundColor: '#E8EFFF', padding: 12, borderRadius: 12, marginRight: 15 },
    textContainer: { flex: 1, paddingRight: 10 },
    branchName:   { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
    branchCity:   { fontSize: 14, color: '#777', marginTop: 2 },
    rightSection: { flexDirection: 'row', alignItems: 'center' },
    badge: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, marginRight: 10,
    },
    badgeOk:      { backgroundColor: '#E8F5E9' },
    badgeWarning: { backgroundColor: '#FFF8E1' },
    badgeText:    { fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
    textOk:       { color: '#28A745' },
    textWarning:  { color: '#B58105' },
});
 