"use client"

import { useState, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Package,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useEstoque } from "@/hooks/useEstoque"
import { useAuditLog } from "@/hooks/useAuditLog"
import { useWorkflow } from "@/hooks/useWorkflow"
import { useData } from "@/contexts/DataContext"
import EstoqueSidebar from "./estoque/EstoqueSidebar"
import * as XLSX from "xlsx"

const getStatusBadge = (status) => {
  const statusMap = {
    ativo: "bg-green-100 text-green-800",
    inativo: "bg-red-100 text-red-800",
    baixo: "bg-yellow-100 text-yellow-800",
    zerado: "bg-red-100 text-red-800",
    normal: "bg-green-100 text-green-800",
  }
  return statusMap[status] || "bg-gray-100 text-gray-800"
}

const getStatusIcon = (status) => {
  switch (status) {
    case "ativo":
    case "normal":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "baixo":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    case "inativo":
    case "zerado":
      return <Clock className="h-4 w-4 text-red-600" />
    default:
      return <Package className="h-4 w-4 text-gray-500" />
  }
}

const ProdutosTable = ({ produtos, onEdit, onDelete, onView }) => (
  <div className="data-table rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Código</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nome</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Categoria</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Estoque Atual</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Estoque Mín.</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Preço</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Status</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {produtos.map((item, index) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-gray-50"
            >
              <td className="px-4 py-3 text-sm text-gray-800 font-mono">{item.codigo}</td>
              <td className="px-4 py-3 text-sm text-gray-800">{item.nome}</td>
              <td className="px-4 py-3 text-sm text-gray-800">{item.categoria}</td>
              <td className="px-4 py-3 text-sm text-gray-800 text-right">{item.estoqueAtual || 0}</td>
              <td className="px-4 py-3 text-sm text-gray-800 text-right">{item.estoqueMin || 0}</td>
              <td className="px-4 py-3 text-sm text-gray-800 text-right font-semibold">
                R$ {(item.preco || 0).toFixed(2)}
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center">
                  {getStatusIcon(item.status)}
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => onView(item)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const MovimentacoesTable = ({ movimentacoes, onEdit, onDelete, onView }) => (
  <div className="data-table rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Data</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Produto</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tipo</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Quantidade</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Origem/Destino</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Responsável</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {movimentacoes.map((item, index) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-gray-50"
            >
              <td className="px-4 py-3 text-sm text-gray-800">{new Date(item.data).toLocaleDateString("pt-BR")}</td>
              <td className="px-4 py-3 text-sm text-gray-800">{item.produto}</td>
              <td className="px-4 py-3 text-sm text-gray-800">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    item.tipo === "entrada" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.tipo}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-800 text-right">{item.quantidade}</td>
              <td className="px-4 py-3 text-sm text-gray-800">{item.origem || item.destino}</td>
              <td className="px-4 py-3 text-sm text-gray-800">{item.responsavel}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => onView(item)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

export default function EstoqueModule({ activeSection, onSectionChange }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(false)

  const estoque = useEstoque()
  const { logAction } = useAuditLog()
  const { executeWorkflow, getActiveWorkflows } = useWorkflow()
  const { searchItems } = useData()

  // Buscar dados
  const produtos = estoque.produtos.getAll()
  const movimentacoes = estoque.movimentacoes.getAll()
  const inventarios = estoque.inventarios.getAll()

  // Estatísticas com valores padrão
  const estatisticas = useMemo(() => {
    try {
      return estoque.getEstatisticas()
    } catch (error) {
      console.error("Erro ao calcular estatísticas:", error)
      return {
        produtos: {
          total: 0,
          ativos: 0,
          inativos: 0,
          estoqueBaixo: 0,
        },
        valorTotal: 0,
      }
    }
  }, [estoque])

  const filteredData = useMemo(() => {
    const data = {
      posicao: produtos,
      movimentacoes,
      inventarios,
    }

    const currentData = data[activeSection] || []

    return currentData.filter((item) => {
      const matchesSearch = Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      )

      const matchesFilter = filterStatus === "all" || item.status === filterStatus

      return matchesSearch && matchesFilter
    })
  }, [activeSection, produtos, movimentacoes, inventarios, searchTerm, filterStatus])

  const handleView = useCallback((item) => {
    setSelectedItem(item)
    // TODO: Implementar modal de visualização
  }, [])

  const handleEdit = useCallback((item) => {
    setSelectedItem(item)
    // TODO: Implementar modal de edição
  }, [])

  const handleDelete = useCallback(
    async (item) => {
      if (confirm(`Deseja realmente excluir este item?`)) {
        try {
          setLoading(true)
          await estoque[activeSection].delete(item.id)
          logAction("delete", activeSection, item.id)
        } catch (error) {
          // Erro já tratado no hook
        } finally {
          setLoading(false)
        }
      }
    },
    [activeSection, estoque, logAction],
  )

  const exportToExcel = useCallback(() => {
    const dataToExport = filteredData.map((item) => {
      if (activeSection === "posicao") {
        return {
          Código: item.codigo,
          Nome: item.nome,
          Categoria: item.categoria,
          "Estoque Atual": item.estoqueAtual || 0,
          "Estoque Mínimo": item.estoqueMin || 0,
          Preço: item.preco || 0,
          Status: item.status,
        }
      } else if (activeSection === "movimentacoes") {
        return {
          Data: new Date(item.data).toLocaleDateString("pt-BR"),
          Produto: item.produto,
          Tipo: item.tipo,
          Quantidade: item.quantidade,
          "Origem/Destino": item.origem || item.destino,
          Responsável: item.responsavel,
        }
      }
      return item
    })

    const ws = XLSX.utils.json_to_sheet(dataToExport)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, activeSection)
    XLSX.writeFile(wb, `${activeSection}_${new Date().toISOString().split("T")[0]}.xlsx`)

    toast({
      title: "Exportação concluída",
      description: `Relatório de ${activeSection} exportado com sucesso.`,
    })
  }, [activeSection, filteredData])

  const sectionTitle = {
    posicao: "Posição de Estoque",
    movimentacoes: "Movimentações",
    inventarios: "Inventários",
  }[activeSection]

  const renderContent = () => {
    switch (activeSection) {
      case "posicao":
        return filteredData.length > 0 ? (
          <ProdutosTable produtos={filteredData} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
        ) : (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{searchTerm ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}</p>
          </div>
        )

      case "movimentacoes":
        return filteredData.length > 0 ? (
          <MovimentacoesTable
            movimentacoes={filteredData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        ) : (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {searchTerm ? "Nenhuma movimentação encontrada" : "Nenhuma movimentação registrada"}
            </p>
          </div>
        )

      default:
        return <ProdutosTable produtos={filteredData} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
    }
  }

  const showSearchAndNew = ["posicao", "movimentacoes", "inventarios"].includes(activeSection)

  return (
    <div className="flex h-screen bg-gray-50">
      <EstoqueSidebar activeSection={activeSection} onSectionChange={onSectionChange} />
      <div className="flex-1 p-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{sectionTitle}</h2>
              <p className="text-gray-500">Gestão completa de estoque e inventário</p>
            </div>
            {showSearchAndNew && (
              <div className="flex items-center space-x-3">
                <Button onClick={exportToExcel} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar XLSX
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo
                </Button>
              </div>
            )}
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
                    <p className="text-2xl font-bold text-blue-600">{estatisticas.produtos.total}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Produtos Ativos</p>
                    <p className="text-2xl font-bold text-green-600">{estatisticas.produtos.ativos}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Estoque Baixo</p>
                    <p className="text-2xl font-bold text-yellow-600">{estatisticas.produtos.estoqueBaixo}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Valor Total</p>
                    <p className="text-2xl font-bold text-purple-600">
                      R$ {estatisticas.valorTotal.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          {showSearchAndNew && (
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={`Buscar ${activeSection}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="baixo">Estoque Baixo</SelectItem>
                  <SelectItem value="zerado">Zerado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Conteúdo Principal */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-gray-800">{sectionTitle}</CardTitle>
            </CardHeader>
            <CardContent>{renderContent()}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

EstoqueModule.Sidebar = EstoqueSidebar
EstoqueModule.defaultSection = "posicao"
