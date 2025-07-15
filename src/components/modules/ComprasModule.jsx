"use client"
import { useData } from "../../contexts/DataContext"
import { useCompras } from "../../hooks/useCompras"
import ComprasSidebar from "./compras/ComprasSidebar"
import ComprasStats from "./compras/ComprasStats"
import RequisicoesTab from "./compras/RequisicoesTab"
import CotacoesTab from "./compras/CotacoesTab"
import PedidosTab from "./compras/PedidosTab"
import AprovacoesTab from "./compras/AprovacoesTab"

const ComprasModule = ({ activeSection = "dashboard", onSectionChange }) => {
  const { searchItems } = useData()
  const compras = useCompras()

  // Obter estatísticas
  const stats = compras.getEstatisticas()

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="flex h-full">
            <div className="w-64 bg-white border-r border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Compras</h2>
              <ComprasSidebar activeSection={activeSection} setActiveSection={onSectionChange} />
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <div className="space-y-6">
                <ComprasStats stats={stats} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-medium mb-4">Requisições Pendentes</h3>
                    <p className="text-gray-600">Lista das requisições aguardando aprovação...</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-medium mb-4">Cotações em Andamento</h3>
                    <p className="text-gray-600">Cotações sendo processadas pelos fornecedores...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case "requisicoes":
        return (
          <div className="flex h-full">
            <div className="w-64 bg-white border-r border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Compras</h2>
              <ComprasSidebar activeSection={activeSection} setActiveSection={onSectionChange} />
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <RequisicoesTab />
            </div>
          </div>
        )
      case "cotacoes":
        return (
          <div className="flex h-full">
            <div className="w-64 bg-white border-r border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Compras</h2>
              <ComprasSidebar activeSection={activeSection} setActiveSection={onSectionChange} />
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <CotacoesTab />
            </div>
          </div>
        )
      case "pedidos":
        return (
          <div className="flex h-full">
            <div className="w-64 bg-white border-r border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Compras</h2>
              <ComprasSidebar activeSection={activeSection} setActiveSection={onSectionChange} />
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <PedidosTab />
            </div>
          </div>
        )
      case "aprovacoes":
        return (
          <div className="flex h-full">
            <div className="w-64 bg-white border-r border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Compras</h2>
              <ComprasSidebar activeSection={activeSection} setActiveSection={onSectionChange} />
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <AprovacoesTab />
            </div>
          </div>
        )
      default:
        return (
          <div className="flex h-full">
            <div className="w-64 bg-white border-r border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Compras</h2>
              <ComprasSidebar activeSection={activeSection} setActiveSection={onSectionChange} />
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <div className="space-y-6">
                <ComprasStats stats={stats} />
              </div>
            </div>
          </div>
        )
    }
  }

  return renderContent()
}

export default ComprasModule
