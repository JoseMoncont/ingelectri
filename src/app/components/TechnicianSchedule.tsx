import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  Calendar,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { technicians, serviceOrders } from '../data/mockData';

export function TechnicianSchedule() {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const timeSlots = [
    '08:00 - 10:00',
    '10:00 - 12:00',
    '14:00 - 16:00',
    '16:00 - 18:00'
  ];

  // Simular asignaciones
  const getAssignmentsForTechnician = (techId: string, day: number, slot: number) => {
    const assignments = serviceOrders.filter(order => 
      order.technicians.includes(techId) && order.status !== 'completed'
    );
    
    // Distribuir algunas asignaciones en la semana
    if (assignments.length > 0 && (day + slot) % 3 === Number(techId) % 3) {
      const assignment = assignments[0];
      return {
        orderId: assignment.id,
        client: assignment.clientName,
        status: assignment.status === 'in-progress' ? 'confirmed' : 'tentative',
        description: assignment.description.substring(0, 40) + '...',
      };
    }
    return null;
  };

  const getSlotColor = (status: string | null) => {
    if (!status) return 'bg-card hover:bg-muted border-border';
    if (status === 'confirmed') return 'bg-steel/10 border-steel/30 hover:bg-steel/20';
    if (status === 'tentative') return 'bg-warning/10 border-warning/30 hover:bg-warning/20';
    return 'bg-card border-border';
  };

  const filteredTechnicians = selectedTechnician 
    ? technicians.filter(t => t.id === selectedTechnician)
    : technicians.filter(t => t.status === 'active');

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Agenda de Técnicos
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            Planificación semanal de servicios
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Nueva Asignación
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <Card className="shadow-sm">
        <CardContent className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedWeek(selectedWeek - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1.5" />
              Semana Anterior
            </Button>
            <div className="text-center">
              <h3 className="text-base font-semibold text-foreground">
                Semana del {13 + selectedWeek * 7} - {17 + selectedWeek * 7} de Enero 2026
              </h3>
              <p className="text-xs text-muted-foreground">Semana {1 + selectedWeek}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedWeek(selectedWeek + 1)}
            >
              Próxima Semana
              <ChevronRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Technician Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Button
          size="sm"
          variant={selectedTechnician === null ? "secondary" : "outline"}
          onClick={() => setSelectedTechnician(null)}
          className={selectedTechnician === null ? "bg-steel/10 text-steel border border-steel/20 hover:bg-steel/20" : ""}
        >
          Todos los Técnicos
        </Button>
        {technicians.filter(t => t.status === 'active').map((tech) => (
          <Button
            key={tech.id}
            size="sm"
            variant={selectedTechnician === tech.id ? "secondary" : "outline"}
            onClick={() => setSelectedTechnician(tech.id)}
            className={selectedTechnician === tech.id ? "bg-steel/10 text-steel border border-steel/20 hover:bg-steel/20" : ""}
          >
            <Avatar className="h-5 w-5 mr-1.5">
              <AvatarFallback className="bg-brand-dark text-white text-xs">
                {getInitials(tech.name)}
              </AvatarFallback>
            </Avatar>
            {tech.name}
          </Button>
        ))}
      </div>

      {/* Schedule Grid */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="px-4 pt-4 pb-0 bg-muted border-b border-border">
          <CardTitle className="text-base font-semibold">Calendario de Actividades</CardTitle>
          <CardDescription className="text-xs">
            Planificación semanal • {filteredTechnicians.length} técnico(s) • {weekDays.length} días
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-3">
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* Header Row */}
              <div className="grid grid-cols-6 gap-4 mb-3">
                <div className="font-semibold text-sm text-foreground/80">Técnico</div>
                {weekDays.map((day, idx) => (
                  <div key={day} className="text-center">
                    <div className="font-semibold text-sm text-foreground/80">{day}</div>
                    <div className="text-xs text-muted-foreground">Ene {13 + idx + selectedWeek * 7}</div>
                  </div>
                ))}
              </div>

              {/* Technician Rows */}
              <div className="space-y-4">
                {filteredTechnicians.map((tech) => (
                  <div key={tech.id} className="border border-border rounded-lg p-3 bg-card">
                    {/* Technician Info */}
                    <div className="mb-3 pb-3 border-b border-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-brand-dark text-white text-sm">
                            {getInitials(tech.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold text-sm text-foreground">{tech.name}</h4>
                          <p className="text-xs text-muted-foreground">{tech.specialty}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-success/20 text-success bg-success/10">
                          {tech.status === 'active' ? 'Disponible' : 'No Disponible'}
                        </Badge>
                        <Badge variant="outline" className="border-steel/20 text-steel bg-steel/10">
                          {tech.activeJobs} trabajos activos
                        </Badge>
                      </div>
                    </div>

                    {/* Time Slots */}
                    {timeSlots.map((timeSlot, slotIdx) => (
                      <div key={timeSlot} className="grid grid-cols-6 gap-4 mb-2.5">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                          {timeSlot}
                        </div>
                        {weekDays.map((day, dayIdx) => {
                          const assignment = getAssignmentsForTechnician(tech.id, dayIdx, slotIdx);
                          return (
                            <div
                              key={`${day}-${timeSlot}`}
                              className={`border-2 rounded-lg p-2.5 transition-all cursor-pointer ${getSlotColor(assignment?.status || null)}`}
                            >
                              {assignment ? (
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <Badge variant="outline" className={
                                      assignment.status === 'confirmed'
                                        ? 'bg-steel/10 text-steel border-steel/20 text-xs'
                                        : 'bg-warning/10 text-warning border-warning/20 text-xs'
                                    }>
                                      {assignment.status === 'confirmed' ? (
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                      ) : (
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                      )}
                                      {assignment.orderId}
                                    </Badge>
                                  </div>
                                  <p className="text-xs font-semibold text-foreground line-clamp-1">
                                    {assignment.client}
                                  </p>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {assignment.description}
                                  </p>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1.5">
                                    <MapPin className="h-3 w-3" />
                                    Ver ubicación
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-3">
                                  <p className="text-xs text-muted-foreground">Disponible</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="shadow-sm">
        <CardContent className="px-4 py-3">
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 bg-steel/10 border-2 border-steel/30 rounded"></div>
              <span className="text-xs text-foreground/80">Confirmado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 bg-warning/10 border-2 border-warning/30 rounded"></div>
              <span className="text-xs text-foreground/80">Tentativo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 bg-card border-2 border-border rounded"></div>
              <span className="text-xs text-foreground/80">Disponible</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
