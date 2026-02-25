import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker'; // Pode ser necessário instalar: npx expo install @react-native-picker/picker
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanchoneteStore } from '../store';
import { FichaTecnicaItem, Produto } from '../store/types';
import { RootStackParamList } from '../navigation';

type ProdutoFormRouteProp = RouteProp<RootStackParamList, 'ProdutoForm'>;

export default function ProdutoFormScreen() {
    const navigation = useNavigation();
    const route = useRoute<ProdutoFormRouteProp>();
    const insets = useSafeAreaInsets();

    const addProduto = useLanchoneteStore((state) => state.addProduto);
    const updateProduto = useLanchoneteStore((state) => state.updateProduto);
    const insumosDisponiveis = useLanchoneteStore((state) => state.insumos);
    const produtos = useLanchoneteStore((state) => state.produtos);

    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [categoria, setCategoria] = useState('');
    const [icone, setIcone] = useState('🍔');
    const [fichaTecnica, setFichaTecnica] = useState<FichaTecnicaItem[]>([]);

    const produtoIdEdicao = route.params?.produtoId;
    const isEditing = !!produtoIdEdicao;

    useEffect(() => {
        if (produtoIdEdicao) {
            const p = produtos.find(p => p.id === produtoIdEdicao);
            if (p) {
                setNome(p.nome);
                setPreco(p.precoVenda.toString());
                setCategoria(p.categoria || '');
                setIcone(p.icone || '🍔');
                setFichaTecnica(p.fichaTecnica);
            }
        }
    }, [produtoIdEdicao]);

    // Novo item para Ficha Técnica
    const [novoInsumoId, setNovoInsumoId] = useState(insumosDisponiveis[0]?.id || '');
    const [novaQuantidade, setNovaQuantidade] = useState('');

    const adicionarInsumoFicha = () => {
        if (!novoInsumoId) {
            Alert.alert('Erro', 'Selecione um insumo.');
            return;
        }

        const qtdNum = parseFloat(novaQuantidade.replace(',', '.'));
        if (isNaN(qtdNum) || qtdNum <= 0) {
            Alert.alert('Erro', 'Informe a quantidade válida que este insumo usará.');
            return;
        }

        // Verifica se já existe, se sim alerta
        if (fichaTecnica.find(item => item.insumoId === novoInsumoId)) {
            Alert.alert('Aviso', 'Este insumo já está na ficha técnica.');
            return;
        }

        setFichaTecnica([...fichaTecnica, { insumoId: novoInsumoId, quantidadeNecessaria: qtdNum }]);
        setNovaQuantidade(''); // Limpa a quantidade após a adição
    };

    const removerInsumoFicha = (idToRemove: string) => {
        setFichaTecnica(fichaTecnica.filter(item => item.insumoId !== idToRemove));
    };

    const handleSave = () => {
        if (!nome.trim() || !preco.trim()) {
            Alert.alert('Erro', 'Nome e Preço são obrigatórios.');
            return;
        }

        const precoNum = parseFloat(preco.replace(',', '.'));
        if (isNaN(precoNum)) {
            Alert.alert('Erro', 'Preço inválido.');
            return;
        }

        if (fichaTecnica.length === 0) {
            Alert.alert('Aviso', 'Um produto deve ter pelo menos um insumo em sua ficha técnica para dar baixa no estoque.');
            return;
        }

        const payload = {
            nome: nome.trim(),
            precoVenda: precoNum,
            categoria: categoria.trim() || 'Lanche',
            icone: icone.trim() || '🍔',
            fichaTecnica
        };

        if (isEditing) {
            updateProduto(produtoIdEdicao, payload);
            Alert.alert('Sucesso', 'Produto editado com sucesso!');
        } else {
            addProduto(payload);
            Alert.alert('Sucesso', 'Produto e Ficha Técnica cadastrados!');
        }

        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(40, insets.bottom + 20) }]}>

                <Text style={styles.sectionTitle}>Dados Base</Text>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nome do Produto *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: X-Bacon"
                        value={nome}
                        onChangeText={setNome}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                        <Text style={styles.label}>Preço de Venda (R$) *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 22.00"
                            keyboardType="decimal-pad"
                            value={preco}
                            onChangeText={setPreco}
                        />
                    </View>

                    <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                        <Text style={styles.label}>Categoria</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Hambúrguer"
                            value={categoria}
                            onChangeText={setCategoria}
                        />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Ícone ou Emoji do Cardápio</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: 🍔 ou 🥤"
                        value={icone}
                        onChangeText={setIcone}
                    />
                </View>

                <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Ficha Técnica (Receita)</Text>
                <Text style={styles.hintText}>Adicione os insumos que são gastos a cada venda deste produto.</Text>

                <View style={styles.fichaCreatorBox}>
                    <Text style={styles.label}>Insumo:</Text>
                    <View style={styles.pickerContainer}>
                        {/* Usaremos um seletor visual simples caso o Picker oficial falhe na instalação, 
               mas indicamos a instalação do @react-native-picker/picker.
               Para evitar crash se não instalado, usaremos mapeamento para um TextInput por enquanto,
               ou você pode instalar via npx expo install @react-native-picker/picker
             */}
                        <Picker
                            selectedValue={novoInsumoId}
                            onValueChange={(itemValue) => setNovoInsumoId(itemValue.toString())}
                            style={styles.pickerInput}
                        >
                            {insumosDisponiveis.map(insumo => (
                                <Picker.Item key={insumo.id} label={`${insumo.nome} (${insumo.unidadeMedida})`} value={insumo.id} />
                            ))}
                        </Picker>
                    </View>

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <Text style={styles.label}>Qtd Gasta:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: 1"
                                keyboardType="decimal-pad"
                                value={novaQuantidade}
                                onChangeText={setNovaQuantidade}
                            />
                        </View>
                        <TouchableOpacity style={styles.addIngredientBtn} onPress={adicionarInsumoFicha}>
                            <Text style={styles.addIngredientBtnText}>Incluir Item</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Lista de Insumos da Ficha Técnica Atuais */}
                {fichaTecnica.map((item, index) => {
                    const insumo = insumosDisponiveis.find(i => i.id === item.insumoId);
                    return (
                        <View key={index} style={styles.fichaItem}>
                            <Text style={styles.fichaItemName}>{insumo?.nome} ({item.quantidadeNecessaria} {insumo?.unidadeMedida})</Text>
                            <TouchableOpacity onPress={() => removerInsumoFicha(item.insumoId)}>
                                <Text style={styles.fichaItemRemove}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    )
                })}

                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>SALVAR PRODUTO NO CARDÁPIO</Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { padding: 20, paddingBottom: 40 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#ff9800', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8 },
    hintText: { fontSize: 12, color: '#666', marginBottom: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    formGroup: { marginBottom: 16 },
    label: { fontSize: 13, color: '#333', fontWeight: 'bold', marginBottom: 6 },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fafafa' },
    pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#fafafa', marginBottom: 12, overflow: 'hidden' },
    pickerInput: { height: 50, width: '100%' },
    fichaCreatorBox: { backgroundColor: '#f9f9f9', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 16 },
    addIngredientBtn: { backgroundColor: '#4caf50', padding: 14, borderRadius: 8, justifyContent: 'center', alignItems: 'center', height: 52 },
    addIngredientBtnText: { color: 'white', fontWeight: 'bold' },
    fichaItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e3f2fd', padding: 12, borderRadius: 6, marginBottom: 8 },
    fichaItemName: { fontSize: 15, color: '#1565c0', fontWeight: '500' },
    fichaItemRemove: { color: '#d32f2f', fontWeight: 'bold', fontSize: 18, paddingHorizontal: 8 },
    button: { backgroundColor: '#ff9800', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 4 },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});
