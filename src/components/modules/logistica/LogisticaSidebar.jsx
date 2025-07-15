"use client"
import { FileText, Truck, MapPin, Package, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

const LogisticaSidebar = ({ activeSection, setActiveSection }) => {
  const sections = [
    { id: "romaneios", label: "Romaneios", icon: FileText },
    { id: "entregas", label: "Entregas", icon: Truck },
    { id: "rotas", label: "Rotas", icon: MapPin },
    { id: "expedicao", label: "Expedição", icon: Package },
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

export default LogisticaSidebar
