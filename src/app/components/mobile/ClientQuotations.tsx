import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { 
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  Download,
  Send,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  User,
  Package,
  Wrench,
  ChevronRight,
  Share2
} from 'lucide-react';

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface Quotation {
  id: string;
  quotationNumber: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  createdDate: string;
  expirationDate: string;
  equipment: string;
  location: string;
  technician: {
    name: string;
    phone: string;
  };
  items: QuotationItem[];
  labor: {
    description: string;
    hours: number;
    rate: number;
    total: number;
  };
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  validUntil: string;
  paymentTerms: string;
  warranty: string;
}

export function ClientQuotations() {
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Mock quotations data
  const quotations: Quotation[] = [
    {
      id: 'COT-001',
      quotationNumber: 'COT-2025-001',
      status: 'pending',
      createdDate: '2025-01-09',
      expirationDate: '2025-01-16',
      equipment: 'Sistema HVAC Piso 3',
      location: 'Oficina Principal',
      technician: {
        name: 'Carlos Ramírez',
        phone: '+57 300 123 4567'
      },
      items: [
        { id: 'I1', description: 'Filtro de Aire Industrial', quantity: 2, unit: 'unidad', unitPrice: 85000, total: 170000 },
        { id: 'I2', description: 'Gas Refrigerante R410A', quantity: 3, unit: 'kg', unitPrice: 120000, total: 360000 },
        { id: 'I3', description: 'Capacitor 50uF', quantity: 1, unit: 'unidad', unitPrice: 35000, total: 35000 },
        { id: 'I4', description: 'Válvula de Expansión', quantity: 1, unit: 'unidad', unitPrice: 180000, total: 180000 }
      ],
      labor: {
        description: 'Mantenimiento correctivo con cambio de componentes',
        hours: 4,
        rate: 45000,
        total: 180000
      },
      subtotal: 925000,
      tax: 175750,
      total: 1100750,
      notes: 'Incluye garantía de 6 meses en repuestos y mano de obra. Se requiere aprobación en 7 días.',
      validUntil: '2025-01-16',
      paymentTerms: '50% anticipo, 50% contra entrega',
      warranty: '6 meses en repuestos y mano de obra'
    },
    {
      id: 'COT-002',
      quotationNumber: 'COT-2025-002',
      status: 'approved',
      createdDate: '2025-01-07',
      expirationDate: '2025-01-14',
      equipment: 'Chiller Central',
      location: 'Planta Baja',
      technician: {
        name: 'Ana Morales',
        phone: '+57 301 234 5678'
      },
      items: [
        { id: 'I5', description: 'Aceite POE para Compresor', quantity: 5, unit: 'litro', unitPrice: 45000, total: 225000 },
        { id: 'I6', description: 'Filtro Secador', quantity: 2, unit: 'unidad', unitPrice: 65000, total: 130000 }
      ],
      labor: {
        description: 'Mantenimiento preventivo trimestral',
        hours: 3,
        rate: 45000,
        total: 135000
      },
      subtotal: 490000,
      tax: 93100,
      total: 583100,
      validUntil: '2025-01-14',
      paymentTerms: 'Pago contra entrega',
      warranty: '3 meses en repuestos'
    },
    {
      id: 'COT-003',
      quotationNumber: 'COT-2024-098',
      status: 'rejected',
      createdDate: '2024-12-28',
      expirationDate: '2025-01-04',
      equipment: 'Sistema Refrigeración Bodega',
      location: 'Bodega Norte',
      technician: {
        name: 'Pedro Sánchez',
        phone: '+57 313 456 7890'
      },
      items: [
        { id: 'I7', description: 'Compresor Industrial', quantity: 1, unit: 'unidad', unitPrice: 4500000, total: 4500000 }
      ],
      labor: {
        description: 'Reemplazo de compresor y recarga de sistema',
        hours: 8,
        rate: 45000,
        total: 360000
      },
      subtotal: 4860000,
      tax: 923400,
      total: 5783400,
      validUntil: '2025-01-04',
      paymentTerms: '50% anticipo, 50% contra entrega',
      warranty: '12 meses'
    },
    {
      id: 'COT-004',
      quotationNumber: 'COT-2024-095',
      status: 'expired',
      createdDate: '2024-12-20',
      expirationDate: '2024-12-27',
      equipment: 'Mini Split Oficina',
      location: 'Piso 2',
      technician: {
        name: 'Luis Torres',
        phone: '+57 314 567 8901'
      },
      items: [
        { id: 'I8', description: 'Tarjeta Electrónica', quantity: 1, unit: 'unidad', unitPrice: 280000, total: 280000 }
      ],
      labor: {
        description: 'Diagnóstico y reparación tarjeta',
        hours: 2,
        rate: 45000,
        total: 90000
      },
      subtotal: 370000,
      tax: 70300,
      total: 440300,
      validUntil: '2024-12-27',
      paymentTerms: 'Pago contra entrega',
      warranty: '3 meses'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success/10 text-success border-success/20';
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'rejected': return 'bg-danger/10 text-danger border-danger/20';
      case 'expired': return 'bg-muted text-muted-foreground border-transparent';
      default: return 'bg-muted text-muted-foreground border-transparent';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprobada';
      case 'pending': return 'Pendiente';
      case 'rejected': return 'Rechazada';
      case 'expired': return 'Expirada';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="h-5 w-5" />;
      case 'pending': return <Clock className="h-5 w-5" />;
      case 'rejected': return <XCircle className="h-5 w-5" />;
      case 'expired': return <AlertCircle className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleApprove = () => {
    setApprovalAction('approve');
    setShowApprovalDialog(true);
  };

  const handleReject = () => {
    setApprovalAction('reject');
    setShowApprovalDialog(true);
  };

  const confirmApproval = () => {
    if (approvalAction === 'approve') {
      toast.success(`Cotización ${selectedQuotation?.quotationNumber} aprobada`, {
        description: 'El equipo técnico programará el servicio en breve.',
      });
    } else if (approvalAction === 'reject') {
      if (!rejectionReason.trim()) {
        toast.error('Ingresa un motivo de rechazo');
        return;
      }
      toast(`Cotización ${selectedQuotation?.quotationNumber} rechazada`, {
        description: 'El equipo te contactará para revisar alternativas.',
      });
    }
    setShowApprovalDialog(false);
    setSelectedQuotation(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-4 pb-24 pt-9 px-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Mis Cotizaciones</h2>
        <p className="text-sm text-gray-500">Revisa y aprueba cotizaciones</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-2 rounded-2xl border border-gray-100 py-3 shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
            <Clock className="h-4 w-4 text-warning" />
          </div>
          <p className="text-lg font-bold text-gray-900">
            {quotations.filter(q => q.status === 'pending').length}
          </p>
          <p className="text-[10px] text-gray-500">Pendientes</p>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
            <CheckCircle2 className="h-4 w-4 text-success" />
          </div>
          <p className="text-lg font-bold text-gray-900">
            {quotations.filter(q => q.status === 'approved').length}
          </p>
          <p className="text-[10px] text-gray-500">Aprobadas</p>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-danger/10">
            <XCircle className="h-4 w-4 text-danger" />
          </div>
          <p className="text-lg font-bold text-gray-900">
            {quotations.filter(q => q.status === 'rejected').length}
          </p>
          <p className="text-[10px] text-gray-500">Rechazadas</p>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-lg font-bold text-gray-900">
            {quotations.filter(q => q.status === 'expired').length}
          </p>
          <p className="text-[10px] text-gray-500">Expiradas</p>
        </div>
      </div>

      {/* Quotations List */}
      <div className="space-y-3">
        {quotations.map((quotation) => (
          <Card
            key={quotation.id}
            className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer rounded-3xl"
            onClick={() => setSelectedQuotation(quotation)}
          >
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900">{quotation.quotationNumber}</p>
                    <Badge variant="outline" className={getStatusColor(quotation.status)}>
                      {getStatusLabel(quotation.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{quotation.equipment}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>Válida hasta: {quotation.expirationDate}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Total</p>
                  <p className="text-lg font-bold text-brand">{formatCurrency(quotation.total)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">{quotation.technician.name}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quotation Detail Modal */}
      {selectedQuotation && (
        <Dialog open={!!selectedQuotation} onOpenChange={() => setSelectedQuotation(null)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedQuotation.quotationNumber}</span>
                <Badge variant="outline" className={getStatusColor(selectedQuotation.status)}>
                  {getStatusLabel(selectedQuotation.status)}
                </Badge>
              </DialogTitle>
              <DialogDescription>Detalles de la cotización</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Header Info */}
              <Card className="border-0 shadow-md bg-steel/10 rounded-2xl">
                <CardContent className="pt-4">
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600 text-xs">Equipo</p>
                      <p className="font-semibold text-gray-900">{selectedQuotation.equipment}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs">Ubicación</p>
                      <p className="font-semibold text-gray-900">{selectedQuotation.location}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-steel/20">
                      <div>
                        <p className="text-gray-600 text-xs">Fecha emisión</p>
                        <p className="font-semibold text-gray-900">{selectedQuotation.createdDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Válida hasta</p>
                        <p className="font-semibold text-steel">{selectedQuotation.validUntil}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technician */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-600" />
                    Técnico Responsable
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-gray-900">{selectedQuotation.technician.name}</p>
                  <p className="text-sm text-gray-600">{selectedQuotation.technician.phone}</p>
                </CardContent>
              </Card>

              {/* Items */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-600" />
                    Materiales y Repuestos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedQuotation.items.map((item) => (
                      <div key={item.id} className="flex items-start justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">{item.description}</p>
                          <p className="text-xs text-gray-600">
                            {item.quantity} {item.unit} × {formatCurrency(item.unitPrice)}
                          </p>
                        </div>
                        <p className="font-semibold text-sm text-gray-900">{formatCurrency(item.total)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Labor */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-gray-600" />
                    Mano de Obra
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-900">{selectedQuotation.labor.description}</p>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">
                        {selectedQuotation.labor.hours} horas × {formatCurrency(selectedQuotation.labor.rate)}/hora
                      </p>
                      <p className="font-semibold text-sm text-gray-900">
                        {formatCurrency(selectedQuotation.labor.total)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Totals */}
              <Card className="border-0 shadow-md bg-success/10 rounded-2xl">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(selectedQuotation.subtotal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">IVA (19%):</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(selectedQuotation.tax)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-success/20">
                      <span className="font-bold text-gray-900">TOTAL:</span>
                      <span className="font-bold text-2xl text-success">
                        {formatCurrency(selectedQuotation.total)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Terms and Warranty */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm">Términos y Garantía</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Términos de Pago</p>
                    <p className="text-gray-900">{selectedQuotation.paymentTerms}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Garantía</p>
                    <p className="text-gray-900">{selectedQuotation.warranty}</p>
                  </div>
                  {selectedQuotation.notes && (
                    <div className="pt-2 border-t">
                      <p className="text-gray-600 text-xs mb-1">Notas Adicionales</p>
                      <p className="text-gray-900 text-xs">{selectedQuotation.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              {selectedQuotation.status === 'pending' && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      onClick={handleReject}
                      variant="outline"
                      className="flex-1 text-danger border-danger/20 hover:bg-danger/5"
                    >
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Rechazar
                    </Button>
                    <Button
                      onClick={handleApprove}
                      className="flex-1 bg-success hover:bg-success/90"
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Aprobar
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => toast.info('Chat de negociación próximamente disponible')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Negociar con Técnico
                  </Button>
                </div>
              )}

              {selectedQuotation.status !== 'pending' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => toast.success('Enlace para compartir copiado')}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir
                  </Button>
                  <Button
                    className="flex-1 rounded-full bg-brand hover:bg-brand/90"
                    onClick={() => toast.success(`Descargando ${selectedQuotation.quotationNumber}.pdf...`)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Approval/Rejection Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {approvalAction === 'approve' ? (
                <>
                  <ThumbsUp className="h-5 w-5 text-success" />
                  <span>Aprobar Cotización</span>
                </>
              ) : (
                <>
                  <ThumbsDown className="h-5 w-5 text-danger" />
                  <span>Rechazar Cotización</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {approvalAction === 'approve' 
                ? '¿Confirmas que deseas aprobar esta cotización?' 
                : 'Por favor indica el motivo del rechazo'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {approvalAction === 'approve' && (
              <Card className="border-0 shadow-md bg-success/10 rounded-2xl">
                <CardContent className="pt-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-700 mb-2">Total a aprobar:</p>
                    <p className="text-3xl font-bold text-success">
                      {formatCurrency(selectedQuotation?.total || 0)}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      {selectedQuotation?.paymentTerms}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {approvalAction === 'reject' && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Motivo del rechazo *
                </label>
                <Textarea
                  placeholder="Ej: Precio muy elevado, necesito otra cotización, etc..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowApprovalDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                className={`flex-1 ${
                  approvalAction === 'approve'
                    ? 'bg-success hover:bg-success/90'
                    : 'bg-danger hover:bg-danger/90'
                }`}
                onClick={confirmApproval}
              >
                <Send className="h-4 w-4 mr-2" />
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
