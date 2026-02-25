# Roadmap e Tarefas para Agentes IA
(Agent-Centric Development)

Este documento dita a ordem de desenvolvimento do sistema Digital Lanches.

## 📅 Fase 1: Setup Inicial e Dados (Semanas 1-6)
- [x] **Tarefa 1.1:** Inicializar o projeto `npx create-expo-app@latest lanchonete-app --template blank-typescript`.
- [ ] **Tarefa 1.2:** Configurar puramente o `zustand` e estruturar a pasta `src/store/`.
- [ ] **Tarefa 1.3:** Criar as interfaces TypeScript (Insumo, Produto, FichaTecnicaItem, Venda, ItemVenda) e a estrutura do Store.
- [ ] **Tarefa 1.4:** Inserir "Seed Data" inicial dentro da Store default caso ela esteja vazia: Mínimo 3 insumos (Pão, Carne, Queijo) e 1 Produto (X-Burger).

## 📅 Fase 2: Gestão de Insumos (Estoque Bruto)
- [ ] **Tarefa 2.1:** Criar tela `InsumosScreen.tsx` - Lista todos os insumos mapeados no Zustand State.
- [ ] **Tarefa 2.2:** Criar formulário para cadastro e atualização (Entrada de Estoque/Compra de novo lote) disparando actions no Zustand.

## 📅 Fase 3: Gestão de Produtos e Ficha Técnica
- [ ] **Tarefa 3.1:** Criar tela `ProdutosScreen.tsx` - Lista de itens do cardápio com foto genérica e preço.
- [ ] **Tarefa 3.2:** Desenvolver formulário de Cadastro de Produto - Inclui adição dinâmica de `FichaTecnicaItem`.

## 📅 Fase 4: Ponto de Venda (PDV)
- [ ] **Tarefa 4.1:** Criar a tela Home/Caixa. Lista rápida dos produtos.
- [ ] **Tarefa 4.2:** Carrinho de Compra no estado local.
- [ ] **Tarefa 4.3 (CRÍTICO):** "Finalizar Venda", iniciar Processamento na Action:
  - Cria objeto Venda com seus Itens.
  - Verifica a Ficha Técnica de todos os produtos vendidos e aplica map reduzindo Insumos.
- [ ] **Tarefa 4.4:** Modal de Sucesso + Limpeza do Carrinho.

## 📅 Fase 5: Relatórios e Polimento
- [ ] **Tarefa 5.1:** Criar tela `RelatoriosScreen.tsx` - Total vendido no dia computado da store.
- [ ] **Tarefa 5.2:** Adicionar validações de interface e Refatoração final.
