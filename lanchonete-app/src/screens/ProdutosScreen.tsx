import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useLanchoneteStore } from '../store';
import { Produto } from '../store/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

export default function ProdutosScreen() {
    const produtos = useLanchoneteStore((state) => state.produtos);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const renderItem = ({ item }: { item: Produto }) => {
        return (
            <View style={styles.card}>
                <View style={styles.iconPlaceholder}>
                    <Text style={styles.iconText}>{item.icone || '🍔'}</Text>
                </View>
                <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{item.nome}</Text>
                    <Text style={styles.cardSubtitle}>
                        {item.categoria || 'Sem categoria'} | {item.fichaTecnica.length} ingredientes
                    </Text>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate('ProdutoForm', { produtoId: item.id })}
                    >
                        <Text style={styles.editButtonText}>Editar Receita ✏️</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.priceBadge}>
                    <Text style={styles.priceValue}>R$ {item.precoVenda.toFixed(2)}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={produtos}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhum produto (lanche) cadastrado no cardápio.</Text>
                    </View>
                }
            />

            {/* Botão flutuante para adição */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('ProdutoForm')}
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
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff3e0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    iconText: {
        fontSize: 24,
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
        marginBottom: 8,
    },
    editButton: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 4,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#ddd'
    },
    editButtonText: {
        fontSize: 12,
        color: '#555',
        fontWeight: 'bold',
    },
    priceBadge: {
        backgroundColor: '#ff9800',
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    priceValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyContainer: {
        padding: 30,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 16,
        textAlign: 'center',
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
        lineHeight: 28,
    }
});
