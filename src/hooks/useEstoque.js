"use client"

import { useState, useCallback } from "react"
import { useCRUD } from "./useCRUD"
import { useAuditLog } from "./useAuditLog"
import { toast } from "@/components/ui/use-toast"

export function useEstoque() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const produtos = useCRUD("produtos")
  const movimentacoes = useCRUD("movimentacoes")
  const inventarios = useCRUD("inventarios")
  const { logAction } = useAuditLog()

  // Função para calcular estatísticas
  const getEstatisticas = useCallback(() => {
    const produtosList = produtos.getAll()

    const total = produtosList.length
    const ativos = produtosList.filter((p) => p.status === "ativo").length
    const inativos = produtosList.filter((p) => p.status === "inativo").length
    const estoqueBaixo = produtosList.filter((p) => p.estoqueAtual <= p.estoqueMin && p.status === "ativo").length

    const valorTotal = produtosList.reduce((acc, produto) => {
      return acc + (produto.estoqueAtual || 0) * (produto.preco || 0)
    }, 0)

    return {
      produtos: {
        total,
        ativos,
        inativos,
        estoqueBaixo,
      },
      valorTotal,
    }
  }, [produtos])

  // Função para criar movimentação
  const criarMovimentacao = useCallback(
    async (dados) => {
      try {
        setLoading(true)
        setError(null)

        const novaMovimentacao = {
          ...dados,
          id: Date.now().toString(),
          data: dados.data || new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }

        movimentacoes.create(novaMovimentacao)

        // Atualizar estoque do produto
        const produto = produtos.getAll().find((p) => p.id === dados.produtoId)
        if (produto) {
          const novoEstoque =
            dados.tipo === "entrada" ? produto.estoqueAtual + dados.quantidade : produto.estoqueAtual - dados.quantidade

          produtos.update(produto.id, {
            ...produto,
            estoqueAtual: Math.max(0, novoEstoque),
            updatedAt: new Date().toISOString(),
          })
        }

        setTimeout(() => {
          logAction("CREATE", "MOVIMENTACAO", novaMovimentacao.id, "Movimentação criada")
          toast({
            title: "Movimentação registrada",
            description: "Movimentação de estoque registrada com sucesso.",
          })
        }, 0)

        return novaMovimentacao
      } catch (err) {
        const errorMsg = err.message || "Erro ao criar movimentação"
        setError(errorMsg)

        setTimeout(() => {
          toast({
            title: "Erro",
            description: errorMsg,
            variant: "destructive",
          })
        }, 0)

        throw err
      } finally {
        setLoading(false)
      }
    },
    [produtos, movimentacoes, logAction],
  )

  // Função para ajustar estoque
  const ajustarEstoque = useCallback(
    async (produtoId, novaQuantidade, motivo) => {
      try {
        setLoading(true)
        setError(null)

        const produto = produtos.getAll().find((p) => p.id === produtoId)
        if (!produto) {
          throw new Error("Produto não encontrado")
        }

        const quantidadeAnterior = produto.estoqueAtual
        const diferenca = novaQuantidade - quantidadeAnterior

        // Atualizar produto
        produtos.update(produtoId, {
          ...produto,
          estoqueAtual: novaQuantidade,
          updatedAt: new Date().toISOString(),
        })

        // Criar movimentação de ajuste
        const movimentacao = {
          id: Date.now().toString(),
          produtoId,
          produto: produto.nome,
          tipo: diferenca > 0 ? "entrada" : "saida",
          quantidade: Math.abs(diferenca),
          motivo: motivo || "Ajuste de estoque",
          data: new Date().toISOString(),
          responsavel: "Sistema",
          createdAt: new Date().toISOString(),
        }

        movimentacoes.create(movimentacao)

        setTimeout(() => {
          logAction("UPDATE", "ESTOQUE", produtoId, `Estoque ajustado: ${quantidadeAnterior} → ${novaQuantidade}`)
          toast({
            title: "Estoque ajustado",
            description: `Estoque do produto ${produto.nome} ajustado com sucesso.`,
          })
        }, 0)

        return movimentacao
      } catch (err) {
        const errorMsg = err.message || "Erro ao ajustar estoque"
        setError(errorMsg)

        setTimeout(() => {
          toast({
            title: "Erro",
            description: errorMsg,
            variant: "destructive",
          })
        }, 0)

        throw err
      } finally {
        setLoading(false)
      }
    },
    [produtos, movimentacoes, logAction],
  )

  return {
    produtos,
    movimentacoes,
    inventarios,
    loading,
    error,
    getEstatisticas,
    criarMovimentacao,
    ajustarEstoque,
  }
}
