import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  MapPin,
  Navigation,
  Clock,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  Route,
  Activity,
  Locate
} from 'lucide-react';
import { technicians, serviceOrders } from '../data/mockData';

export function TechnicianTracking() {
  const [selectedTechnician, setSelectedTechnician] = useState(technicians[0].id);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const activeTechnicians = technicians.filter(t => t.status === 'active' && t.activeJobs > 0);
  const selectedTech = technicians.find(t => t.id === selectedTechnician);
  const techOrders = serviceOrders.filter(o => 
    o.technicians.includes(selectedTechnician) && o.status === 'in-progress'
  );

  // Simular ubicaciones
  const locations = [
    { lat: 4.6097, lng: -74.0817, name: 'Centro Comercial Plaza Mayor', type: 'current' },
    { lat: 4.6517, lng: -74.0570, name: 'Hospital San Rafael', type: 'next' },
    { lat: 4.5709, lng: -74.2973, name: 'Torre Empresarial', type: 'scheduled' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Rastreo de Técnicos
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" />
            Seguimiento en tiempo real de ubicación y rutas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-success/20 text-success bg-success/10">
            <Activity className="h-4 w-4 mr-2" />
            {activeTechnicians.length} Técnicos Activos
          </Badge>
          <Button>
            <Route className="h-4 w-4 mr-2" />
            Optimizar Rutas
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Technician List */}
        <div className="space-y-4">
          <Card className="shadow-sm overflow-hidden">
            <CardHeader className="px-4 pt-4 pb-0 bg-muted border-b border-border">
              <CardTitle className="text-base font-semibold">Técnicos en Campo</CardTitle>
              <CardDescription className="text-xs">{activeTechnicians.length} técnicos trabajando</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-3 space-y-2.5">
              {activeTechnicians.map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => setSelectedTechnician(tech.id)}
                  className={`w-full text-left border-2 rounded-lg p-3 transition-all ${
                    selectedTechnician === tech.id
                      ? 'border-brand bg-brand/10'
                      : 'border-border bg-card hover:border-foreground/20 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-brand-dark text-white text-sm">
                        {getInitials(tech.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm text-foreground">{tech.name}</h4>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          <Locate className="h-3 w-3 mr-1" />
                          En Ruta
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1.5">{tech.specialty}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-success" />
                          {tech.activeJobs} activos
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-steel" />
                          Última: 5 min
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {selectedTech && (
            <Card className="shadow-sm overflow-hidden">
              <CardHeader className="px-4 pt-4 pb-0 bg-muted border-b border-border">
                <CardTitle className="text-base font-semibold">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-3 space-y-2 text-sm">
                <button className="w-full flex items-center gap-2 text-left text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="h-3.5 w-3.5 text-steel" />
                  <span className="hover:underline">Llamar a {selectedTech.name.split(' ')[0]}</span>
                </button>
                <button className="w-full flex items-center gap-2 text-left text-muted-foreground hover:text-foreground transition-colors">
                  <Route className="h-3.5 w-3.5 text-steel" />
                  <span className="hover:underline">Ver Ruta Completa</span>
                </button>
                <button className="w-full flex items-center gap-2 text-left text-muted-foreground hover:text-foreground transition-colors">
                  <Navigation className="h-3.5 w-3.5 text-steel" />
                  <span className="hover:underline">Enviar Dirección</span>
                </button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Map & Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Simulated Map */}
          <Card className="shadow-sm overflow-hidden">
            <CardHeader className="px-4 pt-4 pb-0 bg-muted border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Mapa de Ubicación</CardTitle>
                  <CardDescription className="text-xs">Vista en tiempo real de {selectedTech?.name}</CardDescription>
                </div>
                <Badge variant="outline" className="border-success/20 text-success bg-success/10">
                  <Activity className="h-3 w-3 mr-1 animate-pulse" />
                  En Vivo
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-3">
              {/* Simulated Map */}
              <div className="relative bg-muted rounded-xl overflow-hidden h-[360px] border-2 border-border">
                {/* Grid pattern to simulate map */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-8 grid-rows-8 h-full">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className="border border-foreground/40"></div>
                    ))}
                  </div>
                </div>

                {/* Street names */}
                <div className="absolute top-4 left-4 bg-card px-3 py-1 rounded-full text-xs font-semibold text-foreground/80 border border-border shadow-md">
                  Av. El Dorado
                </div>
                <div className="absolute top-1/2 right-4 bg-card px-3 py-1 rounded-full text-xs font-semibold text-foreground/80 border border-border shadow-md -rotate-90">
                  Cra. 7
                </div>

                {/* Location markers */}
                <div className="absolute top-[30%] left-[40%] transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-steel rounded-full animate-ping opacity-30"></div>
                    <div className="relative bg-steel text-white p-3 rounded-full shadow-lg">
                      <User className="h-6 w-6" />
                    </div>
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-card px-3 py-2 rounded-lg shadow-lg border border-border whitespace-nowrap">
                      <p className="text-xs font-bold text-steel">Ubicación Actual</p>
                      <p className="text-xs text-muted-foreground">{locations[0].name}</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-[50%] left-[60%] transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="relative bg-brand text-white p-2 rounded-full shadow-lg">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-card px-3 py-2 rounded-lg shadow-lg border border-border whitespace-nowrap">
                      <p className="text-xs font-bold text-brand">Próxima</p>
                      <p className="text-xs text-muted-foreground">{locations[1].name}</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-[70%] left-[30%] transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="relative bg-muted-foreground text-white p-2 rounded-full shadow-lg">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-card px-3 py-2 rounded-lg shadow-lg border border-border whitespace-nowrap">
                      <p className="text-xs font-bold text-muted-foreground">Programada</p>
                      <p className="text-xs text-muted-foreground">{locations[2].name}</p>
                    </div>
                  </div>
                </div>

                {/* Route line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    d="M 40% 30% Q 50% 40%, 60% 50% T 30% 70%"
                    stroke="#ef8f5f"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="10,5"
                    opacity="0.6"
                  />
                </svg>

                {/* Zoom controls */}
                <div className="absolute bottom-4 right-4 bg-card rounded-lg shadow-lg border border-border overflow-hidden">
                  <Button variant="ghost" size="sm" className="rounded-none border-b border-border">
                    +
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-none">
                    -
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Orders */}
          <Card className="shadow-sm overflow-hidden">
            <CardHeader className="px-4 pt-4 pb-0 bg-muted border-b border-border">
              <CardTitle className="text-base font-semibold">Órdenes Activas</CardTitle>
              <CardDescription className="text-xs">{techOrders.length} trabajos en progreso</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-3 space-y-2.5">
              {techOrders.map((order, idx) => (
                <div key={order.id} className="border border-border rounded-lg p-3 bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-sm text-foreground">{order.id}</h4>
                        <Badge variant="outline" className={
                          idx === 0 ? 'bg-steel/10 text-steel border-steel/20' :
                          idx === 1 ? 'bg-warning/10 text-warning border-warning/20' :
                          'bg-muted text-muted-foreground border-transparent'
                        }>
                          {idx === 0 ? 'En Curso' : idx === 1 ? 'Próxima' : 'Programada'}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground font-semibold">{order.clientName}</p>
                      <p className="text-xs text-muted-foreground">{order.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2.5 border-t border-border text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-brand" />
                      <span>{locations[idx]?.name || 'Ubicación'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-steel" />
                      <span>{order.estimatedHours}h estimadas</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2.5">
                    <button className="text-xs font-medium text-steel hover:underline flex items-center gap-1">
                      <Navigation className="h-3 w-3" />
                      Navegar
                    </button>
                    <button className="text-xs font-medium text-steel hover:underline flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      Contactar Cliente
                    </button>
                  </div>
                </div>
              ))}

              {techOrders.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <MapPin className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No hay órdenes activas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="px-4 py-4 text-center">
            <Route className="h-7 w-7 text-steel mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Distancia Hoy</p>
            <p className="text-2xl font-bold text-foreground">45.3 km</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="px-4 py-4 text-center">
            <Clock className="h-7 w-7 text-success mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Tiempo en Ruta</p>
            <p className="text-2xl font-bold text-foreground">3h 25min</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="px-4 py-4 text-center">
            <CheckCircle2 className="h-7 w-7 text-success mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Completadas Hoy</p>
            <p className="text-2xl font-bold text-foreground">2</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="px-4 py-4 text-center">
            <AlertCircle className="h-7 w-7 text-warning mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Pendientes</p>
            <p className="text-2xl font-bold text-foreground">{techOrders.length}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
