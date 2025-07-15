"use client"
import { BarChart3, CreditCard, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const FinanceiroSidebar = ({ activeSection, setActiveSection }) => {
  const sections = [
    { id: "overview", label: "Visão Geral", icon: BarChart3 },
    { id: "contas", label: "Contas a Pagar/Receber", icon: CreditCard },
    { id: "fluxo", label: "Fluxo de Caixa", icon: TrendingUp },
    { id: "receitas", label: "Receitas", icon: TrendingUp },
    { id: "despesas", label: "Despesas", icon: TrendingDown },
  ]

  return (
    <nav className="space-y-2">
      {sections.map((section) => {
        const Icon = section.icon
        return (
          <Button
            key={section.id}
            variant={activeSection === section.id ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection(section.id)}
          >
            <Icon className="h-4 w-4 mr-2" />
            {section.label}
          </Button>
        )
      })}
    </nav>
  )
}

export default FinanceiroSidebar
