"use client"

import { useState, useCallback } from "react"
import { useCRUD } from "./useCRUD"
import { useAuditLog } from "./useAuditLog"
import { toast } from "@/components/ui/use-toast"

export function useWorkflow() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const workflows = useCRUD("workflows")
  const workflowInstances = useCRUD("workflow_instances")
  const { logAction } = useAuditLog()

  // Função para obter workflows ativos
  const getActiveWorkflows = useCallback(
    (module = null) => {
      try {
        const instances = workflowInstances.getAll()
        let activeInstances = instances.filter(
          (instance) => instance.status === "active" || instance.status === "in_progress",
        )

        if (module) {
          activeInstances = activeInstances.filter((instance) => instance.module === module)
        }

        return activeInstances.map((instance) => {
          const workflow = workflows.getAll().find((w) => w.id === instance.workflowId)
          return {
            ...instance,
            workflow,
            steps: workflow?.steps || [],
          }
        })
      } catch (err) {
        console.error("Erro ao buscar workflows ativos:", err)
        return []
      }
    },
    [workflows, workflowInstances],
  )

  // Função para executar workflow
  const executeWorkflow = useCallback(
    async (workflowId, data = {}) => {
      try {
        setLoading(true)
        setError(null)

        const workflow = workflows.getAll().find((w) => w.id === workflowId)
        if (!workflow) {
          throw new Error("Workflow não encontrado")
        }

        const instance = {
          id: Date.now().toString(),
          workflowId,
          status: "in_progress",
          currentStep: 0,
          data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        workflowInstances.create(instance)

        setTimeout(() => {
          logAction("EXECUTE", "WORKFLOW", workflowId, `Workflow ${workflow.name} executado`)
          toast({
            title: "Workflow iniciado",
            description: `Workflow "${workflow.name}" foi iniciado com sucesso.`,
          })
        }, 0)

        return instance
      } catch (err) {
        const errorMsg = err.message || "Erro ao executar workflow"
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
    [workflows, workflowInstances, logAction],
  )

  // Função para avançar step do workflow
  const executeStep = useCallback(
    async (instanceId, stepId, stepData = {}) => {
      try {
        setLoading(true)
        setError(null)

        const instance = workflowInstances.getAll().find((i) => i.id === instanceId)
        if (!instance) {
          throw new Error("Instância de workflow não encontrada")
        }

        const workflow = workflows.getAll().find((w) => w.id === instance.workflowId)
        if (!workflow) {
          throw new Error("Workflow não encontrado")
        }

        const currentStep = instance.currentStep
        const nextStep = currentStep + 1
        const isLastStep = nextStep >= (workflow.steps?.length || 0)

        const updatedInstance = {
          ...instance,
          currentStep: nextStep,
          status: isLastStep ? "completed" : "in_progress",
          data: { ...instance.data, ...stepData },
          updatedAt: new Date().toISOString(),
        }

        workflowInstances.update(instanceId, updatedInstance)

        setTimeout(() => {
          logAction("EXECUTE", "WORKFLOW_STEP", instanceId, `Step ${stepId} executado`)
          toast({
            title: "Step executado",
            description: isLastStep ? "Workflow concluído!" : "Próximo step do workflow executado.",
          })
        }, 0)

        return updatedInstance
      } catch (err) {
        const errorMsg = err.message || "Erro ao executar step"
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
    [workflows, workflowInstances, logAction],
  )

  return {
    workflows,
    workflowInstances,
    loading,
    error,
    getActiveWorkflows,
    executeWorkflow,
    executeStep,
  }
}
