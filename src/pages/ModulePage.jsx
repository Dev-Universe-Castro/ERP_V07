"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "@/components/ui/use-toast"

import CadastrosModule from "@/components/modules/CadastrosModule"
import EstoqueModule from "@/components/modules/EstoqueModule"
import AbastecimentoModule from "@/components/modules/AbastecimentoModule"
import ProducaoModule from "@/components/modules/ProducaoModule"
import LogisticaModule from "@/components/modules/LogisticaModule"
import RHModule from "@/components/modules/RHModule"
import ComprasModule from "@/components/modules/ComprasModule"
import FinanceiroModule from "@/components/modules/FinanceiroModule"
import ComercialModule from "@/components/modules/ComercialModule"
import FaturamentoModule from "@/components/modules/FaturamentoModule"
import NotasFiscaisModule from "@/components/modules/NotasFiscaisModule"
import WorkflowModule from "@/components/modules/WorkflowModule"

const moduleConfig = {
  cadastros: { component: CadastrosModule, name: "Cadastros", defaultSection: "clientes" },
  estoque: { component: EstoqueModule, name: "Estoque", defaultSection: "posicao" },
  abastecimento: { component: AbastecimentoModule, name: "Abastecimento", defaultSection: "equipamentos" },
  producao: { component: ProducaoModule, name: "Produção", defaultSection: "ordens" },
  logistica: { component: LogisticaModule, name: "Logística", defaultSection: "romaneios" },
  rh: { component: RHModule, name: "Recursos Humanos", defaultSection: "funcionarios" },
  compras: { component: ComprasModule, name: "Compras", defaultSection: "dashboard" },
  financeiro: { component: FinanceiroModule, name: "Financeiro", defaultSection: "overview" },
  comercial: { component: ComercialModule, name: "Comercial", defaultSection: "pedidos" },
  faturamento: { component: FaturamentoModule, name: "Faturamento", defaultSection: "dashboard" },
  "notas-fiscais": { component: NotasFiscaisModule, name: "Notas Fiscais", defaultSection: "dashboard" },
  workflow: { component: WorkflowModule, name: "Workflow", defaultSection: "minhas-requisicoes" },
}

export default function ModulePage() {
  const { moduleId, sectionId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentSection, setCurrentSection] = useState("")

  const config = moduleConfig[moduleId]

  // Definir seção atual baseada na URL ou padrão
  useEffect(() => {
    if (config) {
      const targetSection = sectionId || config.defaultSection
      if (currentSection !== targetSection) {
        setCurrentSection(targetSection)
      }
    }
  }, [sectionId, config, currentSection])

  // Redirecionar se não há sectionId na URL
  useEffect(() => {
    if (!sectionId && config && currentSection && currentSection !== sectionId) {
      navigate(`/module/${moduleId}/${currentSection}`, { replace: true })
    }
  }, [moduleId, sectionId, navigate, config, currentSection])

  // Verificar permissões
  useEffect(() => {
    if (user && (!user.permissions || !user.permissions.includes(moduleId))) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar este módulo.",
        variant: "destructive",
      })
      navigate("/dashboard")
    }
  }, [user, moduleId, navigate])

  // Redirecionar se módulo não existe
  useEffect(() => {
    if (!config) {
      navigate("/dashboard")
    }
  }, [config, navigate])

  const handleSectionChange = useCallback(
    (newSectionId) => {
      if (newSectionId !== currentSection) {
        setCurrentSection(newSectionId)
        navigate(`/module/${moduleId}/${newSectionId}`)
      }
    },
    [currentSection, moduleId, navigate],
  )

  // Loading state enquanto verifica permissões
  if (!user || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Verificar permissões novamente (redundante mas seguro)
  if (!user.permissions || !user.permissions.includes(moduleId)) {
    return null
  }

  const { component: ModuleComponent, name: moduleName } = config
  const activeSection = currentSection || config.defaultSection

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{moduleName} - ERP FertiCore</title>
        <meta
          name="description"
          content={`Módulo ${moduleName} do sistema ERP FertiCore para gestão empresarial integrada.`}
        />
      </Helmet>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold gradient-text">{moduleName}</h1>
                <p className="text-sm text-gray-500">
                  Usuário: {user.name} • Função: {user.role}
                </p>
              </div>
            </div>

            <Button variant="outline" className="bg-transparent" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - O módulo gerencia seu próprio layout */}
      <main className="p-6">
        <ModuleComponent activeSection={activeSection} onSectionChange={handleSectionChange} />
      </main>
    </div>
  )
}
