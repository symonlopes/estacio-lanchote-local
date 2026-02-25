# Arquitetura Técnica e Decisões de Engenharia

Este documento guia os Agentes de IA nas decisões técnicas deste projeto.

## 🛠️ Stack Tecnológica
- **Frontend/Mobile:** React Native (Expo) - Foco em produtividade e build simplificado para Android.
- **Linguagem:** TypeScript (Strict Mode = true) para garantir segurança de tipos entre Produto, Insumo e Vendas.
- **Banco de Dados (Persistência):** Armazenamento puramente efêmero (In-Memory) utilizando apenas store JavaScript no lado cliente.
- **Gerenciamento de Estado Global:** Zustand (store contendo todo o estado, resetando a cada encerramento e carregando os dados da Ficha Técnica na raiz como Seed).
- **Estilização:** NativeWind (Tailwind para React Native) ou StyleSheet puro (dependendo da preferência inicial, preferencialmente StyleSheet para menos dependências).

## 📂 Padrão de Estrutura de Diretórios
```text
src/
├── components/      # UI isolada e reutilizável (Botões, Cards, Modais)
├── screens/         # Telas principais do app (Home, Vendas, Estoque, Relatório)
├── database/        # Lógica do SQLite (Queries, Migrations, Instância DB)
│   ├── schema/      # Definição das tabelas
│   └── queries/     # Operadores CRUD separados por domínio (Insumos, Produtos)
├── hooks/           # Hooks React customizados (ex: useCart, useInventory)
├── types/           # Interfaces TypeScript globais
└── utils/           # Funções auxiliares (máscaras de moeda, formatadores de data)
```

## 🔄 Fluxos Arquiteturais Chave
1. **Inicialização do App:** O App chama o hook do Zustand (ex: `useLanchoneteStore()`) que é carregado instantaneamente do `initialState` (Seed Data).
2. **Camada de Acesso a Dados (DAL):** Toda tela consome dados lendo a array respectiva (ex: `const produtos = useLanchoneteStore(s => s.produtos);`). Não há latência de I/O em leitura.
3. **Ponto Crítico - Transação de Venda:**
   Para registrar 1 Venda, o agente dispara uma action no Zustand (`addVenda(venda)`):
   a) Validação: Existe insumo suficiente para toda a ficha técnica? Se sim, prossegue.
   b) Para cada Item de Venda, busca sua `Ficha_Tecnica`, multiplica a quantidade de Insumos x Quantidade Vendida.
   c) Atualiza a Array `insumos[]` (desconto) e adiciona um objeto de venda em `vendas[]`.

## ✅ Regras de Qualidade (Para o Agente)
- Não importe bibliotecas pesadas se um hook simples resolve.
- Escreva testes (Jest + Testing Library React Native) prioritariamente para as *queries* de banco e a matemática da Ficha Técnica.
- Documente todas as queries SQL cruas para fácil debug.
