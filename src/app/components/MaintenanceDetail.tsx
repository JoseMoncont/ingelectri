import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  Wrench,
  Calendar,
  User,
  Package,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Shield,
  TrendingUp,
  DollarSign,
  ArrowLeft,
  Download,
  Clock,
  Star
} from 'lucide-react';
import { maintenanceRecords, installationRecords, technicians } from '../data/mockData';

interface MaintenanceDetailProps {
  maintenanceId: string;
  onBack: () => void;
}

export function MaintenanceDetail({ maintenanceId, onBack }: MaintenanceDetailProps) {
  // Buscar en mantenimientos o instalaciones
  const maintenance = maintenanceRecords.find(m => m.id === maintenanceId);
  const installation = installationRecords.find(i => i.id === maintenanceId);
  const record = maintenance || installation;

  if (!record) {
    return <div>Registro no encontrado</div>;
  }

  const isInstallation = !!installation;
  const assignedTechs = technicians.filter(t => record.technicians.includes(t.id));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string, label: string, icon: any }> = {
      'completed': { color: 'bg-success/10 text-success border-success/20', label: 'Completado', icon: CheckCircle2 },
      'in-progress': { color: 'bg-steel/10 text-steel border-steel/20', label: 'En Progreso', icon: Clock },
      'pending': { color: 'bg-warning/10 text-warning border-warning/20', label: 'Pendiente', icon: AlertTriangle },
    };
    const { color, label, icon: Icon } = config[status] || config.pending;
    return (
      <Badge variant="outline" className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    if (isInstallation) {
      return <Badge variant="outline" className="bg-muted text-foreground/80 border-border">Instalación/Montaje</Badge>;
    }
    const config: Record<string, { color: string, label: string }> = {
      'preventive': { color: 'bg-steel/10 text-steel border-steel/20', label: 'Preventivo' },
      'corrective': { color: 'bg-warning/10 text-warning border-warning/20', label: 'Correctivo' },
      'predictive': { color: 'bg-steel/10 text-steel border-steel/20', label: 'Predictivo' },
    };
    const { color, label } = config[type] || config.preventive;
    return <Badge variant="outline" className={color}>{label}</Badge>;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-muted">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {record.id}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
              <Wrench className="h-3.5 w-3.5" />
              {isInstallation ? 'Registro de Instalación' : 'Registro de Mantenimiento'}
            </p>
          </div>
        </div>
        <Button size="sm" className="bg-brand hover:bg-brand/90 text-white">
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Descargar Reporte
        </Button>
      </div>

      {/* Status Bar */}
      <Card className="shadow-sm">
        <CardContent className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusBadge(record.status)}
              {getTypeBadge(maintenance?.type || 'installation')}
              {record.hasWarranty && (
                <Badge variant="outline" className="border-success/20 text-success bg-success/10">
                  <Shield className="h-3 w-3 mr-1" />
                  Con Garantía: {record.warrantyMonths} meses
                </Badge>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Costo Total</p>
              <p className="text-2xl font-bold text-success">
                {formatCurrency(record.totalCost)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Info Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Cliente y Equipo */}
        <Card className="shadow-sm col-span-2">
          <CardHeader className="px-4 pt-4 pb-0">
            <CardTitle className="text-base font-semibold">Información General</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Cliente</p>
                <p className="font-semibold text-sm text-foreground">{record.clientName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Equipo</p>
                <p className="font-semibold text-sm text-foreground">{record.equipmentType}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Serie del Equipo</p>
                <p className="font-semibold text-sm text-foreground font-mono">{record.equipmentSerial}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Orden de Servicio</p>
                <p className="font-semibold text-sm text-foreground">{record.serviceOrderId}</p>
              </div>
            </div>

            <div className="pt-3 border-t">
              <p className="text-xs text-muted-foreground mb-1.5">Descripción del Trabajo</p>
              <p className="text-sm text-foreground">{record.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Fecha Programada</p>
                <p className="font-semibold text-sm text-foreground">
                  {new Date(record.scheduledDate).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Fecha de Finalización</p>
                <p className="font-semibold text-sm text-foreground">
                  {record.completedDate
                    ? new Date(record.completedDate).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'En proceso'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Técnicos */}
        <Card className="shadow-sm">
          <CardHeader className="px-4 pt-4 pb-0">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-brand" />
              Técnicos Asignados
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-3 space-y-2.5">
            {assignedTechs.map((tech) => (
              <div key={tech.id} className="flex items-center gap-2.5 p-2.5 bg-muted rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-brand-dark text-white">
                    {getInitials(tech.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm text-foreground">{tech.name}</p>
                  <p className="text-xs text-muted-foreground">{tech.specialty}</p>
                </div>
              </div>
            ))}
            {record.signature && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-muted-foreground mb-1">Firmado por:</p>
                <p className="font-semibold text-sm text-foreground">{record.signature}</p>
              </div>
            )}
            {record.customerApproval && (
              <div className="mt-1.5">
                <p className="text-xs text-muted-foreground mb-1">Aprobado por:</p>
                <p className="font-semibold text-sm text-foreground">{record.customerApproval}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hallazgos y Trabajos */}
      {maintenance && (
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-sm">
            <CardHeader className="px-4 pt-4 pb-0">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Hallazgos
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-3">
              <ul className="space-y-1.5">
                {maintenance.findings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="text-warning mt-1">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="px-4 pt-4 pb-0">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Trabajos Realizados
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-3">
              <ul className="space-y-1.5">
                {maintenance.tasksPerformed.map((task, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success mt-0.5 flex-shrink-0" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Instalación Details */}
      {installation && (
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-sm">
            <CardHeader className="px-4 pt-4 pb-0">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Package className="h-4 w-4 text-steel" />
                Detalles de la Instalación
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-3">
              <div className="space-y-2">
                {Object.entries(installation.installationDetails).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-1.5 border-b">
                    <span className="text-xs text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="font-semibold text-sm text-foreground">
                      {typeof value === 'boolean' ? (value ? 'Sí' : 'No') : value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="px-4 pt-4 pb-0">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Trabajos Realizados
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-3">
              <ul className="space-y-1.5">
                {installation.tasksPerformed.map((task, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success mt-0.5 flex-shrink-0" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Partes y Materiales */}
      <Card className="shadow-sm">
        <CardHeader className="px-4 pt-4 pb-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Package className="h-4 w-4 text-steel" />
            {isInstallation ? 'Materiales Utilizados' : 'Partes Reemplazadas'}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-3">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 text-xs font-semibold text-foreground/80">
                    {isInstallation ? 'Material' : 'Parte'}
                  </th>
                  <th className="text-center py-2 px-4 text-xs font-semibold text-foreground/80">Cantidad</th>
                  {isInstallation && (
                    <th className="text-center py-2 px-4 text-xs font-semibold text-foreground/80">Unidad</th>
                  )}
                  <th className="text-right py-2 px-4 text-xs font-semibold text-foreground/80">Costo</th>
                </tr>
              </thead>
              <tbody>
                {isInstallation
                  ? installation.materialsUsed.map((material, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted">
                        <td className="py-2.5 px-4 text-sm text-foreground">{material.name}</td>
                        <td className="py-2.5 px-4 text-center text-sm text-foreground">{material.quantity}</td>
                        <td className="py-2.5 px-4 text-center text-sm text-foreground">{material.unit}</td>
                        <td className="py-2.5 px-4 text-right font-semibold text-sm text-foreground">
                          {formatCurrency(material.cost)}
                        </td>
                      </tr>
                    ))
                  : maintenance?.partsReplaced.map((part, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted">
                        <td className="py-2.5 px-4 text-sm text-foreground">{part.name}</td>
                        <td className="py-2.5 px-4 text-center text-sm text-foreground">{part.quantity}</td>
                        <td className="py-2.5 px-4 text-right font-semibold text-sm text-foreground">
                          {formatCurrency(part.cost)}
                        </td>
                      </tr>
                    ))}
                {(!isInstallation && maintenance?.partsReplaced.length === 0) && (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-sm text-muted-foreground">
                      No se reemplazaron partes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mediciones */}
      {Object.keys(record.measurements).length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="px-4 pt-4 pb-0">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-steel" />
              Mediciones Técnicas
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-3">
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(record.measurements).map(([key, value]) => (
                <div key={key} className="bg-muted rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-xl font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {key.includes('voltage') ? 'V' :
                     key.includes('amperage') ? 'A' :
                     key.includes('pressure') ? 'PSI' :
                     key.includes('temperature') ? '°C' :
                     key.includes('superheat') || key.includes('subcooling') ? '°C' : ''}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Costos */}
      <Card className="shadow-sm">
        <CardHeader className="px-4 pt-4 pb-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-success" />
            Desglose de Costos
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm text-foreground/80">Mano de Obra ({record.laborHours}h)</span>
              <span className="font-semibold text-sm text-foreground">{formatCurrency(record.laborCost)}</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm text-foreground/80">
                {isInstallation ? 'Materiales' : 'Partes'}
              </span>
              <span className="font-semibold text-sm text-foreground">
                {formatCurrency(isInstallation ? installation.materialsCost : maintenance?.partsCost || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-t-2 border-border">
              <span className="text-base font-bold text-foreground">TOTAL</span>
              <span className="text-xl font-bold text-success">{formatCurrency(record.totalCost)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Garantía */}
      {record.hasWarranty && (
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="bg-success/10 px-4 pt-4 pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-success">
              <Shield className="h-4 w-4" />
              Información de Garantía
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-3">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Período de Garantía</p>
                <p className="text-xl font-bold text-success">{record.warrantyMonths} meses</p>
              </div>
              {record.warrantyExpiry && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Vencimiento</p>
                  <p className="font-semibold text-sm text-foreground">
                    {new Date(record.warrantyExpiry).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
              {installation?.warrantyDetails && (
                <div className="col-span-3">
                  <p className="text-xs text-muted-foreground mb-1.5">Cobertura Detallada</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(installation.warrantyDetails).map(([key, value]) => (
                      <div key={key} className="bg-success/10 rounded-lg p-2.5">
                        <p className="text-xs text-success capitalize">{key}</p>
                        <p className="font-semibold text-sm text-success">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recomendaciones */}
      {maintenance?.recommendations && maintenance.recommendations.length > 0 && (
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="bg-steel/10 px-4 pt-4 pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-steel">
              <FileText className="h-4 w-4" />
              Recomendaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-3">
            <ul className="space-y-2">
              {maintenance.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-2.5 bg-steel/10 rounded-lg">
                  <div className="h-5 w-5 rounded-full bg-steel text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-sm text-foreground flex-1">{rec}</span>
                </li>
              ))}
            </ul>
            {maintenance.nextMaintenanceDate && (
              <div className="mt-4 pt-3 border-t">
                <p className="text-xs text-muted-foreground mb-1">Próximo Mantenimiento Programado</p>
                <p className="text-base font-bold text-steel">
                  {new Date(maintenance.nextMaintenanceDate).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Certificaciones (solo para instalaciones) */}
      {installation?.certifications && installation.certifications.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="px-4 pt-4 pb-0">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
              <CheckCircle2 className="h-4 w-4" />
              Certificaciones y Documentos
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-3">
            <div className="grid grid-cols-2 gap-2.5">
              {installation.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2.5 bg-muted rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-foreground">{cert}</span>
                </div>
              ))}
            </div>
            {installation.customerSatisfaction && (
              <div className="mt-4 pt-3 border-t text-center">
                <p className="text-xs text-muted-foreground mb-1.5">Satisfacción del Cliente</p>
                <div className="flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < installation.customerSatisfaction!
                          ? 'text-warning fill-warning'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
