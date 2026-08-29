import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { 
  ArrowLeft,
  Package,
  Wrench,
  Zap,
  Camera,
  ClipboardList,
  AlertCircle,
  Plus,
  QrCode,
  CheckCircle2,
  Clock,
  Save,
  Trash2,
  X,
  ChevronRight,
  Star,
  User,
  Thermometer
} from 'lucide-react';

interface Equipment {
  id: string;
  qrCode?: string;
  tipo: string;
  marca: string;
  modelo: string;
  serial: string;
  unidadInterna?: string;
  unidadExterna?: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface MaintenanceServiceProps {
  service: any;
  onBack: () => void;
}

export function MaintenanceService({ service, onBack }: MaintenanceServiceProps) {
  const [activeView, setActiveView] = useState<'equipment-list' | 'equipment-detail'>('equipment-list');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [showAddEquipmentDialog, setShowAddEquipmentDialog] = useState(false);
  const [showScanQR, setShowScanQR] = useState(false);
  const [showFinalizarDialog, setShowFinalizarDialog] = useState(false);

  // Lista de equipos en este servicio
  const [equipments, setEquipments] = useState<Equipment[]>([
    {
      id: 'EQ-001',
      qrCode: 'QR-CH-001',
      tipo: 'Chiller Industrial',
      marca: 'Carrier',
      modelo: '30RB-0802',
      serial: 'CR2024-001',
      status: 'pending'
    }
  ]);

  const [serviceStatus, setServiceStatus] = useState<'not_started' | 'in_progress' | 'completed'>('not_started');
  const [startTime, setStartTime] = useState<Date | null>(null);

  const handleStartService = () => {
    setServiceStatus('in_progress');
    setStartTime(new Date());
    alert('✅ Servicio iniciado\n\n⏱️ Cronómetro activado\n📍 GPS registrado');
  };

  const handleAddEquipment = (method: 'scan' | 'manual') => {
    if (method === 'scan') {
      setShowAddEquipmentDialog(false);
      setShowScanQR(true);
    } else {
      // Navegar a formulario manual
      const newEquipment: Equipment = {
        id: `EQ-${Date.now()}`,
        tipo: '',
        marca: '',
        modelo: '',
        serial: '',
        status: 'pending'
      };
      setEquipments([...equipments, newEquipment]);
      setSelectedEquipment(newEquipment);
      setActiveView('equipment-detail');
      setShowAddEquipmentDialog(false);
    }
  };

  const handleScanComplete = () => {
    const scannedEquipment: Equipment = {
      id: `EQ-${Date.now()}`,
      qrCode: `QR-SCAN-${Date.now()}`,
      tipo: 'Aire MiniSplit',
      marca: 'LG',
      modelo: 'DUAL-INVERTER',
      serial: 'LG2024-456',
      status: 'pending'
    };
    setEquipments([...equipments, scannedEquipment]);
    setShowScanQR(false);
    alert('✅ Equipo escaneado y agregado al servicio\n\nCargando ficha técnica...');
  };

  const handleSelectEquipment = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setActiveView('equipment-detail');
  };

  const handleFinalizarServicio = () => {
    const pendingEquipments = equipments.filter(eq => eq.status !== 'completed');
    
    if (pendingEquipments.length > 0) {
      alert(`⚠️ Equipos pendientes de completar\n\n${pendingEquipments.length} equipo(s) sin finalizar`);
      return;
    }

    setShowFinalizarDialog(true);
  };

  const confirmFinalizar = () => {
    alert(`✅ SERVICIO COMPLETADO

📋 Orden: ${service.id}
⏱️ Tiempo total: ${startTime ? Math.floor((new Date().getTime() - startTime.getTime()) / 60000) : 0} minutos
🔧 Equipos atendidos: ${equipments.length}

📱 Sincronizando datos...
📄 Generando reporte PDF...`);
    
    setServiceStatus('completed');
    setShowFinalizarDialog(false);
    setTimeout(() => onBack(), 1500);
  };

  const renderEquipmentList = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand to-orange-600 text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{service.id}</h1>
            <p className="text-sm opacity-90">{service.client}</p>
          </div>
          <Badge className={
            serviceStatus === 'completed' ? 'bg-green-600' :
            serviceStatus === 'in_progress' ? 'bg-blue-600' :
            'bg-gray-600'
          }>
            {serviceStatus === 'completed' ? 'Completado' :
             serviceStatus === 'in_progress' ? 'En Progreso' :
             'No Iniciado'}
          </Badge>
        </div>

        {serviceStatus === 'in_progress' && startTime && (
          <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              Tiempo: {Math.floor((new Date().getTime() - startTime.getTime()) / 60000)} min
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4 pb-32">
        {/* Info del Servicio */}
        <Card className="border-0 shadow-md">
          <CardContent className="pt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Ubicación:</span>
              <span className="font-medium text-gray-900">{service.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Hora programada:</span>
              <span className="font-medium text-gray-900">{service.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tipo:</span>
              <Badge>{service.type}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Equipos */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Equipos del Servicio</h2>
            <Badge variant="outline">{equipments.length}</Badge>
          </div>

          <div className="space-y-3">
            {equipments.map((equipment) => (
              <Card 
                key={equipment.id}
                className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleSelectEquipment(equipment)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                        equipment.status === 'completed' ? 'bg-green-100' :
                        equipment.status === 'in_progress' ? 'bg-blue-100' :
                        'bg-gray-100'
                      }`}>
                        <Package className={`h-6 w-6 ${
                          equipment.status === 'completed' ? 'text-green-600' :
                          equipment.status === 'in_progress' ? 'text-blue-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{equipment.tipo || 'Sin especificar'}</p>
                        <p className="text-sm text-gray-600">{equipment.marca} {equipment.modelo}</p>
                        <p className="text-xs text-gray-500">S/N: {equipment.serial}</p>
                        {equipment.qrCode && (
                          <div className="flex items-center gap-1 mt-1">
                            <QrCode className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{equipment.qrCode}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={
                        equipment.status === 'completed' ? 'bg-green-500' :
                        equipment.status === 'in_progress' ? 'bg-blue-500' :
                        'bg-orange-500'
                      }>
                        {equipment.status === 'completed' ? 'Completado' :
                         equipment.status === 'in_progress' ? 'En Proceso' :
                         'Pendiente'}
                      </Badge>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {serviceStatus === 'in_progress' && (
            <Button
              onClick={() => setShowAddEquipmentDialog(true)}
              variant="outline"
              className="w-full mt-3"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Equipo al Servicio
            </Button>
          )}
        </div>
      </div>

      {/* Botones de Acción Flotantes */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
        <div className="max-w-md mx-auto space-y-2">
          {serviceStatus === 'not_started' && (
            <Button
              onClick={handleStartService}
              className="w-full bg-success hover:bg-green-600"
              size="lg"
            >
              <Clock className="h-5 w-5 mr-2" />
              Iniciar Servicio
            </Button>
          )}

          {serviceStatus === 'in_progress' && (
            <Button
              onClick={handleFinalizarServicio}
              className="w-full bg-brand hover:bg-brand"
              size="lg"
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Finalizar Servicio
            </Button>
          )}

          {serviceStatus === 'completed' && (
            <Button
              onClick={onBack}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Volver a Agenda
            </Button>
          )}
        </div>
      </div>

      {/* Dialog: Agregar Equipo */}
      <Dialog open={showAddEquipmentDialog} onOpenChange={setShowAddEquipmentDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Agregar Equipo</DialogTitle>
            <DialogDescription>¿Cómo deseas agregar el equipo?</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              onClick={() => handleAddEquipment('scan')}
              className="w-full justify-start h-auto py-4"
              variant="outline"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <QrCode className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Escanear QR</p>
                  <p className="text-xs text-gray-600">Identificar equipo existente</p>
                </div>
              </div>
            </Button>
            <Button
              onClick={() => handleAddEquipment('manual')}
              className="w-full justify-start h-auto py-4"
              variant="outline"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Registro Manual</p>
                  <p className="text-xs text-gray-600">Nuevo equipo sin QR</p>
                </div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Escanear QR */}
      <Dialog open={showScanQR} onOpenChange={setShowScanQR}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Escanear Código QR</DialogTitle>
            <DialogDescription>Apunta al código del equipo</DialogDescription>
          </DialogHeader>
          <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-48 w-48 border-4 border-brand rounded-2xl animate-pulse"></div>
            </div>
            <QrCode className="h-16 w-16 text-white z-10" />
          </div>
          <Button 
            onClick={handleScanComplete}
            className="w-full bg-success hover:bg-green-600"
          >
            Simular Escaneo
          </Button>
        </DialogContent>
      </Dialog>

      {/* Dialog: Finalizar Servicio */}
      <Dialog open={showFinalizarDialog} onOpenChange={setShowFinalizarDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Finalizar Servicio</DialogTitle>
            <DialogDescription>¿Confirmas que el servicio está completo?</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Equipos atendidos:</span>
                    <span className="font-bold text-gray-900">{equipments.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Tiempo total:</span>
                    <span className="font-bold text-gray-900">
                      {startTime ? Math.floor((new Date().getTime() - startTime.getTime()) / 60000) : 0} min
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-900">
                ⚠️ Asegúrate de haber completado todos los equipos antes de finalizar
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowFinalizarDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-success hover:bg-green-600"
                onClick={confirmFinalizar}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  if (activeView === 'equipment-detail' && selectedEquipment) {
    return (
      <EquipmentMaintenanceDetail
        equipment={selectedEquipment}
        serviceId={service.id}
        onBack={() => setActiveView('equipment-list')}
        onComplete={(updatedEquipment) => {
          setEquipments(equipments.map(eq => 
            eq.id === updatedEquipment.id ? updatedEquipment : eq
          ));
          setActiveView('equipment-list');
        }}
      />
    );
  }

  return renderEquipmentList();
}

// Componente para el detalle del mantenimiento de un equipo específico
interface EquipmentMaintenanceDetailProps {
  equipment: Equipment;
  serviceId: string;
  onBack: () => void;
  onComplete: (equipment: Equipment) => void;
}

function EquipmentMaintenanceDetail({ equipment, serviceId, onBack, onComplete }: EquipmentMaintenanceDetailProps) {
  const [activeTab, setActiveTab] = useState<'inspeccion' | 'tareas' | 'repuestos' | 'evidencias' | 'finalizacion'>('inspeccion');
  const [equipmentData, setEquipmentData] = useState(equipment);
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    // Datos básicos
    tipo: equipment.tipo || '',
    marca: equipment.marca || '',
    modelo: equipment.modelo || '',
    serial: equipment.serial || '',
    unidadInterna: equipment.unidadInterna || '',
    unidadExterna: equipment.unidadExterna || '',
    
    // Diagnóstico inicial
    diagnosticoInicial: '',
    estadoGeneral: '',
    
    // Tareas realizadas
    tareasRealizadas: [] as string[],
    otrasTareas: '',
    
    // Mediciones
    compresor1_L1: '', compresor1_L2: '', compresor1_L3: '',
    blower1_L1: '', blower1_L2: '', blower1_L3: '',
    temperaturaSuministro: '',
    temperaturaRetorno: '',
    presionAlta: '',
    presionBaja: '',
    voltaje: '',
    
    // Repuestos
    repuestos: [] as {nombre: string, cantidad: number, unidad: string, codigo: string}[],
    
    // Evidencias
    fotosAntes: [] as string[],
    fotosDespues: [] as string[],
    
    // Observaciones finales
    observacionesFinales: '',
    recomendaciones: ''
  });

  const [showAgregarTarea, setShowAgregarTarea] = useState(false);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [showRepuestosDialog, setShowRepuestosDialog] = useState(false);
  const [showNuevoRepuestoDialog, setShowNuevoRepuestoDialog] = useState(false);
  const [searchRepuesto, setSearchRepuesto] = useState('');
  const [repuestoSeleccionado, setRepuestoSeleccionado] = useState<any>(null);
  const [cantidadRepuesto, setCantidadRepuesto] = useState(1);
  const [nuevoRepuesto, setNuevoRepuesto] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    unidad: 'unidad'
  });
  const [showHistorialEquipo, setShowHistorialEquipo] = useState(false);
  const [showRegistrarEquipo, setShowRegistrarEquipo] = useState(false);
  const [showGenerarQR, setShowGenerarQR] = useState(false);

  const TAREAS_PREDEFINIDAS = [
    'Limpieza y reajuste sistema eléctrico',
    'Limpieza unidad evaporadora',
    'Limpieza unidad condensadora',
    'Limpieza de filtros de aire',
    'Lubricación de Rodamientos',
    'Destape de drenaje',
    'Mantenimiento de bomba',
    'Medición de voltaje',
    'Inspección de Carga Refrigerante',
    'Medición de consumo energético',
    'Lubricación de motor'
  ];

  // Catálogo de repuestos disponibles
  const CATALOGO_REPUESTOS = [
    { id: 1, nombre: 'Filtro de aire', categoria: 'Filtración', unidad: 'unidad', codigo: 'FA-001' },
    { id: 2, nombre: 'Gas refrigerante R410A', categoria: 'Refrigeración', unidad: 'kg', codigo: 'GR-410A' },
    { id: 3, nombre: 'Gas refrigerante R22', categoria: 'Refrigeración', unidad: 'kg', codigo: 'GR-22' },
    { id: 4, nombre: 'Capacitor 35uF', categoria: 'Eléctrico', unidad: 'unidad', codigo: 'CAP-35' },
    { id: 5, nombre: 'Capacitor 50uF', categoria: 'Eléctrico', unidad: 'unidad', codigo: 'CAP-50' },
    { id: 6, nombre: 'Contactor 40A', categoria: 'Eléctrico', unidad: 'unidad', codigo: 'CON-40' },
    { id: 7, nombre: 'Correa tipo A', categoria: 'Transmisión', unidad: 'unidad', codigo: 'COR-A' },
    { id: 8, nombre: 'Rodamiento 6205', categoria: 'Mecánico', unidad: 'unidad', codigo: 'ROD-6205' },
    { id: 9, nombre: 'Válvula de expansión', categoria: 'Refrigeración', unidad: 'unidad', codigo: 'VE-001' },
    { id: 10, nombre: 'Aceite lubricante sintético', categoria: 'Lubricación', unidad: 'litro', codigo: 'ACE-SINT' },
    { id: 11, nombre: 'Termostato digital', categoria: 'Control', unidad: 'unidad', codigo: 'TER-DIG' },
    { id: 12, nombre: 'Relay de arranque', categoria: 'Eléctrico', unidad: 'unidad', codigo: 'REL-ARR' },
    { id: 13, nombre: 'Manguera de drenaje', categoria: 'Drenaje', unidad: 'metro', codigo: 'MAN-DRE' },
    { id: 14, nombre: 'Cinta aislante', categoria: 'Eléctrico', unidad: 'rollo', codigo: 'CIN-AIS' },
    { id: 15, nombre: 'Químico limpiador condensador', categoria: 'Químicos', unidad: 'litro', codigo: 'QUI-CON' },
  ];

  const toggleTarea = (tarea: string) => {
    setFormData(prev => ({
      ...prev,
      tareasRealizadas: prev.tareasRealizadas.includes(tarea)
        ? prev.tareasRealizadas.filter(t => t !== tarea)
        : [...prev.tareasRealizadas, tarea]
    }));
  };

  const agregarTareaPersonalizada = () => {
    if (!nuevaTarea.trim()) return;
    setFormData(prev => ({
      ...prev,
      tareasRealizadas: [...prev.tareasRealizadas, nuevaTarea]
    }));
    setNuevaTarea('');
    setShowAgregarTarea(false);
  };

  const agregarFoto = (tipo: 'antes' | 'despues') => {
    setFormData(prev => ({
      ...prev,
      [tipo === 'antes' ? 'fotosAntes' : 'fotosDespues']: [...prev[tipo === 'antes' ? 'fotosAntes' : 'fotosDespues'], `foto_${Date.now()}.jpg`]
    }));
    alert('📸 Foto capturada');
  };

  const agregarRepuesto = () => {
    setShowRepuestosDialog(true);
  };

  const seleccionarRepuesto = (repuesto: any) => {
    setRepuestoSeleccionado(repuesto);
    setCantidadRepuesto(1);
  };

  const confirmarRepuesto = () => {
    if (!repuestoSeleccionado || cantidadRepuesto <= 0) {
      alert('⚠️ Selecciona un repuesto y cantidad válida');
      return;
    }

    setFormData(prev => ({
      ...prev,
      repuestos: [...prev.repuestos, { 
        nombre: repuestoSeleccionado.nombre, 
        cantidad: cantidadRepuesto, 
        unidad: repuestoSeleccionado.unidad,
        codigo: repuestoSeleccionado.codigo 
      }]
    }));

    setShowRepuestosDialog(false);
    setRepuestoSeleccionado(null);
    setCantidadRepuesto(1);
    setSearchRepuesto('');
    alert('✅ Repuesto agregado');
  };

  const registrarNuevoRepuesto = () => {
    if (!nuevoRepuesto.nombre.trim()) {
      alert('⚠️ Ingresa el nombre del repuesto');
      return;
    }

    const newItem = {
      id: Date.now(),
      nombre: nuevoRepuesto.nombre,
      categoria: nuevoRepuesto.categoria || 'Otros',
      unidad: nuevoRepuesto.unidad,
      codigo: `CUSTOM-${Date.now()}`
    };

    // Agregar a la lista de repuestos del equipo
    setFormData(prev => ({
      ...prev,
      repuestos: [...prev.repuestos, {
        nombre: newItem.nombre,
        cantidad: 1,
        unidad: newItem.unidad,
        codigo: newItem.codigo
      }]
    }));

    setShowNuevoRepuestoDialog(false);
    setShowRepuestosDialog(false);
    setNuevoRepuesto({ nombre: '', descripcion: '', categoria: '', unidad: 'unidad' });
    
    alert('✅ Nuevo repuesto registrado y agregado\n\n📦 El repuesto ha sido agregado al catálogo y al servicio actual');
  };

  const repuestosFiltrados = CATALOGO_REPUESTOS.filter(rep => 
    rep.nombre.toLowerCase().includes(searchRepuesto.toLowerCase()) ||
    rep.categoria.toLowerCase().includes(searchRepuesto.toLowerCase()) ||
    rep.codigo.toLowerCase().includes(searchRepuesto.toLowerCase())
  );

  const handleCompletarEquipo = () => {
    // Validaciones
    if (!formData.tipo || !formData.marca || !formData.serial) {
      alert('⚠️ Completa los datos básicos del equipo');
      setActiveTab('inspeccion');
      return;
    }

    if (formData.tareasRealizadas.length === 0) {
      alert('⚠️ Debes seleccionar al menos una tarea realizada');
      setActiveTab('tareas');
      return;
    }

    if (formData.fotosAntes.length < 2 || formData.fotosDespues.length < 2) {
      alert('⚠️ Debes capturar al menos 2 fotos antes y 2 después');
      setActiveTab('evidencias');
      return;
    }

    if (!formData.diagnosticoInicial.trim()) {
      alert('⚠️ Ingresa un diagnóstico inicial del equipo');
      setActiveTab('inspeccion');
      return;
    }

    if (!formData.observacionesFinales.trim()) {
      alert('⚠️ Ingresa observaciones finales del equipo');
      setActiveTab('finalizacion');
      return;
    }

    const updatedEquipment = {
      ...equipmentData,
      ...formData,
      status: 'completed' as const
    };

    alert(`✅ Equipo completado

📦 ${formData.tipo}
✅ ${formData.tareasRealizadas.length} tareas realizadas
📦 ${formData.repuestos.length} repuestos utilizados
📸 ${formData.fotosAntes.length + formData.fotosDespues.length} fotos capturadas

Guardando datos...`);

    onComplete(updatedEquipment);
  };

  const renderInspeccion = () => (
    <div className="space-y-4">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Datos del Equipo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Tipo de Equipo *</label>
            <Input
              value={formData.tipo}
              onChange={(e) => setFormData({...formData, tipo: e.target.value})}
              placeholder="Ej: Chiller, MiniSplit, etc."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Marca *</label>
              <Input
                value={formData.marca}
                onChange={(e) => setFormData({...formData, marca: e.target.value})}
                placeholder="Marca"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Modelo</label>
              <Input
                value={formData.modelo}
                onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                placeholder="Modelo"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Número de Serie *</label>
            <Input
              value={formData.serial}
              onChange={(e) => setFormData({...formData, serial: e.target.value})}
              placeholder="Serial"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Unidad Interna</label>
              <Input
                value={formData.unidadInterna}
                onChange={(e) => setFormData({...formData, unidadInterna: e.target.value})}
                placeholder="ID Interna"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Unidad Externa</label>
              <Input
                value={formData.unidadExterna}
                onChange={(e) => setFormData({...formData, unidadExterna: e.target.value})}
                placeholder="ID Externa"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Diagnóstico Inicial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Diagnóstico Inicial *</label>
              <Textarea
                value={formData.diagnosticoInicial}
                onChange={(e) => setFormData({...formData, diagnosticoInicial: e.target.value})}
                placeholder="Estado general del equipo, hallazgos principales..."
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Estado General</label>
              <Textarea
                value={formData.estadoGeneral}
                onChange={(e) => setFormData({...formData, estadoGeneral: e.target.value})}
                placeholder="Detalles adicionales del estado del equipo..."
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTareas = () => (
    <div className="space-y-4">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Tareas Realizadas</span>
            <Badge variant="outline">{formData.tareasRealizadas.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
            {TAREAS_PREDEFINIDAS.map((tarea, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleTarea(tarea)}
              >
                <Checkbox
                  checked={formData.tareasRealizadas.includes(tarea)}
                  onCheckedChange={() => toggleTarea(tarea)}
                />
                <label className="text-sm text-gray-900 cursor-pointer flex-1">
                  {tarea}
                </label>
              </div>
            ))}
            
            {formData.tareasRealizadas.filter(t => !TAREAS_PREDEFINIDAS.includes(t)).map((tarea, index) => (
              <div key={`custom-${index}`} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50">
                <Checkbox checked={true} />
                <label className="text-sm text-blue-900 font-medium flex-1">
                  {tarea}
                </label>
                <button
                  onClick={() => toggleTarea(tarea)}
                  className="text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {!showAgregarTarea ? (
            <Button
              onClick={() => setShowAgregarTarea(true)}
              variant="outline"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Tarea Personalizada
            </Button>
          ) : (
            <div className="space-y-2 p-3 border-2 border-dashed rounded-lg">
              <Input
                value={nuevaTarea}
                onChange={(e) => setNuevaTarea(e.target.value)}
                placeholder="Describe la tarea realizada..."
                onKeyDown={(e) => e.key === 'Enter' && agregarTareaPersonalizada()}
              />
              <div className="flex gap-2">
                <Button onClick={agregarTareaPersonalizada} className="flex-1 bg-success" size="sm">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
                <Button onClick={() => setShowAgregarTarea(false)} variant="outline" className="flex-1" size="sm">
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderRepuestos = () => (
    <div className="space-y-4">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Repuestos Utilizados</CardTitle>
          <CardDescription>Registra los materiales usados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            {formData.repuestos.map((repuesto, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Package className="h-4 w-4 text-gray-600" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{repuesto.nombre}</p>
                  <p className="text-xs text-gray-600">{repuesto.cantidad} {repuesto.unidad}</p>
                </div>
                <button
                  onClick={() => setFormData({...formData, repuestos: formData.repuestos.filter((_, i) => i !== index)})}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <Button onClick={agregarRepuesto} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Repuesto
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderEvidencias = () => (
    <div className="space-y-4">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Fotos ANTES del Servicio</CardTitle>
          <CardDescription>Estado inicial del equipo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {formData.fotosAntes.map((foto, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="h-12 w-12 text-gray-400" />
                </div>
                <button
                  onClick={() => setFormData({...formData, fotosAntes: formData.fotosAntes.filter((_, i) => i !== index)})}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="absolute bottom-2 left-2">
                  <Badge className="text-xs bg-orange-600">Antes #{index + 1}</Badge>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={() => agregarFoto('antes')} className="w-full bg-orange-600 hover:bg-orange-700">
            <Camera className="h-4 w-4 mr-2" />
            Capturar Foto ANTES ({formData.fotosAntes.length})
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Fotos DESPUÉS del Servicio</CardTitle>
          <CardDescription>Estado final del equipo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {formData.fotosDespues.map((foto, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="h-12 w-12 text-gray-400" />
                </div>
                <button
                  onClick={() => setFormData({...formData, fotosDespues: formData.fotosDespues.filter((_, i) => i !== index)})}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="absolute bottom-2 left-2">
                  <Badge className="text-xs bg-green-600">Después #{index + 1}</Badge>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={() => agregarFoto('despues')} className="w-full bg-success hover:bg-green-600">
            <Camera className="h-4 w-4 mr-2" />
            Capturar Foto DESPUÉS ({formData.fotosDespues.length})
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderFinalizacion = () => (
    <div className="space-y-4">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Mediciones Finales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold text-sm mb-2">Compresor #1</p>
            <div className="grid grid-cols-3 gap-2">
              <Input placeholder="L1" value={formData.compresor1_L1} onChange={(e) => setFormData({...formData, compresor1_L1: e.target.value})} />
              <Input placeholder="L2" value={formData.compresor1_L2} onChange={(e) => setFormData({...formData, compresor1_L2: e.target.value})} />
              <Input placeholder="L3" value={formData.compresor1_L3} onChange={(e) => setFormData({...formData, compresor1_L3: e.target.value})} />
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm mb-2">Blower</p>
            <div className="grid grid-cols-3 gap-2">
              <Input placeholder="L1" value={formData.blower1_L1} onChange={(e) => setFormData({...formData, blower1_L1: e.target.value})} />
              <Input placeholder="L2" value={formData.blower1_L2} onChange={(e) => setFormData({...formData, blower1_L2: e.target.value})} />
              <Input placeholder="L3" value={formData.blower1_L3} onChange={(e) => setFormData({...formData, blower1_L3: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Temp. Suministro</label>
              <Input placeholder="°C" value={formData.temperaturaSuministro} onChange={(e) => setFormData({...formData, temperaturaSuministro: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Temp. Retorno</label>
              <Input placeholder="°C" value={formData.temperaturaRetorno} onChange={(e) => setFormData({...formData, temperaturaRetorno: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Presión Alta</label>
              <Input placeholder="PSI" value={formData.presionAlta} onChange={(e) => setFormData({...formData, presionAlta: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Presión Baja</label>
              <Input placeholder="PSI" value={formData.presionBaja} onChange={(e) => setFormData({...formData, presionBaja: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Voltaje</label>
            <Input placeholder="V" value={formData.voltaje} onChange={(e) => setFormData({...formData, voltaje: e.target.value})} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Observaciones Finales</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.observacionesFinales}
            onChange={(e) => setFormData({...formData, observacionesFinales: e.target.value})}
            placeholder="Detalles adicionales del servicio..."
            rows={4}
          />
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Recomendaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.recomendaciones}
            onChange={(e) => setFormData({...formData, recomendaciones: e.target.value})}
            placeholder="Recomendaciones para el cliente..."
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  );

  const getTabIcon = (tab: string) => {
    switch(tab) {
      case 'inspeccion': return ClipboardList;
      case 'tareas': return Wrench;
      case 'repuestos': return Package;
      case 'evidencias': return Camera;
      case 'finalizacion': return CheckCircle2;
      default: return Package;
    }
  };

  const tabs = [
    { id: 'inspeccion', label: 'Inspección' },
    { id: 'tareas', label: 'Tareas' },
    { id: 'repuestos', label: 'Repuestos' },
    { id: 'evidencias', label: 'Evidencias' },
    { id: 'finalizacion', label: 'Finalización' }
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{equipmentData.tipo || 'Nuevo Equipo'}</h1>
            <p className="text-xs opacity-90">{serviceId}</p>
          </div>
          <Badge className={
            equipmentData.status === 'completed' ? 'bg-green-600' :
            equipmentData.status === 'in_progress' ? 'bg-orange-600' :
            'bg-gray-600'
          }>
            {equipmentData.status === 'completed' ? 'Completado' :
             equipmentData.status === 'in_progress' ? 'En Proceso' :
             'Pendiente'}
          </Badge>
        </div>

        {/* Tabs - Grid Layout */}
        <div className="grid grid-cols-3 gap-2">
          {tabs.map((tab) => {
            const Icon = getTabIcon(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'bg-white/10 text-white/90 hover:bg-white/20'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium text-center leading-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pb-32">
        {activeTab === 'inspeccion' && renderInspeccion()}
        {activeTab === 'tareas' && renderTareas()}
        {activeTab === 'repuestos' && renderRepuestos()}
        {activeTab === 'evidencias' && renderEvidencias()}
        {activeTab === 'finalizacion' && renderFinalizacion()}
      </div>

      {/* Botones Flotantes */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
        <div className="max-w-md mx-auto flex gap-2">
          <Button onClick={onBack} variant="outline" className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Guardar y Volver
          </Button>
          <Button onClick={handleCompletarEquipo} className="flex-1 bg-success hover:bg-green-600">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Completar Equipo
          </Button>
        </div>
      </div>

      {/* Dialog: Repuestos */}
      <Dialog open={showRepuestosDialog} onOpenChange={setShowRepuestosDialog}>
        <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Seleccionar Repuesto</DialogTitle>
            <DialogDescription>Busca y selecciona un repuesto del catálogo</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={searchRepuesto}
              onChange={(e) => setSearchRepuesto(e.target.value)}
              placeholder="Buscar repuesto..."
              className="w-full"
            />
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {repuestosFiltrados.map(repuesto => (
                <button
                  key={repuesto.id}
                  className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer w-full text-left ${
                    repuestoSeleccionado?.id === repuesto.id ? 'bg-blue-50 border-2 border-blue-500' : 'border border-gray-200'
                  }`}
                  onClick={() => seleccionarRepuesto(repuesto)}
                >
                  <Package className={`h-4 w-4 ${repuestoSeleccionado?.id === repuesto.id ? 'text-blue-600' : 'text-gray-600'}`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{repuesto.nombre}</p>
                    <p className="text-xs text-gray-600">{repuesto.codigo} · {repuesto.categoria}</p>
                  </div>
                  {repuestoSeleccionado?.id === repuesto.id && (
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  )}
                </button>
              ))}
            </div>

            {repuestoSeleccionado && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">Cantidad:</p>
                <Input
                  type="number"
                  min="1"
                  value={cantidadRepuesto}
                  onChange={(e) => setCantidadRepuesto(parseInt(e.target.value) || 1)}
                  className="w-full"
                />
                <p className="text-xs text-blue-700 mt-2">
                  Unidad: {repuestoSeleccionado.unidad}
                </p>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setShowRepuestosDialog(false);
                setShowNuevoRepuestoDialog(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              ¿No encuentras el repuesto? Regístralo aquí
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowRepuestosDialog(false);
                  setRepuestoSeleccionado(null);
                  setSearchRepuesto('');
                }}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-success hover:bg-green-600"
                onClick={confirmarRepuesto}
                disabled={!repuestoSeleccionado}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Agregar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Nuevo Repuesto */}
      <Dialog open={showNuevoRepuestoDialog} onOpenChange={setShowNuevoRepuestoDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Repuesto</DialogTitle>
            <DialogDescription>Ingresa los detalles del nuevo repuesto</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={nuevoRepuesto.nombre}
              onChange={(e) => setNuevoRepuesto({...nuevoRepuesto, nombre: e.target.value})}
              placeholder="Nombre del repuesto..."
              className="w-full"
            />
            <Input
              value={nuevoRepuesto.categoria}
              onChange={(e) => setNuevoRepuesto({...nuevoRepuesto, categoria: e.target.value})}
              placeholder="Categoría (opcional)..."
              className="w-full"
            />
            <Input
              value={nuevoRepuesto.unidad}
              onChange={(e) => setNuevoRepuesto({...nuevoRepuesto, unidad: e.target.value})}
              placeholder="Unidad de medida..."
              className="w-full"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowNuevoRepuestoDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-success hover:bg-green-600"
                onClick={registrarNuevoRepuesto}
              >
                Registrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}