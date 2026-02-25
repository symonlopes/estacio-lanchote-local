import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLanchoneteStore } from '../store';
import { Venda } from '../store/types';

export default function RelatoriosScreen() {
    const vendas = useLanchoneteStore((state) => state.vendas);

    const totalVendido = vendas.reduce((acc, venda) => acc + venda.valorTotal, 0);
    const totalLanches = vendas.reduce((acc, venda) =>
        acc + venda.itens.reduce((sum, item) => sum + item.quantidadeVendida, 0)
        , 0);

    const renderVenda = ({ item }: { item: Venda }) => {
        const dataHoraFormatada = new Date(item.dataHora).toLocaleString('pt-BR');

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardDate}>{dataHoraFormatada}</Text>
                    <Text style={styles.cardMethod}>{item.formaPagamento}</Text>
                </View>
                <Text style={styles.cardItems}>
                    {item.itens.reduce((sum, i) => sum + i.quantidadeVendida, 0)} itens vendidos
                </Text>
                <Text style={styles.cardTotal}>R$ {item.valorTotal.toFixed(2)}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Resumo Financeiro */}
            <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>Relatório Geral (Sessão Atual)</Text>
                <View style={styles.summaryHighlightRow}>
                    <View style={styles.summaryHighlightCol}>
                        <Text style={styles.summaryHighlightLabel}>Total Faturado</Text>
                        <Text style={styles.summaryHighlightValue}>R$ {totalVendido.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryHighlightCol}>
                        <Text style={styles.summaryHighlightLabel}>Produtos Vendidos</Text>
                        <Text style={styles.summaryHighlightValue}>{totalLanches} un</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.listTitle}>Histórico de Vendas</Text>

            {/* Lista de Vendas Passadas */}
            <FlatList
                data={vendas}
                keyExtractor={(item) => item.id}
                renderItem={renderVenda}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhuma venda registrada até o momento.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5' },

    summaryBox: {
        backgroundColor: '#ff9800',
        padding: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        marginBottom: 16,
    },
    summaryTitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 16, textAlign: 'center' },
    summaryHighlightRow: { flexDirection: 'row', justifyContent: 'space-around' },
    summaryHighlightCol: { alignItems: 'center' },
    summaryHighlightLabel: { fontSize: 12, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', marginBottom: 4 },
    summaryHighlightValue: { fontSize: 24, fontWeight: 'bold', color: '#fff' },

    listTitle: { fontSize: 16, fontWeight: 'bold', color: '#555', marginLeft: 16, marginBottom: 8 },
    listContainer: { paddingHorizontal: 16, paddingBottom: 20 },

    card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8, marginBottom: 8 },
    cardDate: { fontSize: 13, color: '#666', fontWeight: '500' },
    cardMethod: { fontSize: 12, color: '#ffa000', fontWeight: 'bold', backgroundColor: '#fff3e0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    cardItems: { fontSize: 14, color: '#444', marginBottom: 4 },
    cardTotal: { fontSize: 18, color: '#4caf50', fontWeight: 'bold', textAlign: 'right' },

    emptyContainer: { padding: 40, alignItems: 'center' },
    emptyText: { color: '#999', fontSize: 15, fontStyle: 'italic', textAlign: 'center' }
});
