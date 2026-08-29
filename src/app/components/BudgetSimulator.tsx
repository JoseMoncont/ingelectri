import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  Calculator,
  Plus,
  Trash2,
  DollarSign,
  FileText,
  Download,
  Send,
  Percent,
  TrendingUp,
  Package
} from 'lucide-react';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export function BudgetSimulator() {
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(19); // IVA 19%

  const addItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = Number(updated.quantity) * Number(updated.unitPrice);
        }
        return updated;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = (subtotal * discount) / 100;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = (subtotalAfterDiscount * tax) / 100;
  const total = subtotalAfterDiscount + taxAmount;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const loadSampleData = () => {
    setClientName('Centro Comercial Plaza Mayor');
    setProjectName('Mantenimiento Preventivo Trimestral Q1 2026');
    setItems([
      { 
        id: '1', 
        description: 'Mantenimiento preventivo aire acondicionado 24,000 BTU', 
        quantity: 8, 
        unitPrice: 150000,
        total: 1200000
      },
      { 
        id: '2', 
        description: 'Recarga gas refrigerante R-410A (por libra)', 
        quantity: 12, 
        unitPrice: 85000,
        total: 1020000
      },
      { 
        id: '3', 
        description: 'Limpieza profunda evaporador y condensador', 
        quantity: 8, 
        unitPrice: 120000,
        total: 960000
      },
      { 
        id: '4', 
        description: 'Reemplazo filtros de aire (set completo)', 
        quantity: 16, 
        unitPrice: 35000,
        total: 560000
      },
      { 
        id: '5', 
        description: 'Mano de obra técnico especializado (hora)', 
        quantity: 24, 
        unitPrice: 45000,
        total: 1080000
      },
    ]);
    setDiscount(10);
  };

  const clearForm = () => {
    setClientName('');
    setProjectName('');
    setItems([{ id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }]);
    setDiscount(0);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Simulador de Presupuestos
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
            <Calculator className="h-4 w-4" />
            Generador interactivo de cotizaciones y presupuestos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadSampleData}>
            <Package className="h-4 w-4 mr-2" />
            Cargar Ejemplo
          </Button>
          <Button variant="ghost" size="sm" onClick={clearForm}>
            Limpiar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Client Info */}
          <Card className="shadow-sm">
            <CardHeader className="px-4 pt-4 pb-0">
              <CardTitle className="text-base font-semibold">Información del Cliente</CardTitle>
              <CardDescription className="text-xs">Datos básicos de la cotización</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-3 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="client">Nombre del Cliente *</Label>
                  <Input
                    id="client"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej: Centro Comercial Plaza Mayor"
                    className="border-border"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="project">Nombre del Proyecto *</Label>
                  <Input
                    id="project"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Ej: Mantenimiento Preventivo Q1 2026"
                    className="border-border"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="shadow-sm">
            <CardHeader className="px-4 pt-4 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Conceptos del Presupuesto</CardTitle>
                  <CardDescription className="text-xs">{items.length} ítem(s) agregado(s)</CardDescription>
                </div>
                <Button onClick={addItem} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Ítem
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-3">
              <div className="space-y-2.5">
                {/* Header */}
                <div className="grid grid-cols-12 gap-3 text-xs font-semibold text-foreground/80 pb-1.5 border-b border-border">
                  <div className="col-span-5">Descripción</div>
                  <div className="col-span-2 text-center">Cantidad</div>
                  <div className="col-span-2 text-right">Precio Unit.</div>
                  <div className="col-span-2 text-right">Total</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Items */}
                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-5">
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder={`Concepto #${index + 1}`}
                        className="border-border"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                        className="border-border text-center"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                        placeholder="0"
                        className="border-border text-right"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="bg-muted border border-border rounded-lg px-3 py-1.5 text-right font-semibold text-sm text-foreground">
                        {formatCurrency(item.total)}
                      </div>
                    </div>
                    <div className="col-span-1 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        className="text-danger hover:text-danger hover:bg-danger/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Adjustments */}
          <Card className="shadow-sm">
            <CardHeader className="px-4 pt-4 pb-0">
              <CardTitle className="text-base font-semibold">Ajustes y Condiciones</CardTitle>
              <CardDescription className="text-xs">Descuentos e impuestos</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="discount" className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-success" />
                    Descuento (%)
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    Descuento: {formatCurrency(discountAmount)}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tax" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-steel" />
                    IVA (%)
                  </Label>
                  <Input
                    id="tax"
                    type="number"
                    min="0"
                    max="100"
                    value={tax}
                    onChange={(e) => setTax(Number(e.target.value))}
                    className="border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    IVA: {formatCurrency(taxAmount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary & Actions */}
        <div className="space-y-4">
          {/* Summary */}
          <Card className="shadow-sm sticky top-6 overflow-hidden">
            <CardHeader className="px-4 pt-4 pb-3 bg-brand text-white">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Resumen del Presupuesto
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-3 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-border">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-sm text-foreground">{formatCurrency(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between pb-1.5 border-b border-border">
                    <span className="text-sm text-success flex items-center gap-1">
                      <Percent className="h-3 w-3" />
                      Descuento ({discount}%)
                    </span>
                    <span className="font-semibold text-sm text-success">
                      -{formatCurrency(discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pb-1.5 border-b border-border">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-sm text-foreground">
                    {formatCurrency(subtotalAfterDiscount)}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-border">
                  <span className="text-sm text-muted-foreground">IVA ({tax}%)</span>
                  <span className="font-semibold text-sm text-foreground">
                    {formatCurrency(taxAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1.5 bg-muted -mx-4 px-4 py-3 rounded-lg">
                  <span className="text-base font-bold text-foreground">TOTAL</span>
                  <span className="text-xl font-bold text-brand">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Button
                  className="w-full bg-success hover:bg-success/90 text-white"
                  size="sm"
                  disabled={!clientName || !projectName || items.some(i => !i.description)}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Presupuesto
                </Button>
                <div className="flex items-center justify-center gap-4 pt-1">
                  <button className="text-xs font-medium text-steel hover:underline flex items-center gap-1">
                    <Download className="h-3.5 w-3.5" />
                    Descargar PDF
                  </button>
                  <button className="text-xs font-medium text-steel hover:underline flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    Guardar Borrador
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="shadow-sm overflow-hidden">
            <CardHeader className="px-4 pt-4 pb-3 bg-steel/10 border-b border-border">
              <CardTitle className="text-sm font-semibold">Información</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-3">
              <div className="space-y-2.5 text-sm text-foreground/80">
                <div className="flex items-start gap-2">
                  <Badge className="bg-steel mt-0.5 flex-shrink-0">1</Badge>
                  <p>Complete los datos del cliente y proyecto</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-steel mt-0.5 flex-shrink-0">2</Badge>
                  <p>Agregue los conceptos con cantidades y precios</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-steel mt-0.5 flex-shrink-0">3</Badge>
                  <p>Ajuste descuentos e impuestos si aplica</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-steel mt-0.5 flex-shrink-0">4</Badge>
                  <p>Envíe o descargue el presupuesto final</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
