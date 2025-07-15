import { Card, CardContent } from "@/components/ui/card"
import { FileText, CheckCircle, ShoppingCart, DollarSign } from "lucide-react"

const ComprasStats = ({ stats = {} }) => {
  // Valores padrão para evitar erros
  const defaultStats = {
    totalRequisicoes: 0,
    requisicoesAprovadas: 0,
    cotacoesPendentes: 0,
    valorTotalPedidos: 0,
    ...stats,
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Requisições</p>
              <p className="text-2xl font-bold text-blue-600">{defaultStats.totalRequisicoes}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Requisições Aprovadas</p>
              <p className="text-2xl font-bold text-green-600">{defaultStats.requisicoesAprovadas}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cotações Pendentes</p>
              <p className="text-2xl font-bold text-orange-600">{defaultStats.cotacoesPendentes}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Valor Total Pedidos</p>
              <p className="text-2xl font-bold text-purple-600">
                R$ {defaultStats.valorTotalPedidos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ComprasStats
