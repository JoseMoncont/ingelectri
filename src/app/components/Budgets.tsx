import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  DollarSign,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  TrendingUp,
  AlertCircle,
  Download,
  Send,
  Calculator,
  Plus
} from 'lucide-react';
import { pendingBudgets } from '../data/mockData';
import { CreateBudgetForm } from './CreateBudgetForm';

interface BudgetsProps {
  onSimulate?: () => void;
}

export function Budgets({ onSimulate }: BudgetsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBudget, setSelectedBudget] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleSaveBudget = (newBudget: any) => {
    console.log('Nuevo presupuesto creado:', newBudget);
    // Aquí se integraría con el estado global o API
  };

  const filteredBudgets = pendingBudgets.filter(budget =>
    budget.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    budget.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    budget.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string, label: string, icon: any }> = {
      'pending': { color: 'bg-warning/10 text-warning border-warning/20', label: 'Pendiente', icon: Clock },
      'approved': { color: 'bg-success/10 text-success border-success/20', label: 'Aprobado', icon: CheckCircle2 },
      'rejected': { color: 'bg-danger/10 text-danger border-danger/20', label: 'Rechazado', icon: XCircle },
      'sent': { color: 'bg-steel/10 text-steel border-steel/20', label: 'Enviado', icon: Send },
    };
    const { color, label, icon: Icon } = config[status] || config.pending;
    return (
      <Badge variant="outline" className={`${color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const pendingCount = pendingBudgets.filter(b => b.status === 'pending').length;
  const approvedCount = pendingBudgets.filter(b => b.status === 'approved').length;
  const totalValue = pendingBudgets.reduce((sum, b) => sum + b.total, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Presupuestos y Autorizaciones
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4" />
            Gestión de cotizaciones y aprobaciones
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cotizaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-sm"
            />
          </div>
          {onSimulate && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSimulate}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Simular Presupuesto
            </Button>
          )}
          <Button
            size="sm"
            className="bg-success hover:bg-success/90 text-white"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Presupuesto
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-warning font-medium">Pendientes</p>
                <p className="text-2xl font-bold text-foreground mt-1">{pendingCount}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(totalValue)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-warning opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-success font-medium">Aprobados</p>
                <p className="text-2xl font-bold text-foreground mt-1">{approvedCount}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-steel font-medium">Total Cotizaciones</p>
                <p className="text-2xl font-bold text-foreground mt-1">{pendingBudgets.length}</p>
              </div>
              <FileText className="h-8 w-8 text-steel opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Budgets Alert */}
      {pendingCount > 0 && (
        <Card className="shadow-sm bg-warning/10">
          <CardContent className="px-4 py-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-warning" />
              <div>
                <p className="font-semibold text-sm text-foreground">
                  {pendingCount} cotizaciones esperan aprobación del cliente
                </p>
                <p className="text-xs text-warning">
                  Valor total pendiente: {formatCurrency(totalValue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Budgets List */}
      <div className="space-y-3">
        {filteredBudgets.map((budget) => (
          <Card key={budget.id} className="shadow-sm hover:shadow-md transition-all">
            <CardHeader className="px-4 pt-4 pb-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-base font-semibold">{budget.clientName}</CardTitle>
                    {getStatusBadge(budget.status)}
                  </div>
                  <CardDescription className="text-xs">
                    {budget.description} • {budget.id}
                  </CardDescription>
                  <p className="text-xs text-muted-foreground mt-1">
                    Equipo: <span className="font-mono">{budget.equipmentSerial}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-xl font-bold text-brand">
                    {formatCurrency(budget.total)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(budget.createdDate).toLocaleDateString('es-CO')}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-3 space-y-3">
              {/* Items */}
              <div className="space-y-1.5">
                {budget.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground shrink-0">{formatCurrency(item.total)}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-border p-3 space-y-1.5 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCurrency(budget.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>IVA (19%)</span>
                  <span>{formatCurrency(budget.tax)}</span>
                </div>
                <div className="flex items-center justify-between pt-1.5 border-t border-border font-bold text-foreground">
                  <span>Total</span>
                  <span className="text-brand">{formatCurrency(budget.total)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <Button size="sm" variant="ghost" className="text-muted-foreground">
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Descargar PDF
                </Button>
                {budget.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="text-danger hover:text-danger">
                      <XCircle className="h-3.5 w-3.5 mr-1.5" />
                      Rechazar
                    </Button>
                    <Button size="sm" className="bg-success hover:bg-success/90 text-white">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                      Marcar como Aprobado
                    </Button>
                  </div>
                )}
                {budget.status === 'approved' && (
                  <Button size="sm" variant="outline">
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    Generar Orden de Servicio
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Budget Form */}
      <CreateBudgetForm 
        open={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSave={handleSaveBudget}
      />
    </div>
  );
}