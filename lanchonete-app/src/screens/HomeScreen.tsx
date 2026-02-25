import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Digital Lanches</Text>
            <Text style={styles.headerSubtitle}>Painel de Controle</Text>

            <View style={styles.menuContainer}>
                <TouchableOpacity
                    style={[styles.menuButton, styles.pdvButton]}
                    onPress={() => navigation.navigate('Caixa')}
                >
                    <Text style={styles.menuButtonText}>🛒 Caixa / PDV</Text>
                    <Text style={styles.menuButtonDesc}>Registrar nova venda</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => navigation.navigate('Produtos')}
                >
                    <Text style={styles.menuButtonText}>🍔 Cardápio</Text>
                    <Text style={styles.menuButtonDesc}>Gerenciar produtos e fichas técnicas</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => navigation.navigate('Insumos')}
                >
                    <Text style={styles.menuButtonText}>📦 Estoque</Text>
                    <Text style={styles.menuButtonDesc}>Controle de ingredientes brutos</Text>
                </TouchableOpacity>

                {/* Relatórios e Alertas */}
                {/* Relatórios e Alertas */}
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => navigation.navigate('Relatorios')}
                >
                    <Text style={styles.menuButtonText}>📊 Relatório de Caixa</Text>
                    <Text style={styles.menuButtonDesc}>Acompanhar vendas e faturamento</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => navigation.navigate('PosicaoEstoque')}
                >
                    <Text style={styles.menuButtonText}>⚠️ Relatório de Compras</Text>
                    <Text style={styles.menuButtonDesc}>Analisar ingredientes em falta no estoque</Text>
                </TouchableOpacity>

            </View>

            <View style={[styles.footerContainer, { bottom: Math.max(20, insets.bottom + 10) }]}>
                <Text style={styles.footerText}>Desenvolvido por Symon Lopes</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
    },
    menuContainer: {
        gap: 16,
    },
    menuButton: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        borderLeftWidth: 6,
        borderLeftColor: '#ff9800',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    pdvButton: {
        borderLeftColor: '#4caf50',
        backgroundColor: '#f0fdf4',
    },
    menuButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    menuButtonDesc: {
        fontSize: 14,
        color: '#666',
    },
    footerContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    }
});
