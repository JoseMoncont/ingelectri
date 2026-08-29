import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { QRCodeSVG } from 'qrcode.react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Package,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  Wrench,
  FileText,
  Calendar,
  MapPin,
  Plus,
  Shield,
  QrCode,
  Filter,
  Activity,
  Download,
  Zap,
  TrendingUp
} from 'lucide-react';
import { equipment } from '../data/mockData';
import { CreateEquipmentForm } from './CreateEquipmentForm';

interface EquipmentProps {
  onAssignTechnician?: (equipmentId: string) => void;
}

export function Equipment({ onAssignTechnician }: EquipmentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleSaveEquipment = (newEquipment: any) => {
    console.log('Nuevo equipo creado:', newEquipment);
    // Aquí se integraría con el estado global o API
  };

  const filteredEquipment = equipment.filter(eq =>
    eq.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const config = status === 'operational'
      ? { color: "bg-success/10 text-success border-success/20", label: "Operativo", icon: CheckCircle2 }
      : { color: "bg-warning/10 text-warning border-warning/20", label: "Mantenimiento", icon: AlertCircle };
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={`${config.color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const downloadQR = (serial: string) => {
    const canvas = document.getElementById(`qr-${serial}`) as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `QR-${serial}.png`;
      link.href = url;
      link.click();
    }
  };

  const downloadAllQR = () => {
    alert('Generando códigos QR en lote... (funcionalidad simulada)');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Inventario Maestro
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
            <Package className="h-4 w-4" />
            Gestión integral de activos • {equipment.length} equipos registrados
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar equipos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-sm"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button
            onClick={downloadAllQR}
            variant="outline"
            size="sm"
          >
            <QrCode className="h-4 w-4 mr-2" />
            Generar QR Masivo
          </Button>
          <Button
            onClick={() => setShowCreateForm(true)}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Equipo
          </Button>
        </div>
      </div>

      {/* Equipment List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredEquipment.map((eq) => (
          <Card key={eq.id} className="shadow-sm hover:shadow-md transition-all group">
            <CardContent className="px-4 py-3">
              <div className="flex items-start justify-between gap-6">
                {/* Main Info */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-2">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-brand" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold text-foreground">{eq.type}</h3>
                          {getStatusBadge(eq.status)}
                        </div>
                        <p className="text-muted-foreground text-sm font-medium">{eq.brand} - {eq.model}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">Serial: {eq.serial}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-2 text-foreground/80">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">{eq.clientName}</span>
                        <span className="text-muted-foreground">• {eq.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                        Capacidad: <span className="font-medium">{eq.capacity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Instalación</p>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-steel" />
                        <span className="text-sm font-medium text-foreground">
                          {new Date(eq.installDate).toLocaleDateString('es-CO')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Último Mantenimiento</p>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-warning" />
                        <span className="text-sm font-medium text-foreground">
                          {new Date(eq.lastMaintenance).toLocaleDateString('es-CO')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-steel/10 rounded-lg p-2.5">
                      <p className="text-xs text-steel font-medium mb-1.5">Últimas Lecturas Eléctricas</p>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        <div>
                          <span className="text-muted-foreground">L1:</span>
                          <span className="font-bold text-steel ml-1">{eq.electricalData[eq.electricalData.length - 1].l1}V</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">L2:</span>
                          <span className="font-bold text-steel ml-1">{eq.electricalData[eq.electricalData.length - 1].l2}V</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">L3:</span>
                          <span className="font-bold text-steel ml-1">{eq.electricalData[eq.electricalData.length - 1].l3}V</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Amp:</span>
                          <span className="font-bold text-steel ml-1">{eq.electricalData[eq.electricalData.length - 1].amperage}A</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <Button
                    onClick={() => onAssignTechnician?.(eq.id)}
                    size="sm"
                    variant="outline"
                    className="text-brand border-brand/30 hover:bg-brand/5"
                  >
                    <Wrench className="h-3.5 w-3.5 mr-1.5" />
                    Programar
                  </Button>
                  <button
                    onClick={() => setSelectedEquipment(eq)}
                    className="text-xs font-medium text-steel hover:underline text-center"
                  >
                    Ver hoja de vida →
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Equipment Detail Modal */}
      {selectedEquipment && (
        <Dialog open={!!selectedEquipment} onOpenChange={() => setSelectedEquipment(null)}>
          <DialogContent className="sm:max-w-[75vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-brand/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-brand" />
                </div>
                Hoja de Vida del Equipo
              </DialogTitle>
              <DialogDescription>
                {selectedEquipment.type} - {selectedEquipment.brand} {selectedEquipment.model}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="technical" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="technical">Ficha Técnica</TabsTrigger>
                <TabsTrigger value="electrical">Análisis Eléctrico</TabsTrigger>
                <TabsTrigger value="timeline">Línea de Tiempo</TabsTrigger>
              </TabsList>

              <TabsContent value="technical" className="space-y-3">
                <Card className="shadow-sm">
                  <CardHeader className="px-4 pt-4 pb-0">
                    <CardTitle className="text-base font-semibold">Información Técnica</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Tipo de Equipo</p>
                          <p className="text-sm font-medium text-foreground">{selectedEquipment.type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Marca</p>
                          <p className="text-sm font-medium text-foreground">{selectedEquipment.brand}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Modelo</p>
                          <p className="text-sm font-medium text-foreground">{selectedEquipment.model}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Serial</p>
                          <p className="text-sm font-mono font-medium text-foreground">{selectedEquipment.serial}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Capacidad</p>
                          <p className="text-sm font-medium text-foreground">{selectedEquipment.capacity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Cliente</p>
                          <p className="text-sm font-medium text-foreground">{selectedEquipment.clientName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Ubicación</p>
                          <p className="text-sm font-medium text-foreground">{selectedEquipment.location}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Fecha de Instalación</p>
                          <p className="text-sm font-medium text-foreground">
                            {new Date(selectedEquipment.installDate).toLocaleDateString('es-CO', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="px-4 pt-4 pb-0">
                    <CardTitle className="text-base font-semibold">Código QR del Equipo</CardTitle>
                    <CardDescription className="text-xs">Escaneable desde la app móvil</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-3 flex justify-center">
                    <div className="text-center">
                      <div className="bg-card p-4 rounded-xl border border-border inline-block">
                        <QRCodeSVG
                          id={`qr-${selectedEquipment.serial}`}
                          value={JSON.stringify({
                            id: selectedEquipment.id,
                            serial: selectedEquipment.serial,
                            type: selectedEquipment.type,
                          })}
                          size={200}
                          level="H"
                        />
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => downloadQR(selectedEquipment.serial)}
                          className="text-xs font-medium text-steel hover:underline"
                        >
                          Descargar QR →
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="electrical" className="space-y-3">
                <Card className="shadow-sm">
                  <CardHeader className="px-4 pt-4 pb-0">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-steel" />
                      Tendencia de Voltaje (L1, L2, L3)
                    </CardTitle>
                    <CardDescription className="text-xs">Últimas 4 mediciones</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-3">
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={selectedEquipment.electricalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                        <XAxis
                          dataKey="date"
                          stroke="#6b6d76"
                          tickFormatter={(value) => new Date(value).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis stroke="#6b6d76" domain={['dataMin - 5', 'dataMax + 5']} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e4e4e7',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Line type="monotone" dataKey="l1" stroke="#3b7a94" strokeWidth={3} name="Línea 1" dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="l2" stroke="#16a34a" strokeWidth={3} name="Línea 2" dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="l3" stroke="#f26522" strokeWidth={3} name="Línea 3" dot={{ r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="px-4 pt-4 pb-0">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-warning" />
                      Tendencia de Amperaje
                    </CardTitle>
                    <CardDescription className="text-xs">Consumo de corriente</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-3">
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={selectedEquipment.electricalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                        <XAxis
                          dataKey="date"
                          stroke="#6b6d76"
                          tickFormatter={(value) => new Date(value).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis stroke="#6b6d76" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e4e4e7',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="amperage"
                          stroke="#d97706"
                          strokeWidth={3}
                          name="Amperaje (A)"
                          dot={{ r: 5, fill: '#d97706' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-4 gap-3">
                  {selectedEquipment.electricalData.slice(-1).map((reading: any, idx: number) => (
                    <>
                      <Card key={`l1-${idx}`} className="shadow-sm bg-steel/10">
                        <CardContent className="px-3 py-3 text-center">
                          <p className="text-xs text-steel font-medium mb-1">Línea 1</p>
                          <p className="text-2xl font-bold text-steel">{reading.l1}V</p>
                        </CardContent>
                      </Card>
                      <Card key={`l2-${idx}`} className="shadow-sm bg-success/10">
                        <CardContent className="px-3 py-3 text-center">
                          <p className="text-xs text-success font-medium mb-1">Línea 2</p>
                          <p className="text-2xl font-bold text-success">{reading.l2}V</p>
                        </CardContent>
                      </Card>
                      <Card key={`l3-${idx}`} className="shadow-sm bg-brand/10">
                        <CardContent className="px-3 py-3 text-center">
                          <p className="text-xs text-brand font-medium mb-1">Línea 3</p>
                          <p className="text-2xl font-bold text-brand">{reading.l3}V</p>
                        </CardContent>
                      </Card>
                      <Card key={`amp-${idx}`} className="shadow-sm bg-warning/10">
                        <CardContent className="px-3 py-3 text-center">
                          <p className="text-xs text-warning font-medium mb-1">Amperaje</p>
                          <p className="text-2xl font-bold text-warning">{reading.amperage}A</p>
                        </CardContent>
                      </Card>
                    </>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-3">
                <Card className="shadow-sm">
                  <CardHeader className="px-4 pt-4 pb-0">
                    <CardTitle className="text-base font-semibold">Historial de Intervenciones</CardTitle>
                    <CardDescription className="text-xs">Registro completo de mantenimientos</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-3">
                    <div className="relative">
                      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

                      <div className="space-y-3">
                        {[
                          { date: '2026-01-08', type: 'Preventivo', tech: 'Carlos Ramírez', obs: 'Limpieza completa y revisión de presiones' },
                          { date: '2025-12-08', type: 'Preventivo', tech: 'Juan Pérez', obs: 'Mantenimiento rutinario, sin novedades' },
                          { date: '2025-11-08', type: 'Correctivo', tech: 'María González', obs: 'Reemplazo de capacitor por falla' },
                          { date: '2025-10-08', type: 'Preventivo', tech: 'Carlos Ramírez', obs: 'Revisión trimestral programada' },
                        ].map((item, idx) => (
                          <div key={idx} className="relative flex gap-3 items-start">
                            <div className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center z-10 shadow-sm ${
                              item.type === 'Preventivo'
                                ? 'bg-steel'
                                : 'bg-warning'
                            }`}>
                              <Wrench className="h-4 w-4 text-white" />
                            </div>

                            <div className="ml-13 flex-1 bg-card rounded-lg p-3 shadow-sm border border-border" style={{ marginLeft: '3.25rem' }}>
                              <div className="flex items-start justify-between mb-1.5">
                                <div>
                                  <Badge variant="outline" className={item.type === 'Preventivo' ? 'bg-steel/10 text-steel border-steel/20' : 'bg-warning/10 text-warning border-warning/20'}>
                                    {item.type}
                                  </Badge>
                                  <p className="text-xs text-muted-foreground mt-1.5">{item.tech}</p>
                                </div>
                                <p className="text-xs font-semibold text-foreground">
                                  {new Date(item.date).toLocaleDateString('es-CO', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                              <p className="text-sm text-foreground/80">{item.obs}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Equipment Form */}
      <CreateEquipmentForm 
        open={showCreateForm} 
        onClose={() => setShowCreateForm(false)}
        onSave={handleSaveEquipment}
      />
    </div>
  );
}