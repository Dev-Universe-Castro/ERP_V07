"use client"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, DollarSign, TrendingUp, Users } from "lucide-react"

const ComercialStats = ({ estatisticas, indicadores }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pedidos do Mês</p>
              <p className="text-2xl font-bold text-blue-600">{estatisticas?.pedidos?.mes || 0}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Faturamento</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {(estatisticas?.faturamento?.valorMes || 0).toLocaleString("pt-BR")}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ticket Médio</p>
              <p className="text-2xl font-bold text-purple-600">
                R$ {(estatisticas?.vendas?.ticketMedio || 0).toLocaleString("pt-BR")}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Vendedores Ativos</p>
              <p className="text-2xl font-bold text-orange-600">{estatisticas?.vendedores?.ativos || 0}</p>
            </div>
            <Users className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ComercialStats
