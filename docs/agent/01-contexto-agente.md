# Contexto Geral do Projeto: Digital Lanches Delivery

Este documento serve como a **memória principal** (System Prompt Context) para qualquer agente de IA trabalhando neste projeto.

## 🎯 Objetivo do Negócio
A Digital Lanches é uma pequena lanchonete local (4 funcionários) que atualmente controla suas vendas e estoque de forma 100% manual (caderno/planilhas básicas). O objetivo deste sistema é **automatizar o fluxo de vendas e a baixa de insumos no estoque** de forma inteligente.

## 👥 Usuários Finais
- **Perfil:** Funcionários da lanchonete com pouca fluência digital.
- **Necessidade UX/UI:** Telas extremamente intuitivas, botões grandes, fluxos curtos (poucos cliques para registrar uma venda), alto contraste e proteção contra erros acidentais.

## 📱 O Produto (Aplicativo Móvel)
Um aplicativo Android construído em **React Native** com armazenamento local **puramente em memória** operando sobre **Zustand**.
Não haverá backend em nuvem e, como é um protótipo, os dados resetam ao recarregar a aplicação.

## ⚙️ Core Business Logic (Ficha Técnica)
A principal inteligência do app reside na **Ficha Técnica**.
- Nós não compramos "X-Burger". Nós compramos **insumos**: Pão, Hambúrguer, Queijo.
- Nós vendemos **produtos** (X-Burger).
- Ao vender 1 X-Burger, o sistema deve olhar a Ficha Técnica do X-Burger e **dar baixa automaticamente** em: 1 Pão, 1 Hambúrguer e 1 fatia de Queijo no banco de dados de insumos.

## 🤖 Diretrizes para o Agente de IA
1. **Entenda o Domínio:** Sempre pense se uma alteração afeta a sincronia entre Produto Vendido e Insumo Descontado.
2. **Offline e Em Memória:** Todas as transações ocorrem na store do Zustand puramente em memória (sem persistência para focar na agilidade no protótipo).
3. **Simplicidade:** Se houver duas formas de implementar algo, escolha a mais simples e legível. Trabalharemos apenas com manipulação de Arrays e Objetos puros do JavaScript.
4. **Resiliência:** O banco de dados (Store) nunca deve permitir estoque de insumo negativo de forma silenciosa e operações de venda devem possuir verificações prévias na Ficha Técnica.