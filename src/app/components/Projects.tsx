import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Briefcase,
  Search,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  Package,
  Users,
  Plus,
  Wrench,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { projects, equipment, serviceOrders } from '../data/mockData';
import { CreateProjectForm } from './CreateProjectForm';

export function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const handleSaveProject = (newProject: any) => {
    console.log('Nuevo proyecto creado:', newProject);
    // Aquí se integraría con el estado global o API
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
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
      'planning': { color: 'bg-muted text-muted-foreground border-border', label: 'Planificación', icon: Calendar },
      'active': { color: 'bg-steel/10 text-steel border-steel/20', label: 'Activo', icon: TrendingUp },
      'completed': { color: 'bg-success/10 text-success border-success/20', label: 'Completado', icon: FileText },
      'on-hold': { color: 'bg-warning/10 text-warning border-warning/20', label: 'En Espera', icon: AlertCircle },
    };
    const { color, label, icon: Icon } = config[status] || config.active;
    return (
      <Badge variant="outline" className={`${color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
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

  const activeCount = projects.filter(p => p.status === 'active').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;
  const planningCount = projects.filter(p => p.status === 'planning').length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Gestión de Proyectos
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
            <Briefcase className="h-3.5 w-3.5" />
            Centro de control de proyectos empresariales
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar proyectos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-sm"
            />
          </div>
          <Button className="bg-brand hover:bg-brand/90 text-white" onClick={() => setShowCreateForm(true)}>
            <Briefcase className="h-4 w-4 mr-2" />
            Nuevo Proyecto
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="shadow-sm">
          <CardContent className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-steel font-medium">Activos</p>
                <p className="text-2xl font-bold text-foreground mt-1">{activeCount}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-steel opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-success font-medium">Completados</p>
                <p className="text-2xl font-bold text-foreground mt-1">{completedCount}</p>
              </div>
              <FileText className="h-8 w-8 text-success opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Planificación</p>
                <p className="text-2xl font-bold text-foreground mt-1">{planningCount}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand font-medium">Presupuesto</p>
                <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(totalBudget)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-brand opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-warning font-medium">Ejecutado</p>
                <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(totalSpent)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-warning opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProjects.map((project) => {
          const isOverBudget = project.spent > project.budget;

          return (
            <Card key={project.id} className="shadow-sm hover:shadow-md transition-all group">
              <CardHeader className="px-4 pt-4 pb-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <CardTitle className="text-base font-semibold group-hover:text-brand transition-colors truncate">
                    {project.name}
                  </CardTitle>
                  {getStatusBadge(project.status)}
                </div>
                <CardDescription className="text-xs">
                  {project.clientName} • {project.id}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-3 space-y-3">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">Progreso del Proyecto</span>
                    <span className="text-sm font-bold text-steel">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Manager + Budget */}
                <div className="flex items-center justify-between gap-2 text-sm pt-1 border-t border-border">
                  <span className="text-muted-foreground flex items-center gap-1.5 min-w-0 truncate">
                    <Users className="h-3.5 w-3.5 shrink-0 text-brand" />
                    <span className="truncate">{project.manager}</span>
                  </span>
                  <span className={`font-semibold shrink-0 ${isOverBudget ? 'text-danger' : 'text-foreground'}`}>
                    {formatCurrency(project.budget)}
                  </span>
                </div>

                {/* Action */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-medium text-brand hover:underline"
                  >
                    Ver proyecto completo →
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="sm:max-w-[58vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-brand flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                {selectedProject.name}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {selectedProject.clientName} • {selectedProject.id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Status Row */}
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedProject.status)}
                {getPriorityBadge(selectedProject.priority)}
              </div>

              {/* Overview Grid */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="shadow-sm">
                  <CardContent className="px-4 py-3 text-center">
                    <TrendingUp className="h-6 w-6 text-steel mx-auto mb-1.5" />
                    <p className="text-sm text-steel font-medium">Progreso</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{selectedProject.progress}%</p>
                    <Progress value={selectedProject.progress} className="mt-2 h-1.5" />
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardContent className="px-4 py-3 text-center">
                    <DollarSign className="h-6 w-6 text-brand mx-auto mb-1.5" />
                    <p className="text-sm text-brand font-medium">Presupuesto</p>
                    <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(selectedProject.budget)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total Asignado</p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardContent className="px-4 py-3 text-center">
                    <BarChart3 className="h-6 w-6 text-warning mx-auto mb-1.5" />
                    <p className="text-sm text-warning font-medium">Ejecutado</p>
                    <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(selectedProject.spent)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {((selectedProject.spent / selectedProject.budget) * 100).toFixed(1)}% del total
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardContent className="px-4 py-3 text-center">
                    <Calendar className="h-6 w-6 text-muted-foreground mx-auto mb-1.5" />
                    <p className="text-sm text-muted-foreground font-medium">Duración</p>
                    <p className="text-lg font-bold text-foreground mt-1">
                      {Math.ceil((new Date(selectedProject.endDate).getTime() - new Date(selectedProject.startDate).getTime()) / (1000 * 60 * 60 * 24))} días
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Plazo total</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5 bg-muted p-1 rounded-xl h-11">
                  <TabsTrigger value="overview" className="rounded-lg text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
                    Resumen
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="rounded-lg text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
                    Órdenes ({selectedProject.serviceOrdersCount})
                  </TabsTrigger>
                  <TabsTrigger value="quotations" className="rounded-lg text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
                    Cotizaciones ({selectedProject.quotationsCount})
                  </TabsTrigger>
                  <TabsTrigger value="maintenances" className="rounded-lg text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
                    Mantenimientos ({selectedProject.maintenancesCount})
                  </TabsTrigger>
                  <TabsTrigger value="equipment" className="rounded-lg text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
                    Equipos ({selectedProject.equipmentCount})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <Card className="shadow-sm">
                    <CardHeader className="px-4 pt-4 pb-0">
                      <CardTitle className="text-base font-semibold">Descripción del Proyecto</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-3 space-y-3">
                      <p className="text-sm text-foreground/80">{selectedProject.description}</p>
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Fecha de Inicio</p>
                          <p className="font-semibold text-sm text-foreground">
                            {new Date(selectedProject.startDate).toLocaleDateString('es-CO', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Fecha de Finalización</p>
                          <p className="font-semibold text-sm text-foreground">
                            {new Date(selectedProject.endDate).toLocaleDateString('es-CO', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-muted-foreground mb-1">Gerente del Proyecto</p>
                          <p className="font-semibold text-foreground text-base">{selectedProject.manager}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="orders">
                  <Card className="shadow-sm">
                    <CardHeader className="px-4 pt-4 pb-0">
                      <CardTitle className="text-base font-semibold">Órdenes de Servicio Asociadas</CardTitle>
                      <CardDescription className="text-xs">{selectedProject.serviceOrdersCount} órdenes vinculadas</CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-3">
                      <div className="space-y-2.5">
                        {serviceOrders.filter(o => o.projectId === selectedProject.id).map((order) => (
                          <div key={order.id} className="border border-border rounded-lg p-3 flex items-center justify-between hover:border-foreground/20 transition-colors">
                            <div>
                              <p className="font-semibold text-sm text-foreground">{order.id}</p>
                              <p className="text-sm text-muted-foreground">{order.description}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {new Date(order.scheduledDate).toLocaleDateString('es-CO')}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge
                                variant="outline"
                                className={
                                  order.status === 'completed' ? 'bg-success/10 text-success border-success/20' :
                                  order.status === 'in-progress' ? 'bg-steel/10 text-steel border-steel/20' :
                                  'bg-warning/10 text-warning border-warning/20'
                                }
                              >
                                {order.status === 'completed' ? 'Completado' :
                                 order.status === 'in-progress' ? 'En Progreso' :
                                 'Pendiente'}
                              </Badge>
                              <p className="font-bold text-sm text-success">{formatCurrency(order.totalCost)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="quotations">
                  <Card className="shadow-sm">
                    <CardHeader className="px-4 pt-4 pb-0">
                      <CardTitle className="text-base font-semibold">Cotizaciones del Proyecto</CardTitle>
                      <CardDescription className="text-xs">{selectedProject.quotationsCount} cotizaciones generadas</CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-3">
                      <div className="text-center py-8 text-muted-foreground">
                        <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Cotizaciones asociadas al proyecto</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="maintenances">
                  <Card className="shadow-sm">
                    <CardHeader className="px-4 pt-4 pb-0">
                      <CardTitle className="text-base font-semibold">Historial de Mantenimientos</CardTitle>
                      <CardDescription className="text-xs">{selectedProject.maintenancesCount} intervenciones realizadas</CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-3">
                      <div className="text-center py-8 text-muted-foreground">
                        <Wrench className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Mantenimientos ejecutados en el proyecto</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="equipment">
                  <Card className="shadow-sm">
                    <CardHeader className="px-4 pt-4 pb-0">
                      <CardTitle className="text-base font-semibold">Equipos del Proyecto</CardTitle>
                      <CardDescription className="text-xs">{selectedProject.equipmentCount} equipos bajo gestión</CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-3">
                      <div className="grid grid-cols-2 gap-3">
                        {equipment.filter(e => e.clientId === selectedProject.clientId).slice(0, 6).map((eq) => (
                          <div key={eq.id} className="border border-border rounded-lg p-2.5 flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-success flex items-center justify-center flex-shrink-0">
                              <Package className="h-4.5 w-4.5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-foreground truncate">{eq.type}</p>
                              <p className="text-xs text-muted-foreground truncate">{eq.brand} - {eq.model}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Project Form */}
      <CreateProjectForm 
        open={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSave={handleSaveProject}
      />
    </div>
  );
}