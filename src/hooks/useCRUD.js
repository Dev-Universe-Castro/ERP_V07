"use client"

import { useState, useCallback, useEffect } from "react"
import { useData } from "../contexts/DataContext"

export const useCRUD = (entityType, callbacks = {}) => {
  const { queryItems, insertItem, updateItem, deleteItem, findById } = useData()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Limpar erro quando entityType muda
  useEffect(() => {
    setError(null)
  }, [entityType])

  const getAll = useCallback(() => {
    try {
      return queryItems(entityType) || []
    } catch (err) {
      setError(err.message)
      return []
    }
  }, [entityType, queryItems])

  const getById = useCallback(
    (id) => {
      try {
        return findById(entityType, id)
      } catch (err) {
        setError(err.message)
        return null
      }
    },
    [entityType, findById],
  )

  const create = useCallback(
    async (data) => {
      setLoading(true)
      setError(null)

      try {
        const newItem = insertItem(entityType, data)

        // Executar callback de onCreate de forma assíncrona
        if (callbacks.onCreate) {
          setTimeout(() => callbacks.onCreate(newItem), 0)
        }

        return newItem
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [entityType, insertItem, callbacks.onCreate],
  )

  const update = useCallback(
    async (id, data) => {
      setLoading(true)
      setError(null)

      try {
        const updatedItem = updateItem(entityType, id, data)

        // Executar callback de onUpdate de forma assíncrona
        if (callbacks.onUpdate) {
          setTimeout(() => callbacks.onUpdate(updatedItem), 0)
        }

        return updatedItem
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [entityType, updateItem, callbacks.onUpdate],
  )

  const remove = useCallback(
    async (id) => {
      setLoading(true)
      setError(null)

      try {
        const itemToDelete = findById(entityType, id)
        const success = deleteItem(entityType, id)

        // Executar callback de onDelete de forma assíncrona
        if (success && callbacks.onDelete) {
          setTimeout(() => callbacks.onDelete(id, itemToDelete), 0)
        }

        return success
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [entityType, deleteItem, findById, callbacks.onDelete],
  )

  const query = useCallback(
    (filters = {}) => {
      try {
        return queryItems(entityType, filters) || []
      } catch (err) {
        setError(err.message)
        return []
      }
    },
    [entityType, queryItems],
  )

  return {
    // Dados
    getAll,
    getById,
    query,

    // Operações
    create,
    update,
    delete: remove,

    // Estado
    loading,
    error,

    // Utilitários
    clearError: useCallback(() => setError(null), []),
  }
}
