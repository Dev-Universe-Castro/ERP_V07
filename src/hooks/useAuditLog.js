"use client"

import { useState, useCallback } from "react"

export const useAuditLog = () => {
  const [logs, setLogs] = useState([])

  const logAction = useCallback((action, entity, entityId, description = "") => {
    // Usar setTimeout para evitar renderizações síncronas
    setTimeout(() => {
      const logEntry = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        action,
        entity,
        entityId,
        description,
        user: "Sistema", // Em um app real, viria do contexto de autenticação
      }

      setLogs((prev) => [logEntry, ...prev.slice(0, 999)]) // Manter apenas os últimos 1000 logs

      // Log para debug
      console.log("[AUDIT LOG]", logEntry)
    }, 0)
  }, [])

  const getLogs = useCallback(
    (filters = {}) => {
      let filteredLogs = logs

      if (filters.entity) {
        filteredLogs = filteredLogs.filter((log) => log.entity === filters.entity)
      }

      if (filters.action) {
        filteredLogs = filteredLogs.filter((log) => log.action === filters.action)
      }

      if (filters.dateFrom) {
        filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) >= new Date(filters.dateFrom))
      }

      if (filters.dateTo) {
        filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) <= new Date(filters.dateTo))
      }

      return filteredLogs
    },
    [logs],
  )

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  return {
    logAction,
    getLogs,
    clearLogs,
    logs,
  }
}
