import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  ClipboardList,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  FileText,
  Wrench,
  User,
  Building,
  Folder,
  TrendingUp,
  Phone,
  MessageSquare,
  DollarSign,
  Star,
  Download
} from 'lucide-react';

interface ClientOrder {
  id: string;
  orderNumber: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  createdDate: string;
  scheduledDate: string;
  location: string;
  technician?: {
    name: string;
    phone: string;
    rating: number;
  };
  services: {
    id: string;
    name: string;
    status: string;
  }[];
  totalValue: number;
  progress: number;
}

interface ClientProject {
  id: string;
  projectName: string;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed';
  startDate: string;
  endDate: string;
  location: string;
  coordinator: {
    name: string;
    phone: string;
    email: string;
  };
  orders: number;
  services: number;
  budget: number;
  spent: number;
  progress: number;
}

export function ClientProjectsAndOrders() {
  const [activeView, setActiveView] = useState<'orders' | 'projects'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<ClientOrder | null>(null);
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);

  // Mock data para órdenes del cliente
  const orders: ClientOrder[] = [
    {
      id: 'ORD-001',
      orderNumber: 'OS-2025-001',
      status: 'in_progress',
      priority: 'high',
      createdDate: '2025-01-08',
      scheduledDate: '2025-01-09 10:00 AM',
      location: 'Oficina Principal - Piso 3',
      technician: {
        name: 'Carlos Ramírez',
        phone: '+57 300 123 4567',
        rating: 4.8
      },
      services: [
        { id: 'S1', name: 'Mantenimiento Sistema HVAC', status: 'completed' },
        { id: 'S2', name: 'Revisión Chiller Central', status: 'in_progress' },
        { id: 'S3', name: 'Limpieza Ductos', status: 'pending' }
      ],
      totalValue: 2500000,
      progress: 40
    },
    {
      id: 'ORD-002',
      orderNumber: 'OS-2025-002',
      status: 'pending',
      priority: 'medium',
      createdDate: '2025-01-09',
      scheduledDate: '2025-01-12 08:00 AM',
      location: 'Bodega Norte - Cuarto Frío',
      services: [
        { id: 'S4', name: 'Mantenimiento Preventivo Cuarto Frío', status: 'pending' }
      ],
      totalValue: 1200000,
      progress: 0
    },
    {
      id: 'ORD-003',
      orderNumber: 'OS-2024-045',
      status: 'completed',
      priority: 'low',
      createdDate: '2024-12-28',
      scheduledDate: '2025-01-05 02:00 PM',
      location: 'Oficina Principal - Piso 2',
      technician: {
        name: 'Ana Morales',
        phone: '+57 301 234 5678',
        rating: 4.9
      },
      services: [
        { id: 'S5', name: 'Instalación Mini Split', status: 'completed' }
      ],
      totalValue: 3500000,
      progress: 100
    }
  ];

  // Mock data para proyectos del cliente
  const projects: ClientProject[] = [
    {
      id: 'PROJ-001',
      projectName: 'Modernización Sistema de Climatización Completo',
      status: 'in_progress',
      startDate: '2025-01-01',
      endDate: '2025-04-30',
      location: 'Edificio Corporativo',
      coordinator: {
        name: 'Ing. María González',
        phone: '+57 312 345 6789',
        email: 'maria.gonzalez@ingelectri.com'
      },
      orders: 6,
      services: 18,
      budget: 45000000,
      spent: 18000000,
      progress: 45
    },
    {
      id: 'PROJ-002',
      projectName: 'Instalación Sistema Refrigeración Industrial',
      status: 'in_progress',
      startDate: '2024-12-15',
      endDate: '2025-03-15',
      location: 'Planta de Producción',
      coordinator: {
        name: 'Ing. Pedro Sánchez',
        phone: '+57 313 456 7890',
        email: 'pedro.sanchez@ingelectri.com'
      },
      orders: 4,
      services: 12,
      budget: 65000000,
      spent: 42000000,
      progress: 70
    },
    {
      id: 'PROJ-003',
      projectName: 'Contrato Mantenimiento Anual',
      status: 'planning',
      startDate: '2025-02-01',
      endDate: '2026-01-31',
      location: 'Todas las Sedes',
      coordinator: {
        name: 'Ing. Luis Torres',
        phone: '+57 314 567 8901',
        email: 'luis.torres@ingelectri.com'
      },
      orders: 24,
      services: 72,
      budget: 28000000,
      spent: 0,
      progress: 10
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success/10 text-success border-success/20';
      case 'in_progress': return 'bg-steel/10 text-steel border-steel/20';
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'on_hold': return 'bg-warning/10 text-warning border-warning/20';
      case 'cancelled': return 'bg-danger/10 text-danger border-danger/20';
      case 'planning': return 'bg-brand-dark/10 text-brand-dark border-brand-dark/20';
      default: return 'bg-muted text-muted-foreground border-transparent';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in_progress': return 'En Progreso';
      case 'pending': return 'Pendiente';
      case 'on_hold': return 'En Espera';
      case 'cancelled': return 'Cancelado';
      case 'planning': return 'Planificación';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-danger/10 text-danger border-danger/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground border-transparent';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const renderOrders = () => (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 rounded-2xl border border-gray-100 py-3 shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-steel/10">
            <ClipboardList className="h-4.5 w-4.5 text-steel" />
          </div>
          <p className="text-lg font-bold text-gray-900">{orders.filter(o => o.status === 'in_progress').length}</p>
          <p className="text-[11px] text-gray-500">Activas</p>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-warning/10">
            <Clock className="h-4.5 w-4.5 text-warning" />
          </div>
          <p className="text-lg font-bold text-gray-900">{orders.filter(o => o.status === 'pending').length}</p>
          <p className="text-[11px] text-gray-500">Pendientes</p>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-success/10">
            <CheckCircle2 className="h-4.5 w-4.5 text-success" />
          </div>
          <p className="text-lg font-bold text-gray-900">{orders.filter(o => o.status === 'completed').length}</p>
          <p className="text-[11px] text-gray-500">Completadas</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {orders.map((order) => (
          <Card
            key={order.id}
            className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer rounded-3xl"
            onClick={() => setSelectedOrder(order)}
          >
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900">{order.orderNumber}</p>
                    <Badge variant="outline" className={getPriorityColor(order.priority)}>
                      {order.priority === 'high' ? 'Alta' : order.priority === 'medium' ? 'Media' : 'Baja'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <Calendar className="h-3 w-3" />
                    <span>{order.scheduledDate}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>{order.location}</span>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
              </div>

              {order.technician && (
                <div className="flex items-center gap-2 mb-3 p-2 bg-steel/10 rounded-xl">
                  <User className="h-4 w-4 text-steel" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-900">{order.technician.name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-warning fill-warning" />
                      <span className="text-xs text-steel">{order.technician.rating}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Progreso</span>
                  <span className="font-semibold text-gray-900">{order.progress}%</span>
                </div>
                <Progress value={order.progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Wrench className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">{order.services.length} servicios</span>
                </div>
                <span className="font-bold text-brand">{formatCurrency(order.totalValue)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        className="w-full rounded-full bg-brand hover:bg-brand/90"
        onClick={() => toast.success('Solicitud enviada', { description: 'Un asesor te contactará para agendar el servicio.' })}
      >
        <ClipboardList className="h-4 w-4 mr-2" />
        Nueva Orden de Servicio
      </Button>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-gray-100 p-3 text-center shadow-sm">
          <div className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-brand-dark/10">
            <Folder className="h-4.5 w-4.5 text-brand-dark" />
          </div>
          <p className="text-lg font-bold text-gray-900">{projects.length}</p>
          <p className="text-[11px] text-gray-500">Proyectos</p>
        </div>
        <div className="rounded-2xl border border-gray-100 p-3 text-center shadow-sm">
          <div className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-steel/10">
            <TrendingUp className="h-4.5 w-4.5 text-steel" />
          </div>
          <p className="text-lg font-bold text-gray-900">{projects.filter(p => p.status === 'in_progress').length}</p>
          <p className="text-[11px] text-gray-500">Activos</p>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer rounded-3xl"
            onClick={() => setSelectedProject(project)}
          >
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-1 text-sm">{project.projectName}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span>{project.location}</span>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(project.status)}>
                  {getStatusLabel(project.status)}
                </Badge>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Progreso</span>
                  <span className="font-semibold text-gray-900">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="bg-steel/10 p-2 rounded-xl">
                  <p className="text-gray-600 mb-1">Órdenes</p>
                  <p className="font-bold text-steel">{project.orders}</p>
                </div>
                <div className="bg-success/10 p-2 rounded-xl">
                  <p className="text-gray-600 mb-1">Servicios</p>
                  <p className="font-bold text-success">{project.services}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">{project.startDate} - {project.endDate}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 pb-24 pt-9 px-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Mis Servicios</h2>
        <p className="text-sm text-gray-500">Órdenes y proyectos activos</p>
      </div>

      {/* Toggle View */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-full">
        <button
          onClick={() => setActiveView('orders')}
          className={`flex-1 py-2 px-3 rounded-full transition-all text-sm font-medium ${
            activeView === 'orders'
              ? 'bg-white text-brand shadow-sm'
              : 'text-gray-500'
          }`}
        >
          <ClipboardList className="h-4 w-4 inline-block mr-1.5 -mt-0.5" />
          Órdenes
        </button>
        <button
          onClick={() => setActiveView('projects')}
          className={`flex-1 py-2 px-3 rounded-full transition-all text-sm font-medium ${
            activeView === 'projects'
              ? 'bg-white text-brand shadow-sm'
              : 'text-gray-500'
          }`}
        >
          <Folder className="h-4 w-4 inline-block mr-1.5 -mt-0.5" />
          Proyectos
        </button>
      </div>

      {/* Content */}
      {activeView === 'orders' ? renderOrders() : renderProjects()}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedOrder.orderNumber}</span>
                <Badge variant="outline" className={getStatusColor(selectedOrder.status)}>
                  {getStatusLabel(selectedOrder.status)}
                </Badge>
              </DialogTitle>
              <DialogDescription>Detalles de la orden de servicio</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Progress */}
              <Card className="border-0 shadow-md">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progreso</span>
                    <span className="text-2xl font-bold text-brand">{selectedOrder.progress}%</span>
                  </div>
                  <Progress value={selectedOrder.progress} className="h-3" />
                </CardContent>
              </Card>

              {/* Details */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">Información</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Fecha Programada:</span>
                    <span className="font-medium">{selectedOrder.scheduledDate}</span>
                  </div>
                  <div className="flex items-start gap-2 pt-2 border-t">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-gray-700">{selectedOrder.location}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-gray-600">Valor Total:</span>
                    <span className="font-bold text-lg text-brand">
                      {formatCurrency(selectedOrder.totalValue)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Technician */}
              {selectedOrder.technician && (
                <Card className="border-0 shadow-md bg-steel/10 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="h-5 w-5 text-steel" />
                      Técnico Asignado
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-900">{selectedOrder.technician.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 text-warning fill-warning" />
                        <span className="text-sm text-gray-700">{selectedOrder.technician.rating} / 5.0</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        className="flex-1"
                        onClick={() => window.open(`tel:${selectedOrder.technician?.phone}`)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Llamar
                      </Button>
                      <Button
                        className="flex-1 bg-success hover:bg-success/90"
                        onClick={() => toast.info('Chat próximamente disponible')}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Services */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">Servicios</CardTitle>
                  <CardDescription>{selectedOrder.services.length} incluidos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedOrder.services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-sm text-gray-900">{service.name}</p>
                      {service.status === 'completed' && (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      )}
                      {service.status === 'in_progress' && (
                        <Clock className="h-5 w-5 text-steel animate-pulse" />
                      )}
                      {service.status === 'pending' && (
                        <AlertCircle className="h-5 w-5 text-warning" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Button
                className="w-full"
                variant="outline"
                onClick={() => toast.info('Abre la pestaña Rastreo para ver la ubicación en vivo')}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Rastrear Técnico
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProject.projectName}</DialogTitle>
              <DialogDescription>Detalles del proyecto</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Progress */}
              <Card className="border-0 shadow-md bg-brand-dark/5 rounded-2xl">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Avance del Proyecto</span>
                    <span className="text-2xl font-bold text-brand-dark">{selectedProject.progress}%</span>
                  </div>
                  <Progress value={selectedProject.progress} className="h-3" />
                </CardContent>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="border-0 shadow-md rounded-2xl">
                  <CardContent className="pt-4 text-center">
                    <ClipboardList className="h-6 w-6 text-steel mx-auto mb-1" />
                    <p className="text-2xl font-bold text-steel">{selectedProject.orders}</p>
                    <p className="text-xs text-gray-500">Órdenes</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md rounded-2xl">
                  <CardContent className="pt-4 text-center">
                    <Wrench className="h-6 w-6 text-success mx-auto mb-1" />
                    <p className="text-2xl font-bold text-success">{selectedProject.services}</p>
                    <p className="text-xs text-gray-500">Servicios</p>
                  </CardContent>
                </Card>
              </div>

              {/* Details */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">Información</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <Badge variant="outline" className={getStatusColor(selectedProject.status)}>
                      {getStatusLabel(selectedProject.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Inicio:</span>
                    <span className="font-medium">{selectedProject.startDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Finalización:</span>
                    <span className="font-medium">{selectedProject.endDate}</span>
                  </div>
                  <div className="flex items-start gap-2 pt-2 border-t">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-gray-700">{selectedProject.location}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Coordinator */}
              <Card className="border-0 shadow-md bg-steel/10 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-base">Coordinador del Proyecto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900">{selectedProject.coordinator.name}</p>
                    <p className="text-sm text-gray-600">{selectedProject.coordinator.email}</p>
                  </div>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(`tel:${selectedProject.coordinator.phone}`)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {selectedProject.coordinator.phone}
                  </Button>
                </CardContent>
              </Card>

              {/* Budget */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">Presupuesto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-gray-900">{formatCurrency(selectedProject.budget)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Ejecutado:</span>
                    <span className="font-bold text-brand">{formatCurrency(selectedProject.spent)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Disponible:</span>
                    <span className="font-bold text-success">
                      {formatCurrency(selectedProject.budget - selectedProject.spent)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Button
                className="w-full rounded-full bg-brand hover:bg-brand/90"
                onClick={() => toast.success('Generando reporte del proyecto en PDF...')}
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Reporte
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
