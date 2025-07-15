"use client"

import { useState, useCallback } from "react"
import { useCRUD } from "./useCRUD"
import { useAuditLog } from "./useAuditLog"
import { toast } from "@/components/ui/use-toast"

export function useCompras() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const requisicoes = useCRUD("requisicoes")
  const cotacoes = useCRUD("cotacoes")
  const pedidos = useCRUD("pedidos")
  const fornecedores = useCRUD("fornecedores")
  const { logAction } = useAuditLog()

  // Função para calcular estatísticas
  const getEstatisticas = useCallback(() => {
    const requisicoesData = requisicoes.getAll()
    const cotacoesData = cotacoes.getAll()
    const pedidosData = pedidos.getAll()

    const totalRequisicoes = requisicoesData.length
    const requisicoesAprovadas = requisicoesData.filter((r) => r.status === "aprovada").length
    const cotacoesPendentes = cotacoesData.filter((c) => c.status === "pendente").length
    const valorTotalPedidos = pedidosData.reduce((acc, pedido) => acc + (pedido.valorTotal || 0), 0)

    return {
      totalRequisicoes,
      requisicoesAprovadas,
      cotacoesPendentes,
      valorTotalPedidos,
    }
  }, [requisicoes, cotacoes, pedidos])

  // Função para criar requisição
  const criarRequisicao = useCallback(
    async (dados) => {
      try {
        setLoading(true)
        setError(null)

        const novaRequisicao = {
          ...dados,
          id: Date.now().toString(),
          numero: `REQ-${Date.now()}`,
          status: "pendente",
          createdAt: new Date().toISOString(),
        }

        requisicoes.create(novaRequisicao)

        setTimeout(() => {
          logAction("CREATE", "REQUISICAO", novaRequisicao.id, "Requisição criada")
          toast({
            title: "Requisição criada",
            description: "Requisição de compra criada com sucesso.",
          })
        }, 0)

        return novaRequisicao
      } catch (err) {
        const errorMsg = err.message || "Erro ao criar requisição"
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
    [requisicoes, logAction],
  )

  // Função para aprovar requisição
  const aprovarRequisicao = useCallback(
    async (requisicaoId, observacoes = "") => {
      try {
        setLoading(true)
        setError(null)

        const requisicao = requisicoes.getAll().find((r) => r.id === requisicaoId)
        if (!requisicao) {
          throw new Error("Requisição não encontrada")
        }

        const requisicaoAtualizada = {
          ...requisicao,
          status: "aprovada",
          observacoes,
          dataAprovacao: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        requisicoes.update(requisicaoId, requisicaoAtualizada)

        setTimeout(() => {
          logAction("UPDATE", "REQUISICAO", requisicaoId, "Requisição aprovada")
          toast({
            title: "Requisição aprovada",
            description: "Requisição foi aprovada com sucesso.",
          })
        }, 0)

        return requisicaoAtualizada
      } catch (err) {
        const errorMsg = err.message || "Erro ao aprovar requisição"
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
    [requisicoes, logAction],
  )

  return {
    requisicoes,
    cotacoes,
    pedidos,
    fornecedores,
    loading,
    error,
    getEstatisticas,
    criarRequisicao,
    aprovarRequisicao,
  }
}
