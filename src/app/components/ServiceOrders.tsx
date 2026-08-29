import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import {
  FileText,
  Search,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  Wrench,
  TrendingUp,
  Hammer,
  Star
} from 'lucide-react';
import { serviceOrders, technicians, equipment, maintenanceRecords, installationRecords } from '../data/mockData';
import { CreateServiceOrderForm } from './CreateServiceOrderForm';
import { getAvatarAccentClass } from '../lib/accentColor';

interface ServiceOrdersProps {
  onViewMaintenance?: (maintenanceId: string) => void;
}

export function ServiceOrders({ onViewMaintenance }: ServiceOrdersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filterType, setFilterType] = useState<'all' | 'maintenance' | 'installation'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleSaveOrder = (newOrder: any) => {
    console.log('Nueva orden creada:', newOrder);
    // Aquí se integraría con el estado global o API
  };

  const filteredOrders = serviceOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || order.type === filterType;
    
    return matchesSearch && matchesType;
  });

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
      'in-progress': { color: 'bg-steel/10 text-steel border-steel/20', label: 'En Progreso', icon: AlertCircle },
      'completed': { color: 'bg-success/10 text-success border-success/20', label: 'Completado', icon: CheckCircle2 },
    };
    const { color, label, icon: Icon } = config[status] || config.pending;
    return (
      <Badge variant="outline" className={`${color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    if (type === 'installation') {
      return (
        <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
          <Hammer className="h-3 w-3 mr-1" />
          Montaje/Instalación
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-steel/10 text-steel border-steel/20">
        <Wrench className="h-3 w-3 mr-1" />
        Mantenimiento
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, { color: string, label: string }> = {
      'urgent': { color: 'bg-danger text-white', label: 'Urgente' },
      'high': { color: 'bg-warning text-white', label: 'Alta' },
      'medium': { color: 'bg-steel text-white', label: 'Media' },
      'low': { color: 'bg-muted-foreground text-white', label: 'Baja' },
    };
    const { color, label } = config[priority] || config.medium;
    return <Badge className={color}>{label}</Badge>;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const pendingCount = serviceOrders.filter(o => o.status === 'pending').length;
  const inProgressCount = serviceOrders.filter(o => o.status === 'in-progress').length;
  const completedCount = serviceOrders.filter(o => o.status === 'completed').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Órdenes de Servicio
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
            <FileText className="h-3.5 w-3.5" />
            Gestión integral de órdenes de trabajo
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-sm"
            />
          </div>
          <Button className="bg-brand hover:bg-brand/90 text-white" onClick={() => setShowCreateForm(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Nueva Orden
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-warning font-medium">Pendientes</p>
                <p className="text-2xl font-bold text-foreground mt-1">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-warning opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-steel font-medium">En Progreso</p>
                <p className="text-2xl font-bold text-foreground mt-1">{inProgressCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-steel opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-success font-medium">Completadas</p>
                <p className="text-2xl font-bold text-foreground mt-1">{completedCount}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total</p>
                <p className="text-2xl font-bold text-foreground mt-1">{serviceOrders.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => {
          const orderTechnicians = technicians.filter(t => order.technicians.includes(t.id));
          const orderEquipment = equipment.filter(e => order.equipmentIds.includes(e.id));
          const progressPercent = order.estimatedHours > 0 ? (order.actualHours / order.estimatedHours) * 100 : 0;

          return (
            <Card key={order.id} className="shadow-sm hover:shadow-md transition-all group">
              <CardHeader className="px-4 pt-4 pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <CardTitle className="text-base font-semibold">{order.id}</CardTitle>
                      {getStatusBadge(order.status)}
                      {getPriorityBadge(order.priority)}
                      {getTypeBadge(order.type)}
                    </div>
                    <CardDescription className="text-xs truncate">
                      {order.clientName} • {order.description}
                    </CardDescription>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">Costo Total</p>
                    <p className="text-lg font-bold text-success">
                      {formatCurrency(order.totalCost)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-3 space-y-3">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Horas: {order.actualHours}/{order.estimatedHours}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Programada: {new Date(order.scheduledDate).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-1.5" />
                </div>

                {/* Summary + Actions */}
                <div className="flex items-center justify-between gap-3 pt-1 border-t border-border">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-brand" />
                      {orderTechnicians.length} técnicos
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5 text-success" />
                      {orderEquipment.length} equipos
                    </span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <button
                      onClick={() => {
                        // Buscar el registro de mantenimiento o instalación asociado
                        const maint = maintenanceRecords.find(m => m.serviceOrderId === order.id);
                        const inst = installationRecords.find(i => i.serviceOrderId === order.id);
                        const recordId = maint?.id || inst?.id;
                        if (recordId && onViewMaintenance) {
                          onViewMaintenance(recordId);
                        }
                      }}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
                    >
                      Ver registro técnico
                    </button>
                    <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                      <FileText className="h-3.5 w-3.5 mr-1.5" />
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="sm:max-w-[70vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-brand flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                Orden de Servicio {selectedOrder.id}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {selectedOrder.clientName} • Creada el {new Date(selectedOrder.createdDate).toLocaleDateString('es-CO', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Status & Priority */}
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedOrder.status)}
                {getPriorityBadge(selectedOrder.priority)}
                {selectedOrder.projectName && (
                  <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                    Proyecto: {selectedOrder.projectName}
                  </Badge>
                )}
                {getTypeBadge(selectedOrder.type)}
              </div>

              {/* Main Info */}
              <Card className="shadow-sm">
                <CardHeader className="px-4 pt-4 pb-0">
                  <CardTitle className="text-base font-semibold">Información General</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Cliente</p>
                      <p className="font-semibold text-sm text-foreground">{selectedOrder.clientName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Fecha Programada</p>
                      <p className="font-semibold text-sm text-foreground">
                        {new Date(selectedOrder.scheduledDate).toLocaleDateString('es-CO', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Costo Total</p>
                      <p className="font-semibold text-sm text-success">
                        {formatCurrency(selectedOrder.totalCost)}
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p className="text-xs text-muted-foreground mb-1.5">Descripción del Trabajo</p>
                      <p className="text-sm text-foreground">{selectedOrder.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technicians */}
              <Card className="shadow-sm">
                <CardHeader className="px-4 pt-4 pb-0">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-brand" />
                    Equipo de Técnicos
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-3">
                  <div className="grid grid-cols-2 gap-3">
                    {technicians.filter(t => selectedOrder.technicians.includes(t.id)).map((tech) => (
                      <div key={tech.id} className="border border-border rounded-xl p-3">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-11 w-11">
                            <AvatarFallback className={`${getAvatarAccentClass(tech.id)} text-white text-sm`}>
                              {getInitials(tech.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-foreground">{tech.name}</h4>
                            <p className="text-xs text-muted-foreground">{tech.specialty}</p>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Wrench className="h-3 w-3" />
                                {tech.activeJobs} activos
                              </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                {tech.completedJobs} completados
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                            <Star className="h-3 w-3 mr-1 fill-warning" />
                            {tech.rating}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Equipment */}
              <Card className="shadow-sm">
                <CardHeader className="px-4 pt-4 pb-0">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4 text-success" />
                    Equipos a Intervenir
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-3">
                  <div className="space-y-2">
                    {equipment.filter(e => selectedOrder.equipmentIds.includes(e.id)).map((eq) => (
                      <div key={eq.id} className="border border-border rounded-xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-success flex items-center justify-center">
                            <Package className="h-4.5 w-4.5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-foreground">{eq.type}</h4>
                            <p className="text-xs text-muted-foreground">{eq.brand} {eq.model}</p>
                            <p className="text-xs text-muted-foreground font-mono">{eq.serial}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Ubicación</p>
                          <p className="font-semibold text-sm text-foreground">{eq.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Progress */}
              <Card className="shadow-sm">
                <CardHeader className="px-4 pt-4 pb-0">
                  <CardTitle className="text-base font-semibold">Progreso del Trabajo</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-3">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-foreground/80">
                          Horas Trabajadas: {selectedOrder.actualHours} de {selectedOrder.estimatedHours} estimadas
                        </span>
                        <span className="text-sm font-bold text-steel">
                          {((selectedOrder.actualHours / selectedOrder.estimatedHours) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={(selectedOrder.actualHours / selectedOrder.estimatedHours) * 100} className="h-2" />
                    </div>
                    {selectedOrder.observations && (
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-sm font-semibold text-foreground/80 mb-1.5">Observaciones Actuales:</p>
                        <p className="text-sm text-foreground">{selectedOrder.observations}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Service Order Form */}
      <CreateServiceOrderForm 
        open={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSave={handleSaveOrder}
      />
    </div>
  );
}