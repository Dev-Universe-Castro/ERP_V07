"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, Package, MapPin, CheckCircle } from "lucide-react"

const LogisticaStats = ({ estatisticas, indicadores }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Romaneios Ativos</p>
              <p className="text-2xl font-bold text-blue-600">{estatisticas?.romaneios?.emTransito || 0}</p>
            </div>
            <Truck className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Entregas Pendentes</p>
              <p className="text-2xl font-bold text-orange-600">{estatisticas?.entregas?.pendentes || 0}</p>
            </div>
            <Package className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rotas Ativas</p>
              <p className="text-2xl font-bold text-purple-600">{estatisticas?.rotas?.emAndamento || 0}</p>
            </div>
            <MapPin className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Taxa de Entrega</p>
              <p className="text-2xl font-bold text-green-600">{indicadores?.taxaEntrega?.toFixed(1) || 0}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LogisticaStats
