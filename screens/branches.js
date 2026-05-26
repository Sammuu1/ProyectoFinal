import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BRANCHES = [
    { id: '1', name: 'Sucursal Centro', city: 'Ciudad de México', status: 'OK' },
    { id: '2', name: 'Sucursal Norte', city: 'Monterrey', status: 'Stock Bajo' },
    { id: '3', name: 'CEDIS - Centro de Distribución', city: 'Guadalajara', status: 'OK' },
    { id: '4', name: 'Sucursal Sur', city: 'Puebla', status: 'OK' },
    { id: '5', name: 'Sucursal Oeste', city: 'Querétaro', status: 'Stock Bajo' },
];

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

export default function BranchSelection({ navigation }) {
    const handleBranchSelect = (branch) => {
        // Pass the full branch object to Dashboard
        // When you connect your DB, Dashboard will use branchId to fetch the right data
        navigation.navigate('Dashboard', {
            branchId:   branch.id,
            branchName: branch.name,
            branchCity: branch.city,
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Seleccionar Sucursal</Text>
                <Text style={styles.headerSubtitle}>Elige una sucursal para continuar</Text>
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
                {BRANCHES.map((branch) => (
                    <BranchCard
                        key={branch.id}
                        branch={branch}
                        onPress={() => handleBranchSelect(branch)}
                    />
                ))}
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
        paddingHorizontal: 20,
        paddingVertical: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    listContent: {
        padding: 20,
    },
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
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        backgroundColor: '#E8EFFF',
        padding: 12,
        borderRadius: 12,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
        paddingRight: 10,
    },
    branchName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    branchCity: {
        fontSize: 14,
        color: '#777',
        marginTop: 2,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        marginRight: 10,
    },
    badgeOk: {
        backgroundColor: '#E8F5E9',
    },
    badgeWarning: {
        backgroundColor: '#FFF8E1',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    textOk: {
        color: '#28A745',
    },
    textWarning: {
        color: '#B58105',
    },
});