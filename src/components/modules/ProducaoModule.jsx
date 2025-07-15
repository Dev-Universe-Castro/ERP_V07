"use client"

import { useState } from "react"
import { useData } from "../../contexts/DataContext"
import ProducaoSidebar from "./producao/ProducaoSidebar"
import ProducaoStats from "./producao/ProducaoStats"
import OrdensTab from "./producao/OrdensTab"
import PlanejamentoTab from "./producao/PlanejamentoTab"
import RecursosTab from "./producao/RecursosTab"
import QualidadeTab from "./producao/QualidadeTab"

const ProducaoModule = () => {
  const [activeSection, setActiveSection] = useState("dashboard")
  const { searchItems } = useData()

  const renderContent = () => {
    let content

    switch (activeSection) {
      case "dashboard":
        content = (
          <div className="space-y-6">
            <ProducaoStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-medium mb-4">Ordens em Andamento</h3>
                <p className="text-gray-600">Visualização das ordens de produção ativas...</p>
              </div>
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-medium mb-4">Eficiência por Setor</h3>
                <p className="text-gray-600">Gráfico de eficiência por área produtiva...</p>
              </div>
            </div>
          </div>
        )
        break
      case "ordens":
        content = <OrdensTab />
        break
      case "planejamento":
        content = <PlanejamentoTab />
        break
      case "recursos":
        content = <RecursosTab />
        break
      case "qualidade":
        content = <QualidadeTab />
        break
      case "manutencao":
        content = (
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">Manutenção</h3>
            <p className="text-gray-600">Módulo de manutenção em desenvolvimento...</p>
          </div>
        )
        break
      case "monitoramento":
        content = (
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">Monitoramento</h3>
            <p className="text-gray-600">Sistema de monitoramento em tempo real...</p>
          </div>
        )
        break
      default:
        content = (
          <div className="space-y-6">
            <ProducaoStats />
          </div>
        )
    }

    return <div className="flex-1 p-6 overflow-auto">{content}</div>
  }

  return (
    <div className="flex h-full">
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Produção</h2>
        <ProducaoSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      </div>
      {renderContent()}
    </div>
  )
}

export default ProducaoModule
