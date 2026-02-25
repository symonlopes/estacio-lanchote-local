import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLanchoneteStore } from '../store';
import { ItemVenda, Produto } from '../store/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CaixaScreen() {
    const produtos = useLanchoneteStore((state) => state.produtos);
    const finalizarVenda = useLanchoneteStore((state) => state.finalizarVenda);
    const insets = useSafeAreaInsets();

    const [carrinho, setCarrinho] = useState<ItemVenda[]>([]);

    const adicionarAoCarrinho = (produto: Produto) => {
        const itemExistente = carrinho.find(item => item.produtoId === produto.id);

        if (itemExistente) {
            setCarrinho(carrinho.map(item =>
                item.produtoId === produto.id
                    ? { ...item, quantidadeVendida: item.quantidadeVendida + 1 }
                    : item
            ));
        } else {
            setCarrinho([...carrinho, {
                produtoId: produto.id,
                quantidadeVendida: 1,
                precoUnitario: produto.precoVenda,
            }]);
        }
    };

    const removerDoCarrinho = (produtoId: string) => {
        setCarrinho(carrinho.filter(item => item.produtoId !== produtoId));
    };

    const calcularTotal = () => {
        return carrinho.reduce((total, item) => total + (item.quantidadeVendida * item.precoUnitario), 0);
    };

    const processarPagamento = () => {
        if (carrinho.length === 0) {
            Alert.alert('Atenção', 'O carrinho está vazio.');
            return;
        }

        const { success, message } = finalizarVenda(carrinho, 'Dinheiro/Cartão');

        if (success) {
            Alert.alert('Sucesso!', 'Venda registrada e estoque atualizado.');
            setCarrinho([]); // Limpar o carrinho
        } else {
            Alert.alert('Erro ao vender', message || 'Ocorreu um erro desconhecido.');
        }
    };

    // Renderização da lista rápida de produtos (Lado Esquerdo numa visão ideal, ou topo no mobile)
    const renderProduto = ({ item }: { item: Produto }) => (
        <TouchableOpacity style={styles.produtoCard} onPress={() => adicionarAoCarrinho(item)}>
            <Text style={styles.produtoIcon}>{item.icone || '🍔'}</Text>
            <View>
                <Text style={styles.produtoNome}>{item.nome}</Text>
                <Text style={styles.produtoPreco}>+ R$ {item.precoVenda.toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>

            {/* Catálogo Rápido */}
            <View style={styles.produtosSection}>
                <Text style={styles.sectionTitle}>Adicionar ao Pedido</Text>
                <FlatList
                    data={produtos}
                    keyExtractor={(item) => item.id}
                    renderItem={renderProduto}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                />
            </View>

            {/* Resumo do Carrinho */}
            <View style={styles.carrinhoSection}>
                <Text style={[styles.sectionTitle, { marginHorizontal: 16 }]}>Carrinho Atual</Text>

                {carrinho.length === 0 ? (
                    <View style={styles.emptyCart}>
                        <Text style={styles.emptyCartText}>Nenhum item adicionado à venda</Text>
                    </View>
                ) : (
                    <FlatList
                        data={carrinho}
                        keyExtractor={(item) => item.produtoId}
                        style={{ flex: 1, paddingHorizontal: 16 }}
                        renderItem={({ item }) => {
                            const prod = produtos.find(p => p.id === item.produtoId);
                            return (
                                <View style={styles.cartItem}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.cartItemNome}>{item.quantidadeVendida}x {prod?.nome || 'Produto'}</Text>
                                        <Text style={styles.cartItemPreco}>R$ {(item.quantidadeVendida * item.precoUnitario).toFixed(2)}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => removerDoCarrinho(item.produtoId)}>
                                        <Text style={styles.cartItemRemove}>Remover</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    />
                )}

                <View style={[styles.checkoutBox, { paddingBottom: Math.max(20, insets.bottom + 10) }]}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total da Venda:</Text>
                        <Text style={styles.totalValue}>R$ {calcularTotal().toFixed(2)}</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.checkoutBtn, carrinho.length === 0 && styles.checkoutBtnDisabled]}
                        onPress={processarPagamento}
                        disabled={carrinho.length === 0}
                    >
                        <Text style={styles.checkoutBtnText}>FINALIZAR VENDA E BAIXAR ESTOQUE</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5' },
    produtosSection: { height: 140, backgroundColor: '#fff', paddingTop: 16, paddingBottom: 8, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, zIndex: 10 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#555', marginBottom: 12, marginLeft: 16 },
    produtoCard: { flexDirection: 'row', backgroundColor: '#e8f5e9', padding: 12, borderRadius: 8, marginRight: 12, alignItems: 'center', minWidth: 160, borderWidth: 1, borderColor: '#c8e6c9' },
    produtoIcon: { fontSize: 24, marginRight: 8 },
    produtoNome: { fontSize: 14, fontWeight: 'bold', color: '#2e7d32' },
    produtoPreco: { fontSize: 13, color: '#388e3c', marginTop: 2 },

    carrinhoSection: { flex: 1, paddingTop: 16 },
    emptyCart: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyCartText: { color: '#999', fontStyle: 'italic' },
    cartItem: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 8, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
    cartItemNome: { fontSize: 16, fontWeight: '600', color: '#333' },
    cartItemPreco: { fontSize: 14, color: '#ff9800', marginTop: 4, fontWeight: 'bold' },
    cartItemRemove: { color: '#f44336', fontWeight: 'bold' },

    checkoutBox: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 8 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' },
    totalLabel: { fontSize: 16, color: '#666' },
    totalValue: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    checkoutBtn: { backgroundColor: '#4caf50', padding: 16, borderRadius: 12, alignItems: 'center' },
    checkoutBtnDisabled: { backgroundColor: '#a5d6a7' },
    checkoutBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
