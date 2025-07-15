"use client"

import { useState, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Truck,
  Fuel,
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { useAbastecimento } from "@/hooks/useAbastecimento"
import { useAuditLog } from "@/hooks/useAuditLog"
import { useData } from "@/contexts/DataContext"
import { useWorkflow } from "@/hooks/useWorkflow"
import AbastecimentoSidebar from "./abastecimento/AbastecimentoSidebar"
import AbastecimentoStats from "./abastecimento/AbastecimentoStats"
// import CompliancePanel from "../common/CompliancePanel"
// import WorkflowSteps from "../common/WorkflowSteps"
import * as XLSX from "xlsx"

const getStatusBadge = (status) => {
  const statusMap = {
    ativo: "bg-green-100 text-green-800",
    inativo: "bg-red-100 text-red-800",
    manutencao: "bg-yellow-100 text-yellow-800",
    concluido: "bg-green-100 text-green-800",
    pendente: "bg-yellow-100 text-yellow-800",
    cancelado: "bg-red-100 text-red-800",
  }
  return statusMap[status] || "bg-gray-100 text-gray-800"
}

const getStatusIcon = (status) => {
  switch (status) {
    case "ativo":
    case "concluido":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "pendente":
    case "manutencao":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "inativo":
    case "cancelado":
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    default:
      return <Truck className="h-4 w-4 text-gray-500" />
  }
}

const EquipamentosTable = ({ equipamentos, onEdit, onDelete, onView }) => (
  <div className="data-table rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Código</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nome</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tipo</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Localização</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Capacidade</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Status</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {equipamentos.map((item, index) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-gray-50"
            >
              <td className="px-4 py-3 text-sm text-gray-800 font-mono">{item.codigo}</td>
              <td className="px-4 py-3 text-sm text-gray-800">{item.nome}</td>
              <td className="px-4 py-3 text-sm text-gray-800">{item.tipo}</td>
              <td className="px-4 py-3 text-sm text-gray-800">{item.localizacao}</td>
              <td className="px-4 py-3 text-sm text-gray-800 text-right">{item.capacidade}</td>
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

const AbastecimentosTable = ({ abastecimentos, onEdit, onDelete, onView }) => (
  <div className="data-table rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Data</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Equipamento</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Combustível</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Quantidade</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Valor</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Responsável</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {abastecimentos.map((item, index) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-gray-50"
            >
              <td className="px-4 py-3 text-sm text-gray-800">{new Date(item.data).toLocaleDateString("pt-BR")}</td>
              <td className="px-4 py-3 text-sm text-gray-800">{item.equipamento}</td>
              <td className="px-4 py-3 text-sm text-gray-800">{item.combustivel}</td>
              <td className="px-4 py-3 text-sm text-gray-800 text-right">{item.quantidade} L</td>
              <td className="px-4 py-3 text-sm text-gray-800 text-right font-semibold">
                R$ {(item.valor || 0).toFixed(2)}
              </td>
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

// Regras de compliance para abastecimento
// const complianceRules = [
//   {
//     id: "fuel_controls",
//     name: "Controles de Combustível",
//     description: "Registros de abastecimento completos e auditáveis",
//     category: "Governança",
//   },
//   {
//     id: "vehicle_maintenance",
//     name: "Manutenção Preventiva",
//     description: "Cronograma de manutenção em dia",
//     category: "Operacional",
//   },
//   {
//     id: "consumption_monitoring",
//     name: "Monitoramento de Consumo",
//     description: "Análise de eficiência combustível",
//     category: "Controle",
//   },
//   {
//     id: "cost_control",
//     name: "Controle de Custos",
//     description: "Monitoramento de gastos com combustível",
//     category: "Financeiro",
//   },
//   {
//     id: "fleet_compliance",
//     name: "Conformidade da Frota",
//     description: "Documentação e licenças em dia",
//     category: "Regulatório",
//   },
// ]

export default function AbastecimentoModule({ activeSection, onSectionChange }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [loading, setLoading] = useState(false)

  const abastecimento = useAbastecimento()
  const { logAction } = useAuditLog()
  const { executeWorkflow, getActiveWorkflows } = useWorkflow()
  const { searchItems } = useData()

  // Buscar dados reais
  const data = useMemo(
    () => ({
      equipamentos: abastecimento.equipamentos.getAll(),
      abastecimentos: abastecimento.abastecimentos.getAll(),
      manutencoes: abastecimento.manutencoes.getAll(),
    }),
    [abastecimento.equipamentos, abastecimento.abastecimentos, abastecimento.manutencoes],
  )

  const { equipamentos, abastecimentos, manutencoes } = data

  const abastecimentosComEquipamentos = useMemo(() => {
    return abastecimentos.map((abast) => {
      const equipamento = equipamentos.find((eq) => eq.id === abast.equipamentoId)
      return {
        ...abast,
        equipamento: equipamento?.nome || "Equipamento não encontrado",
        tipoMedidor: equipamento?.medidor || "km",
      }
    })
  }, [abastecimentos, equipamentos])

  const filteredEquipamentos = useMemo(
    () =>
      equipamentos.filter((item) =>
        Object.values(item).some((value) => value?.toString().toLowerCase().includes(searchTerm.toLowerCase())),
      ),
    [equipamentos, searchTerm],
  )

  const filteredAbastecimentos = useMemo(
    () =>
      abastecimentosComEquipamentos.filter((item) =>
        Object.values(item).some((value) => value?.toString().toLowerCase().includes(searchTerm.toLowerCase())),
      ),
    [abastecimentosComEquipamentos, searchTerm],
  )

  const stats = useMemo(() => {
    const totalEquipamentos = equipamentos.length
    const equipamentosAtivos = equipamentos.filter((eq) => eq.status === "ativo").length
    const totalAbastecimentos = abastecimentos.length
    const totalLitros = abastecimentos.reduce((acc, item) => acc + (item.litros || 0), 0)
    const totalGastos = abastecimentos.reduce((acc, item) => acc + (item.valor || 0), 0)

    return {
      totalEquipamentos,
      equipamentosAtivos,
      totalAbastecimentos,
      totalLitros,
      totalGastos,
    }
  }, [equipamentos, abastecimentos])

  const handleView = useCallback((item) => {
    console.log("Visualizar item:", item)
  }, [])

  const handleEdit = useCallback((item) => {
    console.log("Editar item:", item)
  }, [])

  const handleDelete = useCallback(
    async (item) => {
      if (
        confirm(`Deseja realmente excluir ${activeSection === "equipamentos" ? "o equipamento" : "o abastecimento"}?`)
      ) {
        try {
          setLoading(true)

          if (activeSection === "equipamentos") {
            const abastecimentosEquipamento = abastecimentos.filter((ab) => ab.equipamentoId === item.id)
            if (abastecimentosEquipamento.length > 0) {
              toast({
                title: "Não é possível excluir",
                description: "Este equipamento possui abastecimentos registrados.",
                variant: "destructive",
              })
              return
            }

            abastecimento.equipamentos.delete(item.id)
          } else {
            abastecimento.abastecimentos.delete(item.id)
          }

          logAction(
            "DELETE",
            activeSection.toUpperCase(),
            item.id,
            `${activeSection === "equipamentos" ? "Equipamento" : "Abastecimento"} excluído`,
          )
        } catch (error) {
          toast({
            title: "Erro ao excluir",
            description: error.message,
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }
    },
    [activeSection, abastecimentos, abastecimento, logAction],
  )

  const exportToExcel = useCallback(() => {
    let dataToExport, filename

    if (activeSection === "equipamentos") {
      dataToExport = equipamentos.map((item) => ({
        Código: item.codigo,
        Nome: item.nome,
        Tipo: item.tipo,
        "Medidor Atual": item.medidorAtual,
        "Unidade Medidor": item.medidor,
        "Consumo Médio": item.consumoMedio,
        Status: item.status,
      }))
      filename = `equipamentos_${new Date().toISOString().split("T")[0]}.xlsx`
    } else {
      dataToExport = abastecimentosComEquipamentos.map((item) => ({
        Data: new Date(item.data).toLocaleDateString("pt-BR"),
        Equipamento: item.equipamento,
        "Litros Abastecidos": item.litros,
        "Preço por Litro": (item.valor / item.litros).toFixed(2),
        "Valor Total": item.valor,
        "Medidor Anterior": item.medidorAnterior,
        "Medidor Atual": item.medidorAtual,
        "Distância Percorrida": item.medidorAtual - item.medidorAnterior,
        Consumo: item.consumo.toFixed(2),
        Unidade: item.tipoMedidor,
        Posto: item.posto || "N/A",
      }))
      filename = `abastecimentos_${new Date().toISOString().split("T")[0]}.xlsx`
    }

    const ws = XLSX.utils.json_to_sheet(dataToExport)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, activeSection)
    XLSX.writeFile(wb, filename)

    toast({
      title: "Exportação concluída",
      description: `Relatório de ${activeSection} exportado com sucesso.`,
    })
  }, [activeSection, equipamentos, abastecimentosComEquipamentos])

  const sectionTitle = {
    equipamentos: "Equipamentos",
    abastecimentos: "Abastecimentos",
    consumo: "Análise de Consumo",
    relatorios: "Relatórios",
    alertas: "Alertas",
  }[activeSection]

  const renderContent = () => {
    switch (activeSection) {
      case "equipamentos":
        return (
          <div className="flex h-full">
            <div className="w-64 bg-white border-r border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Abastecimento</h2>
              <AbastecimentoSidebar activeSection={activeSection} setActiveSection={onSectionChange} />
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{sectionTitle}</h2>
                    <p className="text-gray-500">Controle completo de frota e combustível</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button onClick={exportToExcel} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar XLSX
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Equipamento
                    </Button>
                  </div>
                </div>

                {/* Estatísticas */}
                <AbastecimentoStats equipamentos={equipamentos} abastecimentos={abastecimentos} />

                {/* Painel de Compliance */}
                {/* <CompliancePanel rules={complianceRules} data={data} /> */}

                {/* Workflows Ativos */}
                {/* <WorkflowSteps steps={getActiveWorkflows("abastecimento")} /> */}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="metric-card">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Equipamentos</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalEquipamentos}</p>
                        <p className="text-xs text-gray-500">{stats.equipamentosAtivos} ativos</p>
                      </div>
                      <Truck className="h-8 w-8 text-yellow-500" />
                    </CardContent>
                  </Card>

                  <Card className="metric-card">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Abastecimentos</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalAbastecimentos}</p>
                      </div>
                      <Clock className="h-8 w-8 text-blue-500" />
                    </CardContent>
                  </Card>

                  <Card className="metric-card">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Litros</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalLitros.toFixed(0)}L</p>
                      </div>
                      <Fuel className="h-8 w-8 text-green-500" />
                    </CardContent>
                  </Card>

                  <Card className="metric-card">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Gastos Totais</p>
                        <p className="text-2xl font-bold text-gray-800">R$ {stats.totalGastos.toFixed(2)}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-500" />
                    </CardContent>
                  </Card>
                </div>

                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar equipamentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-gray-800">{sectionTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredEquipamentos.length > 0 ? (
                      <EquipamentosTable
                        equipamentos={filteredEquipamentos}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handleView}
                      />
                    ) : (
                      <div className="text-center py-12">
                        <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          {searchTerm ? "Nenhum equipamento encontrado" : "Nenhum equipamento cadastrado"}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )

      case "abastecimentos":
        return (
          <div className="flex h-full">
            <div className="w-64 bg-white border-r border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Abastecimento</h2>
              <AbastecimentoSidebar activeSection={activeSection} setActiveSection={onSectionChange} />
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{sectionTitle}</h2>
                    <p className="text-gray-500">Controle completo de frota e combustível</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button onClick={exportToExcel} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar XLSX
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Abastecimento
                    </Button>
                  </div>
                </div>

                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar abastecimentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-gray-800">{sectionTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredAbastecimentos.length > 0 ? (
                      <AbastecimentosTable
                        abastecimentos={filteredAbastecimentos}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handleView}
                      />
                    ) : (
                      <div className="text-center py-12">
                        <Fuel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          {searchTerm ? "Nenhum abastecimento encontrado" : "Nenhum abastecimento registrado"}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="flex h-full">
            <div className="w-64 bg-white border-r border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Abastecimento</h2>
              <AbastecimentoSidebar activeSection={activeSection} setActiveSection={onSectionChange} />
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Seção em desenvolvimento</p>
              </div>
            </div>
          </div>
        )
    }
  }

  return renderContent()
}

AbastecimentoModule.Sidebar = AbastecimentoSidebar
AbastecimentoModule.defaultSection = "equipamentos"
