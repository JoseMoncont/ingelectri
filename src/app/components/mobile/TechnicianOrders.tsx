import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
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
  Package,
  User,
  Building,
  Folder,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  client: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  createdDate: string;
  dueDate: string;
  location: string;
  time?: string;
  type?: string;
  maintenances: {
    id: string;
    equipment: string;
    type: string;
    status: string;
    technician?: string;
  }[];
  totalValue: number;
  progress: number;
}

interface Project {
  id: string;
  projectName: string;
  client: string;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed';
  startDate: string;
  endDate: string;
  location: string;
  orders: number;
  maintenances: number;
  budget: number;
  spent: number;
  progress: number;
  coordinator: string;
}

interface TechnicianOrdersProps {
  onSelectService?: (service: any) => void;
}

export function TechnicianOrders({ onSelectService }: TechnicianOrdersProps) {
  const [activeView, setActiveView] = useState<'list' | 'orders' | 'projects' | 'order-detail' | 'project-detail'>('list');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Mock data para órdenes de servicio
  const orders: Order[] = [
    {
      id: 'ORD-001',
      orderNumber: 'OS-2025-001',
      client: 'Hotel Plaza Real',
      status: 'in_progress',
      priority: 'high',
      createdDate: '2025-01-08',
      dueDate: '2025-01-15',
      location: 'Carrera 7 #72-50, Bogotá',
      time: '09:00 AM',
      type: 'Preventivo',
      maintenances: [
        { id: 'M1', equipment: 'Chiller Central', type: 'Preventivo', status: 'completed', technician: 'Tú' },
        { id: 'M2', equipment: 'Sistema HVAC Piso 3', type: 'Correctivo', status: 'in_progress', technician: 'Tú' },
        { id: 'M3', equipment: 'Sistema HVAC Piso 5', type: 'Preventivo', status: 'pending' }
      ],
      totalValue: 4500000,
      progress: 33
    },
    {
      id: 'ORD-002',
      orderNumber: 'OS-2025-002',
      client: 'Centro Comercial Norte',
      status: 'pending',
      priority: 'medium',
      createdDate: '2025-01-09',
      dueDate: '2025-01-12',
      location: 'Autopista Norte Km 5',
      time: '02:00 PM',
      type: 'Preventivo',
      maintenances: [
        { id: 'M4', equipment: 'Cuarto Frío 1', type: 'Preventivo', status: 'pending' },
        { id: 'M5', equipment: 'Cuarto Frío 2', type: 'Preventivo', status: 'pending' }
      ],
      totalValue: 2800000,
      progress: 0
    },
    {
      id: 'ORD-003',
      orderNumber: 'OS-2025-003',
      client: 'Clínica Santa María',
      status: 'completed',
      priority: 'high',
      createdDate: '2025-01-05',
      dueDate: '2025-01-10',
      location: 'Calle 100 #15-20',
      time: '08:00 AM',
      type: 'Correctivo',
      maintenances: [
        { id: 'M6', equipment: 'Aire Acondicionado Quirófano 1', type: 'Correctivo', status: 'completed', technician: 'Tú' },
        { id: 'M7', equipment: 'Sistema de Ventilación UCI', type: 'Preventivo', status: 'completed', technician: 'Tú' }
      ],
      totalValue: 3200000,
      progress: 100
    }
  ];

  const projects: Project[] = [
    {
      id: 'PROJ-001',
      projectName: 'Modernización HVAC Torre Empresarial',
      client: 'Corporación XYZ',
      status: 'in_progress',
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      location: 'Calle 26 #92-32, Bogotá',
      orders: 12,
      maintenances: 45,
      budget: 85000000,
      spent: 42000000,
      progress: 60,
      coordinator: 'Ing. Carlos Ruiz'
    },
    {
      id: 'PROJ-002',
      projectName: 'Mantenimiento Centros Comerciales 2025',
      client: 'Grupo Retail Colombia',
      status: 'in_progress',
      startDate: '2025-01-15',
      endDate: '2025-12-31',
      location: 'Múltiples sedes',
      orders: 24,
      maintenances: 120,
      budget: 150000000,
      spent: 18000000,
      progress: 15,
      coordinator: 'Ing. María Gómez'
    }
  ];

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setActiveView('order-detail');
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setActiveView('project-detail');
  };

  const handleStartMaintenance = (order: Order) => {
    // Convertir orden a formato de servicio para la agenda
    if (onSelectService) {
      onSelectService({
        id: order.orderNumber,
        client: order.client,
        location: order.location,
        time: order.time || '09:00 AM',
        type: order.type || 'Preventivo',
        priority: order.priority,
        status: order.status
      });
    }
  };

  const renderMainList = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">Órdenes y Proyectos</h1>
        <p className="text-sm opacity-90">Gestiona tus asignaciones</p>
      </div>

      <div className="p-6 space-y-4">
        <Card 
          className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer"
          onClick={() => setActiveView('orders')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <ClipboardList className="h-7 w-7 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg text-gray-900">Órdenes de Servicio</p>
                <p className="text-sm text-gray-600">
                  {orders.filter(o => o.status === 'in_progress').length} en progreso · {orders.filter(o => o.status === 'pending').length} pendientes
                </p>
              </div>
              <ChevronRight className="h-6 w-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer"
          onClick={() => setActiveView('projects')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <Folder className="h-7 w-7 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg text-gray-900">Proyectos</p>
                <p className="text-sm text-gray-600">
                  {projects.filter(p => p.status === 'in_progress').length} activos
                </p>
              </div>
              <ChevronRight className="h-6 w-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderOrdersList = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setActiveView('list')} className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Órdenes de Servicio</h1>
            <p className="text-sm opacity-90">{orders.length} órdenes totales</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-3">
        {orders.map(order => (
          <Card 
            key={order.id}
            className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer"
            onClick={() => handleSelectOrder(order)}
          >
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-900">{order.orderNumber}</h3>
                    <Badge className={
                      order.priority === 'high' ? 'bg-red-500' :
                      order.priority === 'medium' ? 'bg-orange-500' :
                      'bg-blue-500'
                    }>
                      {order.priority === 'high' ? 'Alta' : order.priority === 'medium' ? 'Media' : 'Baja'}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">{order.client}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    <MapPin className="h-3 w-3" />
                    <span>{order.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <span>Vence: {new Date(order.dueDate).toLocaleDateString('es-CO')}</span>
                  </div>
                </div>
                <Badge className={
                  order.status === 'completed' ? 'bg-green-500' :
                  order.status === 'in_progress' ? 'bg-blue-500' :
                  order.status === 'cancelled' ? 'bg-gray-500' :
                  'bg-orange-500'
                }>
                  {order.status === 'completed' ? 'Completada' :
                   order.status === 'in_progress' ? 'En Progreso' :
                   order.status === 'cancelled' ? 'Cancelada' :
                   'Pendiente'}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Mantenimientos</span>
                  <span className="font-medium">{order.maintenances.filter(m => m.status === 'completed').length}/{order.maintenances.length}</span>
                </div>
                <Progress value={order.progress} className="h-2" />
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Progreso</span>
                  <span className="font-medium">{order.progress}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderOrderDetail = () => {
    if (!selectedOrder) return null;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white p-6 sticky top-0 z-10 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setActiveView('orders')} className="p-2 hover:bg-white/20 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{selectedOrder.orderNumber}</h1>
              <p className="text-sm opacity-90">{selectedOrder.client}</p>
            </div>
            <Badge className={
              selectedOrder.status === 'completed' ? 'bg-green-600' :
              selectedOrder.status === 'in_progress' ? 'bg-orange-600' :
              'bg-gray-600'
            }>
              {selectedOrder.status === 'completed' ? 'Completada' :
               selectedOrder.status === 'in_progress' ? 'En Progreso' :
               'Pendiente'}
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-base">Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cliente:</span>
                <span className="font-medium">{selectedOrder.client}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Ubicación:</span>
                <span className="font-medium text-right">{selectedOrder.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Fecha creación:</span>
                <span className="font-medium">{new Date(selectedOrder.createdDate).toLocaleDateString('es-CO')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Fecha vencimiento:</span>
                <span className="font-medium">{new Date(selectedOrder.dueDate).toLocaleDateString('es-CO')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Valor total:</span>
                <span className="font-bold text-green-600">${selectedOrder.totalValue.toLocaleString('es-CO')}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-base">Mantenimientos ({selectedOrder.maintenances.length})</CardTitle>
              <CardDescription>Equipos a intervenir</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedOrder.maintenances.map(maintenance => (
                  <div key={maintenance.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{maintenance.equipment}</p>
                        <p className="text-xs text-gray-600">{maintenance.type}</p>
                      </div>
                      <Badge className={
                        maintenance.status === 'completed' ? 'bg-green-500' :
                        maintenance.status === 'in_progress' ? 'bg-blue-500' :
                        'bg-orange-500'
                      }>
                        {maintenance.status === 'completed' ? 'Completado' :
                         maintenance.status === 'in_progress' ? 'En Progreso' :
                         'Pendiente'}
                      </Badge>
                    </div>
                    {maintenance.technician && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <User className="h-3 w-3" />
                        <span>{maintenance.technician}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={() => handleStartMaintenance(selectedOrder)}
            className="w-full bg-brand hover:bg-brand"
            size="lg"
          >
            <Wrench className="h-5 w-5 mr-2" />
            Iniciar Mantenimiento
          </Button>
        </div>
      </div>
    );
  };

  const renderProjectsList = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setActiveView('list')} className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Proyectos</h1>
            <p className="text-sm opacity-90">{projects.length} proyectos activos</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-3">
        {projects.map(project => (
          <Card 
            key={project.id}
            className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer"
            onClick={() => handleSelectProject(project)}
          >
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{project.projectName}</h3>
                  <p className="text-sm font-medium text-gray-700 mb-2">{project.client}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    <MapPin className="h-3 w-3" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <User className="h-3 w-3" />
                    <span>{project.coordinator}</span>
                  </div>
                </div>
                <Badge className={
                  project.status === 'completed' ? 'bg-green-500' :
                  project.status === 'in_progress' ? 'bg-blue-500' :
                  project.status === 'on_hold' ? 'bg-yellow-500' :
                  'bg-gray-500'
                }>
                  {project.status === 'completed' ? 'Completado' :
                   project.status === 'in_progress' ? 'En Progreso' :
                   project.status === 'on_hold' ? 'En Espera' :
                   'Planeación'}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600">Órdenes</p>
                  <p className="font-bold text-blue-600">{project.orders}</p>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded-lg">
                  <p className="text-xs text-gray-600">Mtttos</p>
                  <p className="font-bold text-purple-600">{project.maintenances}</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-600">Progreso</p>
                  <p className="font-bold text-green-600">{project.progress}%</p>
                </div>
              </div>

              <Progress value={project.progress} className="h-2 mb-2" />
              
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Presupuesto: ${(project.budget / 1000000).toFixed(1)}M</span>
                <span>Gastado: ${(project.spent / 1000000).toFixed(1)}M</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderProjectDetail = () => {
    if (!selectedProject) return null;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-6 sticky top-0 z-10 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setActiveView('projects')} className="p-2 hover:bg-white/20 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold leading-tight">{selectedProject.projectName}</h1>
              <p className="text-sm opacity-90">{selectedProject.client}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-base">Información del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cliente:</span>
                <span className="font-medium">{selectedProject.client}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Ubicación:</span>
                <span className="font-medium text-right">{selectedProject.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Coordinador:</span>
                <span className="font-medium">{selectedProject.coordinator}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Inicio:</span>
                <span className="font-medium">{new Date(selectedProject.startDate).toLocaleDateString('es-CO')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Finalización:</span>
                <span className="font-medium">{new Date(selectedProject.endDate).toLocaleDateString('es-CO')}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-base">Presupuesto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total presupuestado:</span>
                  <span className="font-bold text-lg">${(selectedProject.budget / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Gastado:</span>
                  <span className="font-bold text-lg text-orange-600">${(selectedProject.spent / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Disponible:</span>
                  <span className="font-bold text-lg text-green-600">${((selectedProject.budget - selectedProject.spent) / 1000000).toFixed(1)}M</span>
                </div>
                <Progress value={(selectedProject.spent / selectedProject.budget) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-4 text-center">
                <ClipboardList className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold text-gray-900">{selectedProject.orders}</p>
                <p className="text-xs text-gray-600">Órdenes de Servicio</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-4 text-center">
                <Wrench className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold text-gray-900">{selectedProject.maintenances}</p>
                <p className="text-xs text-gray-600">Mantenimientos</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  if (activeView === 'orders') return renderOrdersList();
  if (activeView === 'order-detail') return renderOrderDetail();
  if (activeView === 'projects') return renderProjectsList();
  if (activeView === 'project-detail') return renderProjectDetail();
  return renderMainList();
}
