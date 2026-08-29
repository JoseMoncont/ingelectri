import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Wrench,
  MapPin,
  DollarSign,
  FileText,
  User
} from 'lucide-react';
import { activeOrders, pendingRequests } from '../data/mockData';
import { Progress } from "./ui/progress";

export function Operations() {
  const [selectedTab, setSelectedTab] = useState('calendar');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, { color: string, label: string }> = {
      high: { color: 'bg-danger/10 text-danger border-danger/20', label: 'Alta' },
      medium: { color: 'bg-warning/10 text-warning border-warning/20', label: 'Media' },
      low: { color: 'bg-success/10 text-success border-success/20', label: 'Baja' },
    };
    const { color, label } = config[priority] || config.medium;
    return <Badge variant="outline" className={`${color} border`}>{label}</Badge>;
  };

  // Simulación de eventos del calendario
  const calendarEvents = [
    { date: '2026-01-09', time: '09:00', client: 'Torre Empresarial', tech: 'Carlos Ramírez', type: 'Preventivo' },
    { date: '2026-01-09', time: '11:00', client: 'CC Andino', tech: 'Juan Pérez', type: 'Correctivo' },
    { date: '2026-01-09', time: '14:00', client: 'Hotel El Dorado', tech: 'María González', type: 'Preventivo' },
    { date: '2026-01-10', time: '08:00', client: 'Hospital San Rafael', tech: 'Ana Martínez', type: 'Preventivo' },
    { date: '2026-01-10', time: '10:30', client: 'Supermercados La Cosecha', tech: 'Carlos Ramírez', type: 'Correctivo' },
    { date: '2026-01-10', time: '15:00', client: 'Plaza Mayor', tech: 'Juan Pérez', type: 'Preventivo' },
  ];

  const weekDays = [
    { short: 'Vie', date: 9 },
    { short: 'Sáb', date: 10 },
    { short: 'Dom', date: 11 },
    { short: 'Lun', date: 12 },
    { short: 'Mar', date: 13 },
    { short: 'Mié', date: 14 },
    { short: 'Jue', date: 15 },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Centro de Operaciones
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Gestión de órdenes de servicio y solicitudes</p>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-5">
        <TabsList className="grid w-full grid-cols-3 bg-muted p-1 rounded-xl h-11">
          <TabsTrigger value="calendar" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendario
          </TabsTrigger>
          <TabsTrigger value="active-orders" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Wrench className="h-4 w-4 mr-2" />
            Órdenes Activas
          </TabsTrigger>
          <TabsTrigger value="requests" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Solicitudes Pendientes ({pendingRequests.length})
          </TabsTrigger>
        </TabsList>

        {/* Calendario de Citas */}
        <TabsContent value="calendar" className="space-y-5">
          <Card className="shadow-sm overflow-hidden gap-0">
            <div className="grid grid-cols-7 divide-x divide-border border-b border-border">
              {weekDays.map((day, index) => (
                <div
                  key={day.short}
                  className={`px-2 py-3 text-center ${
                    index === 0 ? 'bg-brand/10' : day.short === 'Sáb' || day.short === 'Dom' ? 'bg-muted/50' : ''
                  }`}
                >
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{day.short}</p>
                  <p className={`text-lg font-bold mt-0.5 ${index === 0 ? 'text-brand' : 'text-foreground'}`}>
                    {day.date}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 divide-x divide-border">
              {weekDays.map((day, index) => {
                const dayEvents = calendarEvents.filter((_, i) => i % 7 === index && index < 2);
                return (
                  <div
                    key={day.short}
                    className={`p-1.5 space-y-1.5 min-h-[160px] ${day.short === 'Sáb' || day.short === 'Dom' ? 'bg-muted/30' : ''}`}
                  >
                    {dayEvents.map((event, idx) => (
                      <div
                        key={idx}
                        className={`rounded-md px-2 py-1.5 text-xs ${
                          event.type === 'Preventivo' ? 'bg-steel/10' : 'bg-warning/10'
                        }`}
                      >
                        <p className="font-semibold text-foreground">{event.time}</p>
                        <p className="text-foreground/80 truncate">{event.client}</p>
                        <p className="text-muted-foreground flex items-center gap-1 truncate">
                          <User className="h-2.5 w-2.5 shrink-0" />
                          {event.tech}
                        </p>
                      </div>
                    ))}
                    {dayEvents.length === 0 && (
                      <div className="flex items-center justify-center h-full min-h-[120px]">
                        <p className="text-[11px] text-muted-foreground/60">Sin eventos</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Resumen del día */}
          <Card className="shadow-sm">
            <CardHeader className="px-4 pt-4 pb-0">
              <CardTitle className="text-base font-semibold">Resumen del Día - Viernes 9 de Enero</CardTitle>
              <CardDescription className="text-xs">3 servicios programados</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {calendarEvents.slice(0, 3).map((event, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 bg-muted rounded-lg">
                    <div className="h-10 w-10 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {event.time.split(':')[0]}:00
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-sm text-foreground truncate">{event.client}</h4>
                      <p className="text-xs text-muted-foreground truncate">{event.tech}</p>
                    </div>
                    <Badge variant="outline" className={`shrink-0 ${event.type === 'Preventivo' ? 'bg-steel/10 text-steel border-steel/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Órdenes Activas */}
        <TabsContent value="active-orders">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeOrders.map((order) => (
              <Card key={order.id} className="shadow-sm hover:shadow-md transition-all">
                <CardHeader className="px-4 pt-4 pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-semibold truncate">{order.equipment}</CardTitle>
                      <CardDescription className="text-xs truncate">
                        {order.clientName} • {order.id}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={`shrink-0 ${
                        order.status === 'on-site' ? 'bg-steel/10 text-steel border-steel/20' :
                        order.status === 'in-progress' ? 'bg-warning/10 text-warning border-warning/20' :
                        'bg-muted text-muted-foreground border-transparent'
                      }`}
                    >
                      {order.status === 'on-site' ? 'En Sitio' :
                       order.status === 'in-progress' ? 'En Progreso' :
                       'Programado'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-3 space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Wrench className="h-3.5 w-3.5 text-steel" />
                      {order.technician}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(order.scheduledTime).toLocaleTimeString('es-CO', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {order.progress > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-foreground/80">Progreso del Servicio</span>
                        <span className="text-xs font-bold text-brand">{order.progress}%</span>
                      </div>
                      <Progress value={order.progress} className="h-1.5" />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <button className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Ver en mapa
                    </button>
                    <Button size="sm" variant="outline" className="text-brand border-brand/30 hover:bg-brand/5">
                      <FileText className="h-3.5 w-3.5 mr-1.5" />
                      Detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Solicitudes Pendientes */}
        <TabsContent value="requests" className="space-y-3">
          <Alert className="bg-warning/5 border-warning/30">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertTitle>{pendingRequests.length} solicitudes requieren aprobación</AlertTitle>
            <AlertDescription>Revise y apruebe las solicitudes para asignar técnicos.</AlertDescription>
          </Alert>

          {pendingRequests.map((request) => (
            <Card key={request.id} className="shadow-sm hover:shadow-md transition-all">
              <CardContent className="px-4 py-3.5">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-sm text-foreground">{request.clientName}</h3>
                      {getPriorityBadge(request.priority)}
                      <Badge variant="outline" className={
                        request.requestType.includes('Urgente')
                          ? 'border-danger text-danger'
                          : 'border-steel text-steel'
                      }>
                        {request.requestType}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground/80">{request.equipmentType}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{request.description}</p>
                  </div>

                  <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-1 text-xs text-muted-foreground shrink-0 md:w-40">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {request.date}
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-foreground">
                      <DollarSign className="h-3 w-3" />
                      {formatCurrency(request.estimatedCost)}
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" className="border-danger text-danger hover:bg-danger/10">
                      <XCircle className="h-3.5 w-3.5 mr-1.5" />
                      Rechazar
                    </Button>
                    <Button size="sm" className="bg-success hover:bg-success/90 text-white">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                      Aprobar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
