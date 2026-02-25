import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import InsumosScreen from '../screens/InsumosScreen';
import InsumoFormScreen from '../screens/InsumoFormScreen';
import ProdutosScreen from '../screens/ProdutosScreen';
import ProdutoFormScreen from '../screens/ProdutoFormScreen';
import CaixaScreen from '../screens/CaixaScreen';
import RelatoriosScreen from '../screens/RelatoriosScreen';
import PosicaoEstoqueScreen from '../screens/PosicaoEstoqueScreen';

export type RootStackParamList = {
    Home: undefined;
    Insumos: undefined;
    InsumoForm: { insumoId?: string } | undefined;
    Produtos: undefined;
    ProdutoForm: { produtoId?: string } | undefined;
    Caixa: undefined;
    Relatorios: undefined;
    PosicaoEstoque: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#ff9800', // Laranja do fast-food
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'Digital Lanches' }}
                />
                <Stack.Screen
                    name="Insumos"
                    component={InsumosScreen}
                    options={{ title: 'Estoque de Insumos' }}
                />
                <Stack.Screen
                    name="InsumoForm"
                    component={InsumoFormScreen}
                    options={{ title: 'Novo Insumo', presentation: 'formSheet' }}
                />
                <Stack.Screen
                    name="Caixa"
                    component={CaixaScreen}
                    options={{ title: 'Caixa / PDV' }}
                />
                <Stack.Screen
                    name="Produtos"
                    component={ProdutosScreen}
                    options={{ title: 'Cardápio de Produtos' }}
                />
                <Stack.Screen
                    name="ProdutoForm"
                    component={ProdutoFormScreen}
                    options={{ title: 'Receita do Produto', presentation: 'formSheet' }}
                />
                <Stack.Screen
                    name="Relatorios"
                    component={RelatoriosScreen}
                    options={{ title: 'Dashboard de Vendas' }}
                />
                <Stack.Screen
                    name="PosicaoEstoque"
                    component={PosicaoEstoqueScreen}
                    options={{ title: 'Alerta de Produtos Acabando' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
