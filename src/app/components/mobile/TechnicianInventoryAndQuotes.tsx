import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { 
  Package,
  Clock,
  DollarSign,
  Search,
  Plus,
  Minus,
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  FileText,
  Send,
  Play,
  Pause,
  StopCircle,
  Save
} from 'lucide-react';

interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  price: number;
  location: string;
}

interface TimeEntry {
  id: string;
  service: string;
  client: string;
  startTime: string;
  endTime?: string;
  duration: number;
  status: 'running' | 'paused' | 'completed';
  description: string;
}

export function TechnicianInventoryAndQuotes() {
  const [activeView, setActiveView] = useState<'inventory' | 'time' | 'quotes'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<{item: InventoryItem, quantity: number}[]>([]);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [quoteData, setQuoteData] = useState({
    clientName: '',
    equipment: '',
    description: '',
    laborHours: 0,
    laborRate: 45000,
    notes: ''
  });

  // Mock inventory data
  const inventory: InventoryItem[] = [
    { id: '1', code: 'FLT-001', name: 'Filtro de Aire Industrial', category: 'Filtros', stock: 15, minStock: 10, unit: 'unidad', price: 85000, location: 'Bodega A' },
    { id: '2', code: 'GAS-410', name: 'Gas Refrigerante R410A', category: 'Refrigerantes', stock: 8, minStock: 5, unit: 'kg', price: 120000, location: 'Bodega B' },
    { id: '3', code: 'CAP-50', name: 'Capacitor 50uF', category: 'Eléctricos', stock: 25, minStock: 15, unit: 'unidad', price: 35000, location: 'Bodega A' },
    { id: '4', code: 'FLT-002', name: 'Filtro Serpentín', category: 'Filtros', stock: 5, minStock: 10, unit: 'unidad', price: 65000, location: 'Bodega A' },
    { id: '5', code: 'VAL-001', name: 'Válvula Expansión', category: 'Válvulas', stock: 12, minStock: 8, unit: 'unidad', price: 180000, location: 'Bodega B' },
    { id: '6', code: 'OIL-001', name: 'Aceite para Compresor', category: 'Lubricantes', stock: 20, minStock: 10, unit: 'litro', price: 45000, location: 'Bodega C' },
    { id: '7', code: 'SEN-001', name: 'Sensor de Temperatura', category: 'Sensores', stock: 18, minStock: 12, unit: 'unidad', price: 95000, location: 'Bodega A' },
    { id: '8', code: 'BEL-001', name: 'Correa Ventilador A58', category: 'Correas', stock: 3, minStock: 8, unit: 'unidad', price: 28000, location: 'Bodega C' }
  ];

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const addToCart = (item: InventoryItem) => {
    const existing = selectedItems.find(i => i.item.id === item.id);
    if (existing) {
      setSelectedItems(selectedItems.map(i =>
        i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setSelectedItems([...selectedItems, { item, quantity: 1 }]);
    }
    alert(`✅ ${item.name} agregado al carrito`);
  };

  const removeFromCart = (itemId: string) => {
    setSelectedItems(selectedItems.filter(i => i.item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, change: number) => {
    setSelectedItems(selectedItems.map(i => {
      if (i.item.id === itemId) {
        const newQuantity = Math.max(1, i.quantity + change);
        return { ...i, quantity: newQuantity };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const startTimer = (service: string, client: string) => {
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      service,
      client,
      startTime: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      duration: 0,
      status: 'running',
      description: ''
    };
    setActiveTimer(newEntry);
  };

  const pauseTimer = () => {
    if (activeTimer) {
      setActiveTimer({ ...activeTimer, status: 'paused' });
    }
  };

  const resumeTimer = () => {
    if (activeTimer) {
      setActiveTimer({ ...activeTimer, status: 'running' });
    }
  };

  const stopTimer = () => {
    if (activeTimer) {
      const endTime = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
      const completedEntry = {
        ...activeTimer,
        endTime,
        status: 'completed' as const
      };
      setTimeEntries([completedEntry, ...timeEntries]);
      setActiveTimer(null);
      alert('⏱️ Tiempo registrado exitosamente');
    }
  };

  const generateQuote = () => {
    if (!quoteData.clientName || !quoteData.equipment) {
      alert('⚠️ Complete los campos requeridos');
      return;
    }

    const materialsTotal = selectedItems.reduce((sum, item) => 
      sum + (item.item.price * item.quantity), 0
    );
    const laborTotal = quoteData.laborHours * quoteData.laborRate;
    const subtotal = materialsTotal + laborTotal;
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    alert(`✅ Cotización Generada

Cliente: ${quoteData.clientName}
Equipo: ${quoteData.equipment}

Materiales: ${formatCurrency(materialsTotal)}
Mano de Obra: ${formatCurrency(laborTotal)}
Subtotal: ${formatCurrency(subtotal)}
IVA (19%): ${formatCurrency(iva)}
TOTAL: ${formatCurrency(total)}

📧 Enviada al cliente
💾 Guardada en sistema`);

    setShowQuoteModal(false);
    setQuoteData({
      clientName: '',
      equipment: '',
      description: '',
      laborHours: 0,
      laborRate: 45000,
      notes: ''
    });
    setSelectedItems([]);
  };

  const renderInventory = () => (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="pt-4 text-center">
            <Package className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-700">{inventory.length}</p>
            <p className="text-xs text-blue-600">Items</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-orange-50">
          <CardContent className="pt-4 text-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-red-700">
              {inventory.filter(i => i.stock < i.minStock).length}
            </p>
            <p className="text-xs text-red-600">Bajo Stock</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="pt-4 text-center">
            <ShoppingCart className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-700">{selectedItems.length}</p>
            <p className="text-xs text-green-600">Carrito</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Buscar por código, nombre o categoría..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Cart Summary */}
      {selectedItems.length > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-brand/10 to-orange-500/10 border-2 border-brand">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-brand" />
                <span className="font-bold text-gray-900">{selectedItems.length} items seleccionados</span>
              </div>
              <Button
                size="sm"
                className="bg-brand hover:bg-brand"
                onClick={() => setShowQuoteModal(true)}
              >
                Cotizar
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Total: {formatCurrency(selectedItems.reduce((sum, item) => 
                sum + (item.item.price * item.quantity), 0
              ))}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Inventory List */}
      <div className="space-y-2">
        {filteredInventory.map((item) => (
          <Card key={item.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  item.stock < item.minStock 
                    ? 'bg-red-100' 
                    : 'bg-blue-100'
                }`}>
                  <Package className={`h-6 w-6 ${
                    item.stock < item.minStock 
                      ? 'text-red-600' 
                      : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.code}</p>
                    </div>
                    <Badge variant="outline" className="ml-2">{item.category}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div>
                      <span className="text-gray-600">Stock: </span>
                      <span className={`font-semibold ${
                        item.stock < item.minStock ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {item.stock} {item.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Precio: </span>
                      <span className="font-semibold text-gray-900">{formatCurrency(item.price)}</span>
                    </div>
                  </div>
                  {item.stock < item.minStock && (
                    <div className="flex items-center gap-1 text-xs text-red-600 mb-2">
                      <TrendingDown className="h-3 w-3" />
                      <span>Stock bajo - Mínimo: {item.minStock}</span>
                    </div>
                  )}
                  <Button
                    size="sm"
                    onClick={() => addToCart(item)}
                    className="w-full bg-success hover:bg-green-600"
                    disabled={item.stock === 0}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar al Carrito
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTimeTracking = () => (
    <div className="space-y-4">
      {/* Active Timer */}
      {activeTimer ? (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-brand to-orange-600 text-white">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <Clock className="h-12 w-12 mx-auto mb-3 animate-pulse" />
              <p className="text-sm opacity-90">Servicio en Progreso</p>
              <p className="text-3xl font-bold my-2">{formatTime(activeTimer.duration)}</p>
              <p className="text-sm">{activeTimer.client}</p>
              <p className="text-xs opacity-75">{activeTimer.service}</p>
            </div>
            <div className="flex gap-2">
              {activeTimer.status === 'running' ? (
                <Button
                  onClick={pauseTimer}
                  variant="outline"
                  className="flex-1 bg-white/20 border-white/40 hover:bg-white/30 text-white"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </Button>
              ) : (
                <Button
                  onClick={resumeTimer}
                  variant="outline"
                  className="flex-1 bg-white/20 border-white/40 hover:bg-white/30 text-white"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Reanudar
                </Button>
              )}
              <Button
                onClick={stopTimer}
                variant="outline"
                className="flex-1 bg-white/20 border-white/40 hover:bg-white/30 text-white"
              >
                <StopCircle className="h-4 w-4 mr-2" />
                Finalizar
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6 text-center">
            <Clock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">No hay timer activo</p>
            <Button
              onClick={() => startTimer('Servicio de Prueba', 'Cliente Demo')}
              className="bg-brand hover:bg-brand"
            >
              <Play className="h-4 w-4 mr-2" />
              Iniciar Timer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-blue-700">
              {formatTime(timeEntries.reduce((sum, e) => sum + e.duration, 0))}
            </p>
            <p className="text-xs text-blue-600">Total Hoy</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-green-700">{timeEntries.length}</p>
            <p className="text-xs text-green-600">Servicios</p>
          </CardContent>
        </Card>
      </div>

      {/* Time Entries History */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Registro de Hoy</h3>
        {timeEntries.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500 text-sm">No hay registros aún</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {timeEntries.map((entry) => (
              <Card key={entry.id} className="border-0 shadow-md">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{entry.client}</p>
                      <p className="text-xs text-gray-600 mb-2">{entry.service}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          {entry.startTime} - {entry.endTime}
                        </span>
                        <Badge className="bg-green-500">
                          {formatTime(entry.duration)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderQuotes = () => (
    <div className="space-y-4">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand" />
            Generar Cotización
          </CardTitle>
          <CardDescription>
            Crea cotizaciones rápidas en campo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setShowQuoteModal(true)}
            className="w-full bg-brand hover:bg-brand"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Cotización
          </Button>
        </CardContent>
      </Card>

      {/* Recent Quotes */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Cotizaciones Recientes</h3>
        <div className="space-y-2">
          {[
            { id: 'COT-001', client: 'Hotel Plaza Real', amount: 2850000, date: '2025-01-09', status: 'pending' },
            { id: 'COT-002', client: 'Centro Comercial Norte', amount: 1200000, date: '2025-01-08', status: 'approved' },
            { id: 'COT-003', client: 'Empresa XYZ', amount: 3400000, date: '2025-01-07', status: 'pending' }
          ].map((quote) => (
            <Card key={quote.id} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{quote.id}</p>
                    <p className="text-xs text-gray-600">{quote.client}</p>
                  </div>
                  <Badge className={quote.status === 'approved' ? 'bg-green-500' : 'bg-orange-500'}>
                    {quote.status === 'approved' ? 'Aprobada' : 'Pendiente'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{quote.date}</span>
                  <span className="font-bold text-brand">{formatCurrency(quote.amount)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 pb-24 pt-4 px-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Herramientas</h2>
        <p className="text-gray-600">Inventario, tiempo y cotizaciones</p>
      </div>

      {/* Toggle View */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveView('inventory')}
          className={`flex-1 py-2 px-3 rounded-md transition-all font-medium text-sm ${
            activeView === 'inventory'
              ? 'bg-white text-brand shadow-md'
              : 'text-gray-600'
          }`}
        >
          <Package className="h-4 w-4 inline-block mr-1" />
          Inventario
        </button>
        <button
          onClick={() => setActiveView('time')}
          className={`flex-1 py-2 px-3 rounded-md transition-all font-medium text-sm ${
            activeView === 'time'
              ? 'bg-white text-brand shadow-md'
              : 'text-gray-600'
          }`}
        >
          <Clock className="h-4 w-4 inline-block mr-1" />
          Tiempo
        </button>
        <button
          onClick={() => setActiveView('quotes')}
          className={`flex-1 py-2 px-3 rounded-md transition-all font-medium text-sm ${
            activeView === 'quotes'
              ? 'bg-white text-brand shadow-md'
              : 'text-gray-600'
          }`}
        >
          <DollarSign className="h-4 w-4 inline-block mr-1" />
          Cotizar
        </button>
      </div>

      {/* Content */}
      {activeView === 'inventory' && renderInventory()}
      {activeView === 'time' && renderTimeTracking()}
      {activeView === 'quotes' && renderQuotes()}

      {/* Quote Modal */}
      <Dialog open={showQuoteModal} onOpenChange={setShowQuoteModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Cotización</DialogTitle>
            <DialogDescription>Complete los datos de la cotización</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Cliente *</label>
              <Input
                placeholder="Nombre del cliente"
                value={quoteData.clientName}
                onChange={(e) => setQuoteData({...quoteData, clientName: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Equipo *</label>
              <Input
                placeholder="Tipo de equipo"
                value={quoteData.equipment}
                onChange={(e) => setQuoteData({...quoteData, equipment: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Descripción del Servicio</label>
              <Textarea
                placeholder="Detalle el trabajo a realizar..."
                value={quoteData.description}
                onChange={(e) => setQuoteData({...quoteData, description: e.target.value})}
                rows={3}
              />
            </div>

            {/* Materials */}
            <div>
              <label className="text-sm font-medium mb-2 block">Materiales Seleccionados</label>
              {selectedItems.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-3">
                  No hay materiales seleccionados
                </p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedItems.map((item) => (
                    <div key={item.item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.item.name}</p>
                        <p className="text-xs text-gray-600">
                          {formatCurrency(item.item.price)} x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQuantity(item.item.id, -1)}
                          className="h-6 w-6 rounded bg-gray-200 flex items-center justify-center"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.item.id, 1)}
                          className="h-6 w-6 rounded bg-gray-200 flex items-center justify-center"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.item.id)}
                          className="ml-2 text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Labor */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Horas de Trabajo</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  step="0.5"
                  value={quoteData.laborHours}
                  onChange={(e) => setQuoteData({...quoteData, laborHours: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tarifa/Hora</label>
                <Input
                  type="number"
                  placeholder="45000"
                  value={quoteData.laborRate}
                  onChange={(e) => setQuoteData({...quoteData, laborRate: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Notas Adicionales</label>
              <Textarea
                placeholder="Términos, condiciones, garantías..."
                value={quoteData.notes}
                onChange={(e) => setQuoteData({...quoteData, notes: e.target.value})}
                rows={2}
              />
            </div>

            {/* Summary */}
            <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="pt-4">
                <h4 className="font-semibold text-green-900 mb-2">Resumen</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-800">Materiales:</span>
                    <span className="font-semibold text-green-900">
                      {formatCurrency(selectedItems.reduce((sum, item) => 
                        sum + (item.item.price * item.quantity), 0
                      ))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-800">Mano de Obra:</span>
                    <span className="font-semibold text-green-900">
                      {formatCurrency(quoteData.laborHours * quoteData.laborRate)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-green-200">
                    <span className="font-semibold text-green-900">Total:</span>
                    <span className="font-bold text-lg text-green-900">
                      {formatCurrency(
                        selectedItems.reduce((sum, item) => sum + (item.item.price * item.quantity), 0) +
                        (quoteData.laborHours * quoteData.laborRate)
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button
                onClick={() => setShowQuoteModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={generateQuote}
                className="flex-1 bg-brand hover:bg-brand"
              >
                <Send className="h-4 w-4 mr-2" />
                Generar y Enviar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
