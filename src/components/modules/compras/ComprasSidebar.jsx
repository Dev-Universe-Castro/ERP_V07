"use client"
import { FileText, TrendingUp, ShoppingCart, CheckCircle, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

const ComprasSidebar = ({ activeSection, setActiveSection }) => {
  const sections = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "requisicoes", label: "Requisições", icon: FileText },
    { id: "cotacoes", label: "Cotações", icon: TrendingUp },
    { id: "pedidos", label: "Pedidos", icon: ShoppingCart },
    { id: "aprovacoes", label: "Aprovações", icon: CheckCircle },
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

export default ComprasSidebar
