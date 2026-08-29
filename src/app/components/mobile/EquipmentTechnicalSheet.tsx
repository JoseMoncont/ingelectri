import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Package,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Download,
  Calendar,
  MapPin,
  Wrench,
  DollarSign,
  Thermometer,
  Zap,
  Wind,
  Droplets,
  Settings,
  BarChart,
  Image as ImageIcon,
  FileDown,
  Share2,
  QrCode,
  ArrowLeft,
  History,
  ChevronRight,
  Building
} from 'lucide-react';

interface EquipmentData {
  id: string;
  qrCode: string;
  name: string;
  model: string;
  brand: string;
  serialNumber: string;
  location: string;
  client: string;
  installationDate: string;
  warrantyExpiration: string;
  status: 'operational' | 'warning' | 'critical' | 'maintenance';
  specifications: {
    capacity: string;
    power: string;
    refrigerant: string;
    voltage: string;
    current: string;
    weight: string;
  };
  maintenanceHistory: {
    id: string;
    date: string;
    type: string;
    technician: string;
    status: string;
    description: string;
    cost: number;
    nextMaintenance?: string;
  }[];
  documents: {
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
  }[];
  spareParts: {
    id: string;
    name: string;
    partNumber: string;
    lastReplaced?: string;
    nextReplacement?: string;
    stock: number;
  }[];
}

interface EquipmentTechnicalSheetProps {
  equipmentId?: string;
  onClose: () => void;
  onViewMaintenanceHistory?: (maintenanceId: string) => void;
}

export function EquipmentTechnicalSheet({ 
  equipmentId = 'EQ-001', 
  onClose,
  onViewMaintenanceHistory 
}: EquipmentTechnicalSheetProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data completo
  const equipment: EquipmentData = {
    id: equipmentId,
    qrCode: 'QR-CH-001-2024',
    name: 'Chiller Industrial',
    model: 'Carrier 30RB-0802',
    brand: 'Carrier',
    serialNumber: 'CR2024-08-45632',
    location: 'Planta Baja - Cuarto de Máquinas',
    client: 'Empresa XYZ S.A.S',
    installationDate: '2022-03-15',
    warrantyExpiration: '2027-03-15',
    status: 'operational',
    specifications: {
      capacity: '80 TR (281 kW)',
      power: '120 kW',
      refrigerant: 'R-410A (45 kg)',
      voltage: '460V / 3Ph / 60Hz',
      current: '180 A',
      weight: '1250 kg'
    },
    maintenanceHistory: [
      {
        id: 'M001',
        date: '2025-01-08',
        type: 'Preventivo',
        technician: 'Carlos Ramírez',
        status: 'completed',
        description: 'Limpieza de serpentines, revisión de refrigerante, cambio de filtros',
        cost: 850000,
        nextMaintenance: '2025-04-08'
      },
      {
        id: 'M002',
        date: '2024-11-15',
        type: 'Correctivo',
        technician: 'Ana Morales',
        status: 'completed',
        description: 'Reemplazo de capacitor del compresor y ajuste de presiones',
        cost: 1200000,
        nextMaintenance: '2025-01-15'
      },
      {
        id: 'M003',
        date: '2024-09-20',
        type: 'Preventivo',
        technician: 'Pedro Sánchez',
        status: 'completed',
        description: 'Mantenimiento trimestral: limpieza, lubricación y mediciones',
        cost: 750000,
        nextMaintenance: '2024-12-20'
      },
      {
        id: 'M004',
        date: '2024-07-10',
        type: 'Preventivo',
        technician: 'Luis Torres',
        status: 'completed',
        description: 'Revisión general y cambio de aceite del compresor',
        cost: 680000,
        nextMaintenance: '2024-10-10'
      },
      {
        id: 'M005',
        date: '2024-04-05',
        type: 'Correctivo',
        technician: 'Carlos Ramírez',
        status: 'completed',
        description: 'Reparación de fuga en evaporador y recarga de refrigerante',
        cost: 1850000,
        nextMaintenance: '2024-07-05'
      }
    ],
    documents: [
      { id: 'D001', name: 'Manual de Usuario', type: 'PDF', size: '12.5 MB', url: '#' },
      { id: 'D002', name: 'Manual de Servicio', type: 'PDF', size: '25.8 MB', url: '#' },
      { id: 'D003', name: 'Diagrama Eléctrico', type: 'PDF', size: '3.2 MB', url: '#' },
      { id: 'D004', name: 'Certificado de Instalación', type: 'PDF', size: '1.1 MB', url: '#' },
      { id: 'D005', name: 'Hoja de Datos Técnicos', type: 'PDF', size: '850 KB', url: '#' },
      { id: 'D006', name: 'Garantía del Fabricante', type: 'PDF', size: '2.3 MB', url: '#' }
    ],
    spareParts: [
      { id: 'SP001', name: 'Capacitor 50uF', partNumber: 'CAP-50-460V', lastReplaced: '2024-11-15', nextReplacement: '2026-11-15', stock: 3 },
      { id: 'SP002', name: 'Filtro Secador', partNumber: 'FLT-083S', lastReplaced: '2025-01-08', nextReplacement: '2025-07-08', stock: 5 },
      { id: 'SP003', name: 'Aceite POE', partNumber: 'OIL-POE-5L', lastReplaced: '2024-07-10', nextReplacement: '2025-01-10', stock: 8 },
      { id: 'SP004', name: 'Válvula Expansión', partNumber: 'VLV-TXV-R410', nextReplacement: '2025-06-01', stock: 2 },
      { id: 'SP005', name: 'Sensor de Temperatura', partNumber: 'SEN-TEMP-10K', stock: 4 },
      { id: 'SP006', name: 'Contactor 200A', partNumber: 'CNT-200A-3P', stock: 2 }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      case 'maintenance': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'operational': return 'Operacional';
      case 'warning': return 'Advertencia';
      case 'critical': return 'Crítico';
      case 'maintenance': return 'Mantenimiento';
      default: return status;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const calculateHealthScore = () => {
    const daysSinceLastMaintenance = Math.floor(
      (new Date().getTime() - new Date(equipment.maintenanceHistory[0].date).getTime()) / (1000 * 60 * 60 * 24)
    );
    const baseScore = 100;
    const penalty = Math.min(daysSinceLastMaintenance * 2, 30);
    return Math.max(baseScore - penalty, 60);
  };

  const healthScore = calculateHealthScore();

  const renderOverview = () => (
    <div className="space-y-4">
      {/* Equipment Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900">{equipment.name}</h3>
                <Badge className={getStatusColor(equipment.status)}>
                  {getStatusLabel(equipment.status)}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{equipment.brand} - {equipment.model}</p>
              <p className="text-xs text-gray-500 mt-1">S/N: {equipment.serialNumber}</p>
            </div>
            <div className="text-center">
              <QrCode className="h-12 w-12 text-blue-600 mb-1 mx-auto" />
              <p className="text-xs text-gray-600">{equipment.qrCode}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white/50 p-3 rounded-lg">
              <p className="text-gray-600 text-xs mb-1 flex items-center gap-1">
                <Building className="h-3 w-3" />
                Cliente
              </p>
              <p className="font-semibold text-gray-900">{equipment.client}</p>
            </div>
            <div className="bg-white/50 p-3 rounded-lg">
              <p className="text-gray-600 text-xs mb-1 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Ubicación
              </p>
              <p className="font-semibold text-gray-900 text-xs">{equipment.location}</p>
            </div>
            <div className="bg-white/50 p-3 rounded-lg">
              <p className="text-gray-600 text-xs mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Instalación
              </p>
              <p className="font-semibold text-gray-900">{new Date(equipment.installationDate).toLocaleDateString('es-CO')}</p>
            </div>
            <div className="bg-white/50 p-3 rounded-lg">
              <p className="text-gray-600 text-xs mb-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Garantía
              </p>
              <p className="font-semibold text-gray-900">{new Date(equipment.warrantyExpiration).toLocaleDateString('es-CO')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Score */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand" />
              Índice de Salud del Equipo
            </span>
            <span className={`text-2xl font-bold ${
              healthScore >= 90 ? 'text-green-600' :
              healthScore >= 70 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {healthScore}%
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={healthScore} className="h-3 mb-3" />
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <p className="font-bold text-lg text-green-900">
                {equipment.maintenanceHistory.filter(m => m.status === 'completed').length}
              </p>
              <p className="text-green-600">Completados</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="font-bold text-lg text-blue-900">
                {Math.floor((new Date().getTime() - new Date(equipment.maintenanceHistory[0].date).getTime()) / (1000 * 60 * 60 * 24))}
              </p>
              <p className="text-blue-600">Días atrás</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-600 mx-auto mb-1" />
              <p className="font-bold text-xs text-orange-900">
                {equipment.maintenanceHistory[0].nextMaintenance ? new Date(equipment.maintenanceHistory[0].nextMaintenance).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }) : 'N/A'}
              </p>
              <p className="text-orange-600">Próximo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="pt-4 text-center">
            <Wrench className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{equipment.maintenanceHistory.length}</p>
            <p className="text-xs text-purple-600">Mantenimientos</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="pt-4 text-center">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-green-900">
              {formatCurrency(equipment.maintenanceHistory.reduce((sum, m) => sum + m.cost, 0))}
            </p>
            <p className="text-xs text-green-600">Costo Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Specifications */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            Especificaciones Técnicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
              <Wind className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-600 text-xs">Capacidad</p>
                <p className="font-semibold text-gray-900 text-xs">{equipment.specifications.capacity}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
              <Zap className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-600 text-xs">Potencia</p>
                <p className="font-semibold text-gray-900">{equipment.specifications.power}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
              <Droplets className="h-4 w-4 text-cyan-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-600 text-xs">Refrigerante</p>
                <p className="font-semibold text-gray-900 text-xs">{equipment.specifications.refrigerant}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
              <Zap className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-600 text-xs">Voltaje</p>
                <p className="font-semibold text-gray-900 text-xs">{equipment.specifications.voltage}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
              <Zap className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-600 text-xs">Corriente</p>
                <p className="font-semibold text-gray-900">{equipment.specifications.current}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
              <Package className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-600 text-xs">Peso</p>
                <p className="font-semibold text-gray-900">{equipment.specifications.weight}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900">Historial Completo</h3>
        <Badge variant="outline">{equipment.maintenanceHistory.length} registros</Badge>
      </div>

      {equipment.maintenanceHistory.map((maintenance, index) => (
        <Card 
          key={maintenance.id} 
          className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => {
            if (onViewMaintenanceHistory) {
              onViewMaintenanceHistory(maintenance.id);
            } else {
              alert(`📋 Ver detalles completos del mantenimiento ${maintenance.id}\n\nFecha: ${maintenance.date}\nTécnico: ${maintenance.technician}\nCosto: ${formatCurrency(maintenance.cost)}\n\n${maintenance.description}`);
            }
          }}
        >
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                maintenance.type === 'Preventivo' ? 'bg-blue-100' : 'bg-orange-100'
              }`}>
                {maintenance.type === 'Preventivo' ? (
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-gray-900 text-sm">{maintenance.id}</p>
                      <Badge variant="outline" className="text-xs">
                        {maintenance.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{maintenance.technician}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">{new Date(maintenance.date).toLocaleDateString('es-CO')}</p>
                    <p className="font-bold text-brand text-sm">{formatCurrency(maintenance.cost)}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{maintenance.description}</p>
                {maintenance.nextMaintenance && (
                  <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">
                    <Calendar className="h-3 w-3" />
                    <span>Próximo: {new Date(maintenance.nextMaintenance).toLocaleDateString('es-CO')}</span>
                  </div>
                )}
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900">Documentos Técnicos</h3>
        <Badge variant="outline">{equipment.documents.length} archivos</Badge>
      </div>

      {equipment.documents.map((doc) => (
        <Card key={doc.id} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{doc.name}</p>
                <p className="text-xs text-gray-600">{doc.type} • {doc.size}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`📥 Descargando ${doc.name}...`);
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => alert('📤 Compartir todos los documentos vía email o WhatsApp')}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Compartir
        </Button>
        <Button
          className="flex-1 bg-brand hover:bg-brand"
          onClick={() => alert('📦 Descargando paquete completo de documentos...')}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Descargar ZIP
        </Button>
      </div>
    </div>
  );

  const renderSpareParts = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900">Repuestos Recomendados</h3>
        <Badge variant="outline">{equipment.spareParts.length} items</Badge>
      </div>

      {equipment.spareParts.map((part) => (
        <Card key={part.id} className="border-0 shadow-md">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{part.name}</p>
                <p className="text-xs text-gray-600">P/N: {part.partNumber}</p>
              </div>
              <Badge className={part.stock > 3 ? 'bg-green-500' : part.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}>
                Stock: {part.stock}
              </Badge>
            </div>
            {part.lastReplaced && (
              <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-gray-600 mb-1">Último cambio</p>
                  <p className="font-semibold text-gray-900">{new Date(part.lastReplaced).toLocaleDateString('es-CO')}</p>
                </div>
                {part.nextReplacement && (
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <p className="text-gray-600 mb-1">Próximo cambio</p>
                    <p className="font-semibold text-blue-900">{new Date(part.nextReplacement).toLocaleDateString('es-CO')}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <Button
        variant="outline"
        className="w-full"
        onClick={() => alert('🛒 Agregando repuestos sugeridos al carrito de inventario...')}
      >
        <Package className="h-4 w-4 mr-2" />
        Agregar Sugeridos al Carrito
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Ficha Técnica</h1>
            <p className="text-sm opacity-90">{equipment.name}</p>
          </div>
          <Package className="h-8 w-8" />
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-white border-b sticky top-[112px] z-10">
          <TabsList className="w-full grid grid-cols-4 h-auto">
            <TabsTrigger value="overview" className="text-xs py-3">
              <div className="flex flex-col items-center gap-1">
                <Settings className="h-4 w-4" />
                <span>General</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs py-3">
              <div className="flex flex-col items-center gap-1">
                <History className="h-4 w-4" />
                <span>Historial</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="documents" className="text-xs py-3">
              <div className="flex flex-col items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Docs</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="parts" className="text-xs py-3">
              <div className="flex flex-col items-center gap-1">
                <Package className="h-4 w-4" />
                <span>Repuestos</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content */}
        <div className="p-6 pb-24">
          <TabsContent value="overview">
            {renderOverview()}
          </TabsContent>
          <TabsContent value="history">
            {renderHistory()}
          </TabsContent>
          <TabsContent value="documents">
            {renderDocuments()}
          </TabsContent>
          <TabsContent value="parts">
            {renderSpareParts()}
          </TabsContent>
        </div>
      </Tabs>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="max-w-md mx-auto flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => alert('📸 Agregar fotos del equipo...')}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Fotos
          </Button>
          <Button
            className="flex-1 bg-brand hover:bg-brand"
            onClick={() => alert('🔧 Iniciando nuevo mantenimiento para este equipo...')}
          >
            <Wrench className="h-4 w-4 mr-2" />
            Mantenimiento
          </Button>
        </div>
      </div>
    </div>
  );
}
