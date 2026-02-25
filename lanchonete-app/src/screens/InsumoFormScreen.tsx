import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useLanchoneteStore } from '../store';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type InsumoFormRouteProp = RouteProp<RootStackParamList, 'InsumoForm'>;

export default function InsumoFormScreen() {
    const navigation = useNavigation();
    const route = useRoute<InsumoFormRouteProp>();
    const insets = useSafeAreaInsets();

    const addInsumo = useLanchoneteStore((state) => state.addInsumo);
    const updateInsumo = useLanchoneteStore((state) => state.updateInsumo);
    const insumosDisponiveis = useLanchoneteStore((state) => state.insumos);

    const [nome, setNome] = useState('');
    const [unidadeMedida, setUnidadeMedida] = useState('UN'); // Default UN
    const [quantidade, setQuantidade] = useState('');
    const [quantidadeMinima, setQuantidadeMinima] = useState('');
    const [custo, setCusto] = useState('');

    const insumoIdEdicao = route.params?.insumoId;
    const isEditing = !!insumoIdEdicao;

    useEffect(() => {
        if (insumoIdEdicao) {
            const insumo = insumosDisponiveis.find(i => i.id === insumoIdEdicao);
            if (insumo) {
                setNome(insumo.nome);
                setUnidadeMedida(insumo.unidadeMedida);
                setQuantidade(insumo.quantidadeEstoque.toString());
                setQuantidadeMinima(insumo.quantidadeMinima?.toString() || '');
                setCusto(insumo.custoUnitario?.toString() || '');
            }
        }
    }, [insumoIdEdicao, insumosDisponiveis]);

    const handleSave = () => {
        if (!nome.trim()) {
            Alert.alert('Erro', 'O nome do insumo é obrigatório.');
            return;
        }

        const qtdNum = parseFloat(quantidade);
        if (isNaN(qtdNum) || qtdNum < 0) {
            Alert.alert('Erro', 'Informe uma quantidade de estoque válida maior ou igual a zero.');
            return;
        }

        const qtdMinNum = quantidadeMinima ? parseFloat(quantidadeMinima) : 0;
        if (isNaN(qtdMinNum) || qtdMinNum < 0) {
            Alert.alert('Erro', 'Informe um estoque mínimo numérico válido.');
            return;
        }

        const custoNum = custo ? parseFloat(custo.replace(',', '.')) : 0;

        const payload = {
            nome: nome.trim(),
            unidadeMedida: unidadeMedida.trim().toUpperCase() || 'UN',
            quantidadeEstoque: qtdNum,
            quantidadeMinima: qtdMinNum,
            custoUnitario: isNaN(custoNum) ? undefined : custoNum
        };

        if (isEditing) {
            updateInsumo(insumoIdEdicao, payload);
            Alert.alert('Sucesso', 'Insumo atualizado com sucesso!');
        } else {
            addInsumo(payload);
            Alert.alert('Sucesso', 'Insumo adicionado com sucesso!');
        }

        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(40, insets.bottom + 20) }]}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nome do Insumo *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Maionese Caseira"
                        value={nome}
                        onChangeText={setNome}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                        <Text style={styles.label}>Estoque Inicial *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 5"
                            keyboardType="numeric"
                            value={quantidade}
                            onChangeText={setQuantidade}
                        />
                    </View>

                    <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                        <Text style={styles.label}>Medida (UN, KG, L)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: UN"
                            maxLength={2}
                            autoCapitalize="characters"
                            value={unidadeMedida}
                            onChangeText={setUnidadeMedida}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                        <Text style={styles.label}>Estoque Mínimo (Alerta)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 5"
                            keyboardType="numeric"
                            value={quantidadeMinima}
                            onChangeText={setQuantidadeMinima}
                        />
                    </View>

                    <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                        <Text style={styles.label}>Custo Unitário (R$)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 8.50"
                            keyboardType="decimal-pad"
                            value={custo}
                            onChangeText={setCusto}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>{isEditing ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR INSUMO'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fafafa',
    },
    button: {
        backgroundColor: '#ff9800',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
