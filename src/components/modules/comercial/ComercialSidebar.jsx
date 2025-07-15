"use client"
import { ShoppingCart, FileText, DollarSign, Users, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

const ComercialSidebar = ({ activeSection, setActiveSection }) => {
  const sections = [
    { id: "pedidos", label: "Pedidos de Venda", icon: ShoppingCart },
    { id: "propostas", label: "Propostas", icon: FileText },
    { id: "comissoes", label: "Comissões", icon: DollarSign },
    { id: "vendedores", label: "Vendedores", icon: Users },
    { id: "relatorios", label: "Relatórios", icon: BarChart3 },
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

export default ComercialSidebar
