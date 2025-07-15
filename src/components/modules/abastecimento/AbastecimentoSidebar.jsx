"use client"

import { Truck, Fuel, Wrench, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AbastecimentoSidebar({ activeSection, setActiveSection }) {
  const sections = [
    { id: "equipamentos", label: "Equipamentos", icon: Truck },
    { id: "abastecimentos", label: "Abastecimentos", icon: Fuel },
    { id: "manutencoes", label: "Manutenções", icon: Wrench },
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
