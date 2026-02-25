import { create } from 'zustand';
import * as Crypto from 'expo-crypto';
import { LanchoneteState, Insumo, Produto } from './types';

// Dados da "Seed" - In-memory default states
const INITIAL_INSUMOS: Insumo[] = [
    { id: 'insumo-1', nome: 'Pão de Hambúrguer', unidadeMedida: 'UN', quantidadeEstoque: 50, quantidadeMinima: 20, custoUnitario: 1.50 },
    { id: 'insumo-2', nome: 'Carne de Hambúrguer', unidadeMedida: 'UN', quantidadeEstoque: 50, quantidadeMinima: 20, custoUnitario: 4.00 },
    { id: 'insumo-3', nome: 'Queijo Fatiado', unidadeMedida: 'UN', quantidadeEstoque: 100, quantidadeMinima: 30, custoUnitario: 0.50 },
    { id: 'insumo-4', nome: 'Leite', unidadeMedida: 'L', quantidadeEstoque: 20, quantidadeMinima: 10, custoUnitario: 5.00 },
    { id: 'insumo-5', nome: 'Sorvete de Chocolate', unidadeMedida: 'KG', quantidadeEstoque: 10, quantidadeMinima: 5, custoUnitario: 25.00 },
    { id: 'insumo-6', nome: 'Coca Cola Zero 300ml (Lata)', unidadeMedida: 'UN', quantidadeEstoque: 24, quantidadeMinima: 12, custoUnitario: 3.50 },
    { id: 'insumo-7', nome: 'Coca Cola Zero 1L', unidadeMedida: 'UN', quantidadeEstoque: 12, quantidadeMinima: 6, custoUnitario: 5.00 },
    { id: 'insumo-8', nome: 'Coca Cola Zero 200ml (Lata)', unidadeMedida: 'UN', quantidadeEstoque: 48, quantidadeMinima: 24, custoUnitario: 1.50 }
];

const INITIAL_PRODUTOS: Produto[] = [
    {
        id: 'produto-1',
        nome: 'X-Burger Especial',
        precoVenda: 18.00,
        categoria: 'Lanches',
        icone: '🍔',
        fichaTecnica: [
            { insumoId: 'insumo-1', quantidadeNecessaria: 1 },
            { insumoId: 'insumo-2', quantidadeNecessaria: 1 },
            { insumoId: 'insumo-3', quantidadeNecessaria: 1 }
        ]
    },
    {
        id: 'produto-2',
        nome: 'Milkshake de Chocolate',
        precoVenda: 15.00,
        categoria: 'Bebidas/Sobremesas',
        icone: '🥤',
        fichaTecnica: [
            { insumoId: 'insumo-4', quantidadeNecessaria: 0.2 }, // 200ml de leite
            { insumoId: 'insumo-5', quantidadeNecessaria: 0.15 } // 150g de sorvete
        ]
    },
    {
        id: 'produto-3',
        nome: 'Coca Cola Zero 300ml',
        precoVenda: 7.00,
        categoria: 'Bebidas',
        icone: '🥫',
        fichaTecnica: [
            { insumoId: 'insumo-6', quantidadeNecessaria: 1 }
        ]
    },
    {
        id: 'produto-4',
        nome: 'Coca Cola Zero 1L',
        precoVenda: 10.00,
        categoria: 'Bebidas',
        icone: '🍾',
        fichaTecnica: [
            { insumoId: 'insumo-7', quantidadeNecessaria: 1 }
        ]
    },
    {
        id: 'produto-5',
        nome: 'Coca Cola Zero 200ml',
        precoVenda: 4.00,
        categoria: 'Bebidas',
        icone: '🥫',
        fichaTecnica: [
            { insumoId: 'insumo-8', quantidadeNecessaria: 1 }
        ]
    }
];

export const useLanchoneteStore = create<LanchoneteState>((set, get) => ({
    // Popula o estado inicial
    insumos: INITIAL_INSUMOS,
    produtos: INITIAL_PRODUTOS,
    vendas: [],

    // Actions Iniciais de Base
    addInsumo: (novoInsumo) => set((state) => ({
        insumos: [...state.insumos, { ...novoInsumo, id: Crypto.randomUUID() }]
    })),

    updateInsumo: (id, data) => set((state) => ({
        insumos: state.insumos.map(insumo =>
            insumo.id === id ? { ...insumo, ...data } : insumo
        )
    })),

    updateInsumoEstoque: (id, quantidadeAdicional) => set((state) => ({
        insumos: state.insumos.map((insumo) =>
            insumo.id === id
                ? { ...insumo, quantidadeEstoque: insumo.quantidadeEstoque + quantidadeAdicional }
                : insumo
        )
    })),

    addProduto: (novoProduto) => set((state) => ({
        produtos: [...state.produtos, { ...novoProduto, id: Crypto.randomUUID() }]
    })),

    updateProduto: (id, data) => set((state) => ({
        produtos: state.produtos.map(produto =>
            produto.id === id ? { ...produto, ...data } : produto
        )
    })),

    finalizarVenda: (itens, formaPagamento) => {
        const { insumos, produtos } = get();

        // 1. Calcula o total de insumos necessários
        const requiredInsumos: Record<string, number> = {};
        let valorTotal = 0;

        for (const item of itens) {
            const produto = produtos.find(p => p.id === item.produtoId);
            if (!produto) return { success: false, message: `O produto com ID ${item.produtoId} não foi encontrado.` };

            valorTotal += item.quantidadeVendida * item.precoUnitario;

            for (const ft of produto.fichaTecnica) {
                const totalNecessario = ft.quantidadeNecessaria * item.quantidadeVendida;
                requiredInsumos[ft.insumoId] = (requiredInsumos[ft.insumoId] || 0) + totalNecessario;
            }
        }

        // 2. Verifica se o estoque possui a quantidade necessária para todos
        for (const [insumoId, qtdNecessaria] of Object.entries(requiredInsumos)) {
            const insumo = insumos.find(i => i.id === insumoId);
            if (!insumo || insumo.quantidadeEstoque < qtdNecessaria) {
                return { success: false, message: `Estoque Esgotado ou Insuficiente: Precisa de ${qtdNecessaria} de [${insumo?.nome || 'Insumo Apagado'}]` };
            }
        }

        // 3. Efetua a dedução e registra a venda
        set((state) => ({
            vendas: [
                ...state.vendas,
                {
                    id: Crypto.randomUUID(),
                    dataHora: new Date().toISOString(),
                    valorTotal,
                    formaPagamento,
                    itens
                }
            ],
            insumos: state.insumos.map(insumo => {
                if (requiredInsumos[insumo.id]) {
                    return { ...insumo, quantidadeEstoque: insumo.quantidadeEstoque - requiredInsumos[insumo.id] };
                }
                return insumo;
            })
        }));

        return { success: true };
    }
}));
