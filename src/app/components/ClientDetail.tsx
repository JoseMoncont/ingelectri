import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  ArrowLeft, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Package, 
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Wrench,
  FileText,
  Camera
} from 'lucide-react';
import { clients, equipment, maintenanceHistory, technicians } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ClientDetailProps {
  clientId: string;
  onBack: () => void;
  onAssignTechnician: (equipmentId: string) => void;
}

export function ClientDetail({ clientId, onBack, onAssignTechnician }: ClientDetailProps) {
  const client = clients.find(c => c.id === clientId);
  const clientEquipment = equipment.filter(eq => eq.clientId === clientId);
  
  // Simular historial de mantenimientos del cliente
  const clientMaintenanceHistory = [
    {
      id: '1',
      date: '2026-01-08',
      type: 'Preventivo',
      equipmentName: 'Aire Acondicionado Split 12000 BTU',
      technicianName: 'Carlos Ramírez',
      duration: 120,
      status: 'completed',
      observations: 'Limpieza de filtros y revisión general. Equipo en óptimas condiciones.',
      photos: 3
    },
    {
      id: '2',
      date: '2026-01-05',
      type: 'Correctivo',
      equipmentName: 'Aire VRV 24000 BTU',
      technicianName: 'Juan Pérez',
      duration: 180,
      status: 'completed',
      observations: 'Reemplazo de compresor. Fuga reparada correctamente.',
      photos: 5
    },
    {
      id: '3',
      date: '2025-12-28',
      type: 'Preventivo',
      equipmentName: 'Aire Acondicionado Split 12000 BTU',
      technicianName: 'Ana Martínez',
      duration: 90,
      status: 'completed',
      observations: 'Mantenimiento preventivo rutinario. Sin novedades.',
      photos: 2
    },
    {
      id: '4',
      date: '2025-12-15',
      type: 'Preventivo',
      equipmentName: 'Aire VRV 24000 BTU',
      technicianName: 'Carlos Ramírez',
      duration: 110,
      status: 'completed',
      observations: 'Limpieza completa del sistema. Revisión de presiones OK.',
      photos: 4
    },
  ];

  const monthlyData = [
    { month: 'Ago', count: 4 },
    { month: 'Sep', count: 3 },
    { month: 'Oct', count: 5 },
    { month: 'Nov', count: 4 },
    { month: 'Dic', count: 6 },
    { month: 'Ene', count: 2 },
  ];

  if (!client) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Cliente no encontrado</p>
      </div>
    );
  }

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

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-1 hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Clientes
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            {client.name}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <Building2 className="h-3.5 w-3.5" />
            NIT: {client.nit}
          </p>
        </div>
        <Button size="sm" className="bg-brand hover:bg-brand/90 text-white shadow-sm">
          <FileText className="h-4 w-4 mr-2" />
          Generar Reporte
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="px-4 py-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Equipos</p>
                <p className="text-2xl font-bold text-steel mt-1">{client.equipmentCount}</p>
              </div>
              <Package className="h-8 w-8 text-steel opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="px-4 py-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Mantenimientos</p>
                <p className="text-2xl font-bold text-foreground mt-1">{clientMaintenanceHistory.length}</p>
              </div>
              <Wrench className="h-8 w-8 text-muted-foreground opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="px-4 py-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Último Servicio</p>
                <p className="text-base font-bold text-success mt-1">
                  {new Date(client.lastMaintenance).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-success opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="px-4 py-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Tendencia</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-brand" />
                  <p className="text-xl font-bold text-brand">+15%</p>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-brand opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card className="shadow-sm">
        <CardHeader className="px-4 pt-4 pb-0">
          <CardTitle className="text-base font-semibold">Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-steel/10 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-steel" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Teléfono</p>
                  <p className="font-semibold text-sm text-foreground">{client.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-steel/10 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-steel" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-semibold text-sm text-foreground">{client.email}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Dirección</p>
                  <p className="font-semibold text-sm text-foreground">{client.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-brand/10 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-brand" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Contacto Principal</p>
                  <p className="font-semibold text-sm text-foreground">{client.contact}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="equipment" className="space-y-5">
        <TabsList className="grid w-full grid-cols-3 bg-muted p-1 rounded-xl">
          <TabsTrigger value="equipment" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            Equipos
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            Historial
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            Analítica
          </TabsTrigger>
        </TabsList>

        <TabsContent value="equipment" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientEquipment.map((eq) => (
              <Card key={eq.id} className="shadow-sm hover:shadow-md transition-all overflow-hidden">
                <CardHeader className="bg-brand-dark text-white px-4 py-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base font-semibold">{eq.type}</CardTitle>
                      <CardDescription className="text-white/70 mt-0.5 text-xs">
                        {eq.brand} - {eq.model}
                      </CardDescription>
                    </div>
                    {getStatusBadge(eq.status)}
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Serial</p>
                      <p className="font-mono font-semibold text-sm text-foreground">{eq.serial}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Capacidad</p>
                      <p className="font-semibold text-sm text-foreground">{eq.capacity}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Ubicación</p>
                      <p className="font-semibold text-sm text-foreground">{eq.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Instalación</p>
                      <p className="font-semibold text-sm text-foreground">
                        {new Date(eq.installDate).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Último Mtto</p>
                      <p className="font-semibold text-sm text-foreground">
                        {new Date(eq.lastMaintenance).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAssignTechnician(eq.id)}
                    >
                      <Wrench className="h-3.5 w-3.5 mr-1.5" />
                      Asignar Mantenimiento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="px-4 pt-4 pb-0">
              <CardTitle className="text-base font-semibold">Historial de Mantenimientos</CardTitle>
              <CardDescription className="text-xs">Registro completo de servicios realizados</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-3">
              <div className="space-y-3">
                {clientMaintenanceHistory.map((maintenance) => (
                  <div
                    key={maintenance.id}
                    className="border border-border rounded-xl p-4 hover:border-foreground/20 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="font-semibold text-sm text-foreground">{maintenance.equipmentName}</h3>
                          <Badge variant="outline" className={maintenance.type === 'Preventivo' ? 'bg-steel/10 text-steel border-steel/20' : 'bg-warning/10 text-warning border-warning/20'}>
                            {maintenance.type}
                          </Badge>
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Completado
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {new Date(maintenance.date).toLocaleDateString('es-CO')}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
                            {maintenance.technicianName}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            {maintenance.duration} min
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm text-foreground/80 mb-1.5">
                        <span className="font-semibold">Observaciones:</span> {maintenance.observations}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Camera className="h-3 w-3" />
                        {maintenance.photos} fotos adjuntas
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="shadow-sm">
            <CardHeader className="px-4 pt-4 pb-0">
              <CardTitle className="text-base font-semibold">Tendencia de Mantenimientos</CardTitle>
              <CardDescription className="text-xs">Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-3">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis dataKey="month" stroke="#6b6d76" />
                  <YAxis stroke="#6b6d76" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e4e4e7',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#ef8f5f"
                    strokeWidth={2.5}
                    name="Mantenimientos"
                    dot={{ fill: '#ef8f5f', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
