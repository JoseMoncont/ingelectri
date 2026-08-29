import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { FileText, Download, Printer, Filter, Calendar as CalendarIcon, Building2, Wrench, Tag } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { maintenanceHistory, clients, technicians, equipment } from '../data/mockData';

export function Reports() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [selectedTechnician, setSelectedTechnician] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const handleExportPDF = () => {
    // Simulación de exportación PDF
    alert('Exportando reporte en formato PDF...');
  };

  const handleExportExcel = () => {
    // Simulación de exportación Excel
    alert('Exportando reporte en formato Excel...');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
        <p className="text-muted-foreground mt-1 text-sm">Generación y exportación de reportes de mantenimiento</p>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardHeader className="px-4 pt-4 pb-0">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-brand" />
            <CardTitle className="text-base font-semibold">Filtros de Reporte</CardTitle>
          </div>
          <CardDescription className="text-xs">Seleccione los criterios para generar el reporte</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 rounded-xl bg-muted/40 p-4">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5" />
                Fecha Inicio
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left bg-card">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {startDate ? format(startDate, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5" />
                Fecha Fin
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left bg-card">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {endDate ? format(endDate, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Client Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                Cliente
              </label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="bg-card">
                  <SelectValue placeholder="Todos los clientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los clientes</SelectItem>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Technician Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5" />
                Técnico
              </label>
              <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                <SelectTrigger className="bg-card">
                  <SelectValue placeholder="Todos los técnicos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los técnicos</SelectItem>
                  {technicians.map(tech => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                Tipo de Mantenimiento
              </label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-card">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="preventivo">Preventivo</SelectItem>
                  <SelectItem value="correctivo">Correctivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            <Button onClick={handleExportPDF} size="sm" className="bg-brand hover:bg-brand/90">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Exportar PDF
            </Button>
            <Button onClick={handleExportExcel} size="sm" variant="outline">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Exportar Excel
            </Button>
            <Button onClick={handlePrint} size="sm" variant="outline">
              <Printer className="h-3.5 w-3.5 mr-1.5" />
              Imprimir
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="bg-brand text-white px-4 pt-4 pb-3">
            <CardTitle className="text-base font-semibold">Mantenimientos Realizados</CardTitle>
            <CardDescription className="text-white/80 text-xs">Total del período</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-3">
            <div className="text-2xl font-bold text-foreground">156</div>
            <p className="text-xs text-muted-foreground mt-1">+12% vs período anterior</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="bg-success text-white px-4 pt-4 pb-3">
            <CardTitle className="text-base font-semibold">Preventivos</CardTitle>
            <CardDescription className="text-white/80 text-xs">75% del total</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-3">
            <div className="text-2xl font-bold text-foreground">117</div>
            <p className="text-xs text-muted-foreground mt-1">Excelente ratio</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="bg-brand-dark text-white px-4 pt-4 pb-3">
            <CardTitle className="text-base font-semibold">Correctivos</CardTitle>
            <CardDescription className="text-white/80 text-xs">25% del total</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-3">
            <div className="text-2xl font-bold text-foreground">39</div>
            <p className="text-xs text-muted-foreground mt-1">Dentro del objetivo</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Report Example */}
      <Card className="shadow-sm">
        <CardHeader className="px-4 pt-4 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Vista Previa del Reporte</CardTitle>
              <CardDescription className="text-xs">Historial de mantenimientos según filtros aplicados</CardDescription>
            </div>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-3">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-medium text-xs text-muted-foreground">Fecha</th>
                  <th className="text-left py-2 px-4 font-medium text-xs text-muted-foreground">Equipo</th>
                  <th className="text-left py-2 px-4 font-medium text-xs text-muted-foreground">Tipo</th>
                  <th className="text-left py-2 px-4 font-medium text-xs text-muted-foreground">Técnico</th>
                  <th className="text-left py-2 px-4 font-medium text-xs text-muted-foreground">Duración</th>
                  <th className="text-left py-2 px-4 font-medium text-xs text-muted-foreground">Estado</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceHistory.map((history) => {
                  const equipmentItem = equipment.find(eq => eq.id === history.equipmentId);
                  const technicianItem = technicians.find(tech => tech.id === history.technicianId);

                  return (
                    <tr key={history.id} className="border-b hover:bg-muted">
                      <td className="py-2.5 px-4 text-sm text-foreground/80">
                        {new Date(history.date).toLocaleDateString('es-CO')}
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="font-medium text-sm text-foreground">{equipmentItem?.type}</div>
                        <div className="text-xs text-muted-foreground">{equipmentItem?.serial}</div>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          history.type === 'Preventivo'
                            ? 'bg-steel/10 text-steel'
                            : 'bg-warning/10 text-warning'
                        }`}>
                          {history.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-sm text-foreground/80">{technicianItem?.name}</td>
                      <td className="py-2.5 px-4 text-sm text-foreground/80">{history.duration} min</td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          history.status === 'completed'
                            ? 'bg-success/10 text-success'
                            : 'bg-warning/10 text-warning'
                        }`}>
                          {history.status === 'completed' ? 'Completado' : 'En Progreso'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
