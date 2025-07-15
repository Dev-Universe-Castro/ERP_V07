"use client"

import { useState, useCallback } from "react"
import { useCRUD } from "./useCRUD"
import { useAuditLog } from "./useAuditLog"
import { toast } from "@/components/ui/use-toast"

export function useAbastecimento() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const equipamentos = useCRUD("equipamentos")
  const abastecimentos = useCRUD("abastecimentos")
  const manutencoes = useCRUD("manutencoes")
  const { logAction } = useAuditLog()

  // Função para calcular estatísticas
  const getEstatisticas = useCallback(() => {
    const equipamentosData = equipamentos.getAll()
    const abastecimentosData = abastecimentos.getAll()

    const totalEquipamentos = equipamentosData.length
    const equipamentosAtivos = equipamentosData.filter((e) => e.status === "ativo").length
    const totalAbastecimentos = abastecimentosData.length
    const totalLitros = abastecimentosData.reduce((acc, ab) => acc + (ab.litros || 0), 0)
    const totalGastos = abastecimentosData.reduce((acc, ab) => acc + (ab.valor || 0), 0)

    return {
      totalEquipamentos,
      equipamentosAtivos,
      totalAbastecimentos,
      totalLitros,
      totalGastos,
    }
  }, [equipamentos, abastecimentos])

  // Função para criar abastecimento
  const criarAbastecimento = useCallback(
    async (dados) => {
      try {
        setLoading(true)
        setError(null)

        const equipamento = equipamentos.getAll().find((e) => e.id === dados.equipamentoId)
        if (!equipamento) {
          throw new Error("Equipamento não encontrado")
        }

        // Calcular consumo
        const distancia = dados.medidorAtual - dados.medidorAnterior
        const consumo = distancia > 0 ? distancia / dados.litros : 0

        const novoAbastecimento = {
          ...dados,
          id: Date.now().toString(),
          consumo,
          createdAt: new Date().toISOString(),
        }

        abastecimentos.create(novoAbastecimento)

        // Atualizar medidor do equipamento
        equipamentos.update(dados.equipamentoId, {
          ...equipamento,
          medidorAtual: dados.medidorAtual,
          updatedAt: new Date().toISOString(),
        })

        setTimeout(() => {
          logAction("CREATE", "ABASTECIMENTO", novoAbastecimento.id, "Abastecimento registrado")
          toast({
            title: "Abastecimento registrado",
            description: "Abastecimento foi registrado com sucesso.",
          })
        }, 0)

        return novoAbastecimento
      } catch (err) {
        const errorMsg = err.message || "Erro ao registrar abastecimento"
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
    [equipamentos, abastecimentos, logAction],
  )

  // Função para atualizar abastecimento
  const atualizarAbastecimento = useCallback(
    async (abastecimentoId, dados) => {
      try {
        setLoading(true)
        setError(null)

        const abastecimento = abastecimentos.getAll().find((a) => a.id === abastecimentoId)
        if (!abastecimento) {
          throw new Error("Abastecimento não encontrado")
        }

        // Recalcular consumo se necessário
        let consumo = abastecimento.consumo
        if (dados.medidorAtual && dados.medidorAnterior && dados.litros) {
          const distancia = dados.medidorAtual - dados.medidorAnterior
          consumo = distancia > 0 ? distancia / dados.litros : 0
        }

        const abastecimentoAtualizado = {
          ...abastecimento,
          ...dados,
          consumo,
          updatedAt: new Date().toISOString(),
        }

        abastecimentos.update(abastecimentoId, abastecimentoAtualizado)

        setTimeout(() => {
          logAction("UPDATE", "ABASTECIMENTO", abastecimentoId, "Abastecimento atualizado")
          toast({
            title: "Abastecimento atualizado",
            description: "Abastecimento foi atualizado com sucesso.",
          })
        }, 0)

        return abastecimentoAtualizado
      } catch (err) {
        const errorMsg = err.message || "Erro ao atualizar abastecimento"
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
    [abastecimentos, logAction],
  )

  return {
    equipamentos,
    abastecimentos,
    manutencoes,
    loading,
    error,
    getEstatisticas,
    criarAbastecimento,
    atualizarAbastecimento,
  }
}
