export interface Insumo {
    id: string;
    nome: string;
    unidadeMedida: string;
    quantidadeEstoque: number;
    quantidadeMinima?: number;
    custoUnitario?: number;
}

export interface FichaTecnicaItem {
    insumoId: string;
    quantidadeNecessaria: number;
}

export interface Produto {
    id: string;
    nome: string;
    precoVenda: number;
    categoria?: string;
    icone?: string; // Emoji customizado do lanche ou bebida
    fichaTecnica: FichaTecnicaItem[];
}

export interface ItemVenda {
    produtoId: string;
    quantidadeVendida: number;
    precoUnitario: number;
}

export interface Venda {
    id: string;
    dataHora: string;
    valorTotal: number;
    formaPagamento?: string;
    itens: ItemVenda[];
}

// O estado global do banco de dados (Zustand Store)
export interface LanchoneteState {
    insumos: Insumo[];
    produtos: Produto[];
    vendas: Venda[];

    // Actions que definiremos na Store para modificar as Arrays
    addInsumo: (insumo: Omit<Insumo, 'id'>) => void;
    updateInsumo: (id: string, data: Partial<Omit<Insumo, 'id'>>) => void;
    updateInsumoEstoque: (id: string, quantidadeAdicional: number) => void;
    addProduto: (produto: Omit<Produto, 'id'>) => void;
    updateProduto: (id: string, data: Partial<Omit<Produto, 'id'>>) => void;

    // Actions PDV
    finalizarVenda: (itens: ItemVenda[], formaPagamento: string) => { success: boolean; message?: string };
}
