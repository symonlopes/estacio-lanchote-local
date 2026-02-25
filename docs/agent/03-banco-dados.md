# Modelagem do Banco de Dados (Zustand State)

O sistema exige relacionamento forte entre o que é *comprado* e o que é *vendido*.
Agente: Use esta referência para compor as interfaces TypeScript do Zustand.

## 🗄️ Entidades Principais (Interfaces Typescript)

### 1. Insumo (O que se compra)
Matéria-prima controlada em peso ou unidade.
* **id**: string (UUID)
* **nome**: string (ex: Queijo Mussarela, Pão Bola)
* **unidadeMedida**: string (ex: KG, UN, GR)
* **quantidadeEstoque**: number (ex: 2.5, 50 - default 0)
* **custoUnitario**: number (Opcional, para cálculo de lucro)

### 2. Produto (O que se vende)
Item final exibido no cardápio para o cliente.
* **id**: string (UUID)
* **nome**: string (ex: X-Burger Duplo)
* **precoVenda**: number (ex: 15.00)
* **categoria**: string (ex: Lanche, Bebida)
* **fichaTecnica**: FichaTecnicaItem[] (Array do relacionamento para os insumos)

### 3. FichaTecnicaItem (Embeddable - A Receita)
* **insumoId**: string (Referência para Insumo.id)
* **quantidadeNecessaria**: number (Quanto do insumo Y vai no produto X)

### 4. Venda (O Histórico)
Registro da transação com o cliente.
* **id**: string (UUID)
* **dataHora**: string (ISO 8601 Date.toISOString())
* **valorTotal**: number
* **formaPagamento**: string (Pix, Cartão, Dinheiro)
* **itens**: ItemVenda[]

### 5. ItemVenda (Embeddable - Detalhe da Venda)
* **produtoId**: string (Referência para Produto.id)
* **quantidadeVendida**: number
* **precoUnitario**: number

---

## 🎯 Caso de Uso (Fluxo do Zustand)
**Venda Acionada (1 X-Burger):**
1. A interface chama a Action `registrarVenda(novaVenda)`.
2. O Zustand valida todos os `itens` vendidos, verificando a `fichaTecnica` dos Produtos.
3. Se todos os insumos tiverem estoque, o Zustand executa um Mapeamento Atualizando os Insumos:
   `state.insumos.map(insumo => insumo id igual ? desconto : mantem)`
4. O Zustand adiciona a venda: `state.vendas.push(novaVenda)`.
5. O Middleware de persistência do async-storage salva todo o estado num JSON stringify no storage.
