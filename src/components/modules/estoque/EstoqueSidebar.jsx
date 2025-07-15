"use client"

import { Package, TrendingUp, BarChart3, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EstoqueSidebar({ activeSection, setActiveSection }) {
  const sections = [
    { id: "posicao", label: "Posição de Estoque", icon: Package },
    { id: "movimentacoes", label: "Movimentações", icon: TrendingUp },
    { id: "inventarios", label: "Inventários", icon: BarChart3 },
    { id: "relatorios", label: "Relatórios", icon: FileText },
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
