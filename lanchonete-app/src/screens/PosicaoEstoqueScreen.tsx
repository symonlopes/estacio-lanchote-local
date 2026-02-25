import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLanchoneteStore } from '../store';
import { Insumo } from '../store/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PosicaoEstoqueScreen() {
    const insumos = useLanchoneteStore((state) => state.insumos);
    const insets = useSafeAreaInsets();

    // Filtra apenas insumos que têm o estoque menor do que a quantidadeMínima exigida
    const itensEstoqueBaixo = insumos.filter(insumo => {
        const minimo = insumo.quantidadeMinima || 0;
        return insumo.quantidadeEstoque < minimo;
    });

    const renderItem = ({ item }: { item: Insumo }) => {
        const minimo = item.quantidadeMinima || 0;
        const faltam = minimo - item.quantidadeEstoque;

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>⚠️ {item.nome}</Text>
                    <Text style={styles.cardBadge}>Repor!</Text>
                </View>

                <View style={styles.cardBody}>
                    <View style={styles.infoCol}>
                        <Text style={styles.infoLabel}>Atual</Text>
                        <Text style={[styles.infoValue, { color: '#d32f2f' }]}>{item.quantidadeEstoque.toFixed(2)} {item.unidadeMedida}</Text>
                    </View>
                    <View style={styles.infoCol}>
                        <Text style={styles.infoLabel}>Mínimo</Text>
                        <Text style={styles.infoValue}>{minimo.toFixed(2)} {item.unidadeMedida}</Text>
                    </View>
                    <View style={styles.infoCol}>
                        <Text style={styles.infoLabel}>Comprar / Repor</Text>
                        <Text style={[styles.infoValue, { color: '#f57c00' }]}>+{faltam.toFixed(2)} {item.unidadeMedida}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerBox}>
                <Text style={styles.headerTitle}>Alerta de Reposição</Text>
                <Text style={styles.headerSubtitle}>
                    {itensEstoqueBaixo.length} insumos ou produtos abaixo da quantidade mínima configurada.
                </Text>
            </View>

            <FlatList
                data={itensEstoqueBaixo}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={[styles.listContainer, { paddingBottom: Math.max(20, insets.bottom + 10) }]}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>✅</Text>
                        <Text style={styles.emptyText}>Tudo certo!</Text>
                        <Text style={styles.emptySubText}>Nenhum produto encontra-se abaixo do estoque mínimo definido.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5' },
    headerBox: {
        backgroundColor: '#d32f2f', // Cor de alerta vermelho
        padding: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        marginBottom: 16,
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
    headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.9)' },
    listContainer: { paddingHorizontal: 16, paddingBottom: 20 },

    card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2, borderLeftWidth: 4, borderLeftColor: '#d32f2f' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    cardBadge: { fontSize: 11, fontWeight: 'bold', color: '#d32f2f', backgroundColor: '#ffebeel', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },

    cardBody: { flexDirection: 'row', justifyContent: 'space-between' },
    infoCol: { alignItems: 'center' },
    infoLabel: { fontSize: 12, color: '#777', marginBottom: 4 },
    infoValue: { fontSize: 14, fontWeight: 'bold', color: '#333' },

    emptyContainer: { padding: 40, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
    emptyIcon: { fontSize: 60, marginBottom: 16 },
    emptyText: { color: '#333', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    emptySubText: { color: '#666', fontSize: 14, textAlign: 'center' }
});
