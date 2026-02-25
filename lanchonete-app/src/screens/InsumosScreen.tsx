import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useLanchoneteStore } from '../store';
import { Insumo } from '../store/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

export default function InsumosScreen() {
    const insumos = useLanchoneteStore((state) => state.insumos);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const renderItem = ({ item }: { item: Insumo }) => {
        // Alerta visual se o estoque estiver acabando
        const rowAlertStyle = item.quantidadeEstoque < 10 ? styles.lowStock : null;

        return (
            <View style={[styles.card, rowAlertStyle]}>
                <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{item.nome}</Text>
                    <Text style={styles.cardSubtitle}>
                        Unidade: {item.unidadeMedida} | Custo: R$ {(item.custoUnitario || 0).toFixed(2)}
                    </Text>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate('InsumoForm', { insumoId: item.id })}
                    >
                        <Text style={styles.editButtonText}>Editar Insumo ✏️</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.stockBadge}>
                    <Text style={styles.stockValue}>{item.quantidadeEstoque}</Text>
                    <Text style={styles.stockLabel}>em estoque</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={insumos}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhum insumo cadastrado.</Text>
                    </View>
                }
            />

            {/* Botão flutuante para nova adição */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('InsumoForm')}
            >
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContainer: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lowStock: {
        borderLeftWidth: 4,
        borderLeftColor: '#ff5252',
    },
    cardInfo: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#666',
    },
    editButton: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 4,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 6,
    },
    editButtonText: {
        fontSize: 12,
        color: '#555',
        fontWeight: 'bold',
    },
    stockBadge: {
        backgroundColor: '#4caf50',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    stockValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    stockLabel: {
        color: '#fff',
        fontSize: 10,
        marginTop: 2,
    },
    emptyContainer: {
        padding: 30,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 30,
        backgroundColor: '#ff9800',
        borderRadius: 28,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    fabIcon: {
        fontSize: 24,
        color: 'white',
        lineHeight: 28, // Fix alinhamento vertical em algumas fontes
    }
});
