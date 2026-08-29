import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { Checkbox } from '../ui/checkbox';
import { 
  Camera,
  CheckCircle2,
  X,
  ChevronRight,
  ChevronLeft,
  User,
  Star,
  Zap,
  Wrench,
  Package,
  Plus,
  Thermometer,
  Wind,
  Settings,
  AlertCircle,
  Save,
  Printer
} from 'lucide-react';

interface MaintenanceFormCompleteProps {
  service: any;
  onClose: () => void;
}

// Tipos de equipos según formato Ingelectri
const EQUIPMENT_TYPES = [
  { id: 'aire_ventana', label: 'Aire Ventana' },
  { id: 'aire_minisplit', label: 'Aire MiniSplit' },
  { id: 'aire_tipo_techo', label: 'Aire Tipo Techo' },
  { id: 'aire_central', label: 'Aire Central' },
  { id: 'aire_cassette', label: 'Aire Cassette' },
  { id: 'chillers', label: 'Chillers' },
  { id: 'fancoli', label: 'Fancoli' },
  { id: 'paquete', label: 'Paquete' },
  { id: 'uma', label: 'UMA' },
  { id: 'torre_enfriamiento', label: 'Torre de enfriamiento' },
  { id: 'vanador', label: 'Vanador' },
  { id: 'tableros_elec', label: 'Tableros Elec' },
  { id: 'bomba', label: 'Bomba' },
  { id: 'otro', label: 'Otro (Especifique cuál)' }
];

// Trabajos realizados según formato Ingelectri
const TRABAJOS_REALIZADOS = [
  'Limpieza y reajuste sistema eléctrico',
  'Limpieza unidad evaporadora',
  'Limpieza unidad condensadora',
  'Limpieza torres de enfriamiento',
  'Limpieza de rejillas',
  'Limpieza de filtros de aire',
  'Lubricación de Rodamientos',
  'Cambio de válvula',
  'Destape de drenaje',
  'Limpieza de electroválvula',
  'Mantenimiento de bomba',
  'Limpieza piscinas (torres)',
  'Retrovisor',
  'Inspección de Bomba',
  'medición de capacitores',
  'medición de voltaje',
  'Inspección de Carga Refrigerante',
  'medición de consumo energético',
  'Limpieza de bandejas',
  'Cambio de bandejas',
  'Cambio de Blower',
  'Cambio de actuador',
  'Mantenimiento Químico',
  'Lubricación de motor'
];

export function MaintenanceFormComplete({ service, onClose }: MaintenanceFormCompleteProps) {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Tipo de equipo
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<string>('');
  const [otherEquipmentType, setOtherEquipmentType] = useState('');
  const [maintenanceType, setMaintenanceType] = useState<'preventivo' | 'correctivo'>('preventivo');
  const [contractedService, setContractedService] = useState<'si' | 'no'>('si');
  
  const [photos, setPhotos] = useState<string[]>([]);
  const [materials, setMaterials] = useState<{name: string, quantity: number, unit: string}[]>([]);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [newMaterial, setNewMaterial] = useState({name: '', quantity: 1, unit: 'unidad'});
  const [signature, setSignature] = useState('');
  const [coordinatorSignature, setCoordinatorSignature] = useState('');
  const [clientRating, setClientRating] = useState(0);
  
  const [formData, setFormData] = useState({
    // Datos generales
    marca: '',
    modelo: '',
    serial: '',
    unidadInterna: '',
    unidadExterna: '',
    
    // Trabajos realizados
    trabajosRealizados: [] as string[],
    otrosTrabajosRealizados: '',
    
    // Datos de funcionamiento - Compresores
    compresor1_L1: '',
    compresor1_L2: '',
    compresor1_L3: '',
    compresor2_L1: '',
    compresor2_L2: '',
    compresor2_L3: '',
    
    // Datos de funcionamiento - Ventiladores
    ventiladorCond1_L1: '',
    ventiladorCond1_L2: '',
    ventiladorCond1_L3: '',
    ventiladorCond2_L1: '',
    ventiladorCond2_L2: '',
    ventiladorCond2_L3: '',
    ventiladorCond3_L1: '',
    ventiladorCond3_L2: '',
    ventiladorCond3_L3: '',
    ventiladorCond4_L1: '',
    ventiladorCond4_L2: '',
    ventiladorCond4_L3: '',
    
    // Blowers
    blower1_L1: '',
    blower1_L2: '',
    blower1_L3: '',
    blower2_L1: '',
    blower2_L2: '',
    blower2_L3: '',
    
    // Otros
    otro_L1: '',
    otro_L2: '',
    otro_L3: '',
    
    // Temperaturas y presiones
    temperaturaSuministro: '',
    temperaturaRetorno: '',
    presionAltaEtapa1: '',
    presionBajaEtapa1: '',
    presionAltaEtapa2: '',
    presionBajaEtapa2: '',
    voltajeEquipo: '',
    
    // Observaciones
    observaciones: '',
    
    // Repuestos utilizados
    repuestosUtilizados: false,
    
    // Usuario que recibe
    nombreUsuarioRecibe: '',
    firmaUsuarioRecibe: ''
  });

  const steps = [
    { title: 'Tipo de Equipo', icon: Settings },
    { title: 'Datos del Equipo', icon: Package },
    { title: 'Trabajos Realizados', icon: Wrench },
    { title: 'Mediciones', icon: Zap },
    { title: 'Repuestos', icon: Package },
    { title: 'Evidencias', icon: Camera },
    { title: 'Observaciones', icon: AlertCircle },
    { title: 'Firmas', icon: User }
  ];

  const addMaterial = () => {
    if (!newMaterial.name.trim()) {
      alert('⚠️ Ingresa el nombre del material');
      return;
    }
    setMaterials([...materials, {...newMaterial}]);
    setNewMaterial({name: '', quantity: 1, unit: 'unidad'});
    setShowMaterialForm(false);
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const toggleTrabajo = (trabajo: string) => {
    setFormData(prev => ({
      ...prev,
      trabajosRealizados: prev.trabajosRealizados.includes(trabajo)
        ? prev.trabajosRealizados.filter(t => t !== trabajo)
        : [...prev.trabajosRealizados, trabajo]
    }));
  };

  const handleNext = () => {
    // Validaciones por paso
    if (currentStep === 0 && !selectedEquipmentType) {
      alert('⚠️ Selecciona el tipo de equipo');
      return;
    }
    if (currentStep === 0 && selectedEquipmentType === 'otro' && !otherEquipmentType.trim()) {
      alert('⚠️ Especifica el tipo de equipo');
      return;
    }
    if (currentStep === 2 && formData.trabajosRealizados.length === 0) {
      alert('⚠️ Debes marcar al menos un trabajo realizado');
      return;
    }
    if (currentStep === 5 && photos.length < 2) {
      alert('⚠️ Debes capturar al menos 2 fotos (antes y después)');
      return;
    }
    if (currentStep === 7) {
      handleComplete();
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleComplete = () => {
    if (!signature) {
      alert('⚠️ Se requiere la firma del usuario que recibe');
      return;
    }
    if (!formData.nombreUsuarioRecibe.trim()) {
      alert('⚠️ Ingresa el nombre del usuario que recibe');
      return;
    }
    if (clientRating === 0) {
      alert('⚠️ Solicita al cliente que califique el servicio');
      return;
    }

    alert(`✅ MANTENIMIENTO COMPLETADO

📋 Orden: ${service.id}
🔧 Tipo: ${maintenanceType.toUpperCase()}
📦 Equipo: ${selectedEquipmentType === 'otro' ? otherEquipmentType : EQUIPMENT_TYPES.find(e => e.id === selectedEquipmentType)?.label}

✅ ${formData.trabajosRealizados.length} trabajos realizados
📦 ${materials.length} repuestos utilizados
📸 ${photos.length} fotos capturadas
⭐ Calificación: ${clientRating}/5

📱 Datos sincronizados con el servidor
📄 Generando reporte PDF...
🖨️ ¿Deseas imprimir etiqueta QR?`);
    
    onClose();
  };

  const renderStep0_TipoEquipo = () => (
    <div className="space-y-4">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Tipo de Mantenimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={maintenanceType === 'preventivo' ? 'default' : 'outline'}
              className={`flex-1 ${maintenanceType === 'preventivo' ? 'bg-blue-600' : ''}`}
              onClick={() => setMaintenanceType('preventivo')}
            >
              Preventivo
            </Button>
            <Button
              variant={maintenanceType === 'correctivo' ? 'default' : 'outline'}
              className={`flex-1 ${maintenanceType === 'correctivo' ? 'bg-orange-600' : ''}`}
              onClick={() => setMaintenanceType('correctivo')}
            >
              Correctivo
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Mantenimiento Contratado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={contractedService === 'si' ? 'default' : 'outline'}
              className={`flex-1 ${contractedService === 'si' ? 'bg-green-600' : ''}`}
              onClick={() => setContractedService('si')}
            >
              SÍ
            </Button>
            <Button
              variant={contractedService === 'no' ? 'default' : 'outline'}
              className={`flex-1 ${contractedService === 'no' ? 'bg-red-600' : ''}`}
              onClick={() => setContractedService('no')}
            >
              NO
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Tipo de Equipo a Revisar</CardTitle>
          <CardDescription>Selecciona el tipo de equipo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
            {EQUIPMENT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedEquipmentType(type.id)}
                className={`p-3 rounded-lg border-2 text-left text-sm transition-all ${
                  selectedEquipmentType === type.id
                    ? 'border-brand bg-orange-50 text-brand font-semibold'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
          
          {selectedEquipmentType === 'otro' && (
            <div className="mt-4">
              <label className="text-sm font-medium mb-2 block">Especifique cuál:</label>
              <Input
                value={otherEquipmentType}
                onChange={(e) => setOtherEquipmentType(e.target.value)}
                placeholder="Ej: Sistema VRF, Fan Coil, etc."
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderStep1_DatosEquipo = () => (
    <div className="space-y-4">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Datos del Equipo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">MARCA</label>
            <Input
              value={formData.marca}
              onChange={(e) => setFormData({...formData, marca: e.target.value})}
              placeholder="Ej: Carrier, York, Trane..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">MODELO</label>
              <Input
                value={formData.modelo}
                onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                placeholder="Modelo"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">SERIAL</label>
              <Input
                value={formData.serial}
                onChange={(e) => setFormData({...formData, serial: e.target.value})}
                placeholder="Número serial"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">UNIDAD INTERNA</label>
            <Input
              value={formData.unidadInterna}
              onChange={(e) => setFormData({...formData, unidadInterna: e.target.value})}
              placeholder="Identificador unidad interna"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">UNIDAD EXTERNA</label>
            <Input
              value={formData.unidadExterna}
              onChange={(e) => setFormData({...formData, unidadExterna: e.target.value})}
              placeholder="Identificador unidad externa"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep2_TrabajosRealizados = () => (
    <div className="space-y-4">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Trabajos Realizados</CardTitle>
          <CardDescription>Selecciona todas las tareas completadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {TRABAJOS_REALIZADOS.map((trabajo, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleTrabajo(trabajo)}
              >
                <Checkbox
                  checked={formData.trabajosRealizados.includes(trabajo)}
                  onCheckedChange={() => toggleTrabajo(trabajo)}
                />
                <label className="text-sm text-gray-900 cursor-pointer flex-1">
                  {trabajo}
                </label>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <label className="text-sm font-medium mb-2 block">
              Especificar otros procedimientos realizados:
            </label>
            <Textarea
              value={formData.otrosTrabajosRealizados}
              onChange={(e) => setFormData({...formData, otrosTrabajosRealizados: e.target.value})}
              placeholder="Describe otros trabajos realizados..."
              rows={3}
            />
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-semibold text-blue-900">
              ✅ {formData.trabajosRealizados.length} trabajos seleccionados
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep3_Mediciones = () => (
    <div className="space-y-4">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Datos de Funcionamiento del Equipo
          </CardTitle>
          <CardDescription>Corrientes (L1, L2, L3)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Compresores */}
          <div>
            <p className="font-semibold text-sm mb-2 text-gray-900">Compresor Circuito #1</p>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="L1"
                value={formData.compresor1_L1}
                onChange={(e) => setFormData({...formData, compresor1_L1: e.target.value})}
              />
              <Input
                placeholder="L2"
                value={formData.compresor1_L2}
                onChange={(e) => setFormData({...formData, compresor1_L2: e.target.value})}
              />
              <Input
                placeholder="L3"
                value={formData.compresor1_L3}
                onChange={(e) => setFormData({...formData, compresor1_L3: e.target.value})}
              />
            </div>
          </div>

          <div>
            <p className="font-semibold text-sm mb-2 text-gray-900">Compresor Circuito #2</p>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="L1"
                value={formData.compresor2_L1}
                onChange={(e) => setFormData({...formData, compresor2_L1: e.target.value})}
              />
              <Input
                placeholder="L2"
                value={formData.compresor2_L2}
                onChange={(e) => setFormData({...formData, compresor2_L2: e.target.value})}
              />
              <Input
                placeholder="L3"
                value={formData.compresor2_L3}
                onChange={(e) => setFormData({...formData, compresor2_L3: e.target.value})}
              />
            </div>
          </div>

          {/* Ventiladores Condensadora */}
          <div className="border-t pt-3">
            <p className="font-semibold text-sm mb-2 text-gray-900">Ventilador Condensadora 3</p>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="L1"
                value={formData.ventiladorCond3_L1}
                onChange={(e) => setFormData({...formData, ventiladorCond3_L1: e.target.value})}
              />
              <Input
                placeholder="L2"
                value={formData.ventiladorCond3_L2}
                onChange={(e) => setFormData({...formData, ventiladorCond3_L2: e.target.value})}
              />
              <Input
                placeholder="L3"
                value={formData.ventiladorCond3_L3}
                onChange={(e) => setFormData({...formData, ventiladorCond3_L3: e.target.value})}
              />
            </div>
          </div>

          <div>
            <p className="font-semibold text-sm mb-2 text-gray-900">Ventilador Condensadora 4</p>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="L1"
                value={formData.ventiladorCond4_L1}
                onChange={(e) => setFormData({...formData, ventiladorCond4_L1: e.target.value})}
              />
              <Input
                placeholder="L2"
                value={formData.ventiladorCond4_L2}
                onChange={(e) => setFormData({...formData, ventiladorCond4_L2: e.target.value})}
              />
              <Input
                placeholder="L3"
                value={formData.ventiladorCond4_L3}
                onChange={(e) => setFormData({...formData, ventiladorCond4_L3: e.target.value})}
              />
            </div>
          </div>

          {/* Blowers */}
          <div className="border-t pt-3">
            <p className="font-semibold text-sm mb-2 text-gray-900">Blower 1</p>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="L1"
                value={formData.blower1_L1}
                onChange={(e) => setFormData({...formData, blower1_L1: e.target.value})}
              />
              <Input
                placeholder="L2"
                value={formData.blower1_L2}
                onChange={(e) => setFormData({...formData, blower1_L2: e.target.value})}
              />
              <Input
                placeholder="L3"
                value={formData.blower1_L3}
                onChange={(e) => setFormData({...formData, blower1_L3: e.target.value})}
              />
            </div>
          </div>

          <div>
            <p className="font-semibold text-sm mb-2 text-gray-900">Blower 2</p>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="L1"
                value={formData.blower2_L1}
                onChange={(e) => setFormData({...formData, blower2_L1: e.target.value})}
              />
              <Input
                placeholder="L2"
                value={formData.blower2_L2}
                onChange={(e) => setFormData({...formData, blower2_L2: e.target.value})}
              />
              <Input
                placeholder="L3"
                value={formData.blower2_L3}
                onChange={(e) => setFormData({...formData, blower2_L3: e.target.value})}
              />
            </div>
          </div>

          {/* Otro */}
          <div className="border-t pt-3">
            <p className="font-semibold text-sm mb-2 text-gray-900">Otro</p>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="L1"
                value={formData.otro_L1}
                onChange={(e) => setFormData({...formData, otro_L1: e.target.value})}
              />
              <Input
                placeholder="L2"
                value={formData.otro_L2}
                onChange={(e) => setFormData({...formData, otro_L2: e.target.value})}
              />
              <Input
                placeholder="L3"
                value={formData.otro_L3}
                onChange={(e) => setFormData({...formData, otro_L3: e.target.value})}
              />
            </div>
          </div>

          {/* Temperaturas y Presiones */}
          <div className="border-t pt-3">
            <p className="font-semibold text-sm mb-3 text-gray-900 flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-red-600" />
              Temperaturas y Presiones
            </p>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Temperatura de Suministro</label>
                  <Input
                    placeholder="°C o °F"
                    value={formData.temperaturaSuministro}
                    onChange={(e) => setFormData({...formData, temperaturaSuministro: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Temperatura de Retorno</label>
                  <Input
                    placeholder="°C o °F"
                    value={formData.temperaturaRetorno}
                    onChange={(e) => setFormData({...formData, temperaturaRetorno: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Presión Alta Etapa 1</label>
                  <Input
                    placeholder="PSI"
                    value={formData.presionAltaEtapa1}
                    onChange={(e) => setFormData({...formData, presionAltaEtapa1: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Presión Baja Etapa 1</label>
                  <Input
                    placeholder="PSI"
                    value={formData.presionBajaEtapa1}
                    onChange={(e) => setFormData({...formData, presionBajaEtapa1: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Presión Alta Etapa 2</label>
                  <Input
                    placeholder="PSI"
                    value={formData.presionAltaEtapa2}
                    onChange={(e) => setFormData({...formData, presionAltaEtapa2: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Presión Baja Etapa 2</label>
                  <Input
                    placeholder="PSI"
                    value={formData.presionBajaEtapa2}
                    onChange={(e) => setFormData({...formData, presionBajaEtapa2: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1 block">Voltaje del Equipo</label>
                <Input
                  placeholder="Voltaje"
                  value={formData.voltajeEquipo}
                  onChange={(e) => setFormData({...formData, voltajeEquipo: e.target.value})}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep4_Repuestos = () => (
    <div className="space-y-4">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Repuestos Utilizados</CardTitle>
          <CardDescription>Registra los materiales y repuestos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox
                checked={formData.repuestosUtilizados}
                onCheckedChange={(checked) => setFormData({...formData, repuestosUtilizados: checked as boolean})}
              />
              <label className="text-sm font-medium text-gray-900">
                ¿Se utilizaron repuestos?
              </label>
              <Badge className={formData.repuestosUtilizados ? 'bg-green-600' : 'bg-gray-400'}>
                {formData.repuestosUtilizados ? 'SÍ' : 'NO'}
              </Badge>
            </div>
          </div>

          {formData.repuestosUtilizados && (
            <>
              <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                {materials.map((material, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Package className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{material.name}</p>
                      <p className="text-xs text-gray-600">{material.quantity} {material.unit}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeMaterial(index)}
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>

              {!showMaterialForm ? (
                <Button
                  onClick={() => setShowMaterialForm(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Repuesto
                </Button>
              ) : (
                <div className="space-y-3 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <Input
                    placeholder="Nombre del repuesto"
                    value={newMaterial.name}
                    onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Cantidad"
                      value={newMaterial.quantity}
                      onChange={(e) => setNewMaterial({...newMaterial, quantity: parseInt(e.target.value) || 1})}
                    />
                    <Input
                      placeholder="Unidad"
                      value={newMaterial.unit}
                      onChange={(e) => setNewMaterial({...newMaterial, unit: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addMaterial} className="flex-1 bg-success">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                    <Button onClick={() => setShowMaterialForm(false)} variant="outline" className="flex-1">
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderStep5_Evidencias = () => (
    <div className="space-y-4">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Evidencias Fotográficas</CardTitle>
          <CardDescription>Captura fotos antes y después del servicio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="h-12 w-12 text-gray-400" />
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="absolute bottom-2 left-2">
                  <Badge className="text-xs">Foto {index + 1}</Badge>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={() => {
              setPhotos([...photos, `photo_${Date.now()}.jpg`]);
              alert('📸 Cámara activada\n\nCaptura la foto del equipo');
            }}
            className="w-full bg-brand hover:bg-brand"
          >
            <Camera className="h-4 w-4 mr-2" />
            Capturar Foto ({photos.length}/10)
          </Button>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-900">
              💡 <strong>Recomendación:</strong> Captura al menos 2 fotos (antes y después del servicio)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep6_Observaciones = () => (
    <div className="space-y-4">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Observaciones y/o Recomendaciones</CardTitle>
          <CardDescription>Describe hallazgos y recomendaciones</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.observaciones}
            onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
            placeholder="Ejemplo:&#10;- El equipo presenta buen funcionamiento&#10;- Se recomienda cambiar filtros en 3 meses&#10;- Presiones dentro del rango normal&#10;- Sistema operando correctamente"
            rows={8}
            className="text-sm"
          />

          <div className="mt-4 p-3 bg-amber-50 rounded-lg">
            <p className="text-xs text-amber-900 mb-2">
              <strong>💡 Sugerencias predefinidas:</strong>
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'Equipo en buen estado',
                'Requiere limpieza profunda próximo mes',
                'Presiones normales',
                'Sistema operando correctamente',
                'Cambiar filtros en 90 días'
              ].map((sugerencia, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newObs = formData.observaciones 
                      ? `${formData.observaciones}\n- ${sugerencia}`
                      : `- ${sugerencia}`;
                    setFormData({...formData, observaciones: newObs});
                  }}
                  className="text-xs"
                >
                  + {sugerencia}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep7_Firmas = () => (
    <div className="space-y-4">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Firma del Usuario que Recibe</CardTitle>
          <CardDescription>Nombre y firma del cliente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Nombre completo *</label>
            <Input
              value={formData.nombreUsuarioRecibe}
              onChange={(e) => setFormData({...formData, nombreUsuarioRecibe: e.target.value})}
              placeholder="Nombre del usuario que recibe"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Firma digital *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
              {!signature ? (
                <div>
                  <User className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <Button
                    onClick={() => {
                      setSignature('firma_cliente_capturada');
                      alert('✍️ Panel de firma activado\n\nEl cliente puede firmar en la pantalla');
                    }}
                    variant="outline"
                  >
                    Capturar Firma
                  </Button>
                </div>
              ) : (
                <div>
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-600 mb-2" />
                  <p className="text-sm text-green-700 font-medium mb-2">✓ Firma capturada</p>
                  <Button
                    onClick={() => setSignature('')}
                    size="sm"
                    variant="outline"
                  >
                    Recapturar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Calificación del Servicio</CardTitle>
          <CardDescription>Solicita al cliente que califique</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-3">
            <p className="text-sm text-gray-600 mb-3">¿Cómo califica el servicio?</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setClientRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= clientRating
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {clientRating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {clientRating === 5 && '¡Excelente!'}
                {clientRating === 4 && 'Muy bueno'}
                {clientRating === 3 && 'Bueno'}
                {clientRating === 2 && 'Regular'}
                {clientRating === 1 && 'Necesita mejorar'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-green-900 mb-1">¿Listo para finalizar?</p>
              <p className="text-xs text-green-700">
                Al completar, se generará el reporte PDF y se sincronizará con el servidor
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderStep0_TipoEquipo();
      case 1: return renderStep1_DatosEquipo();
      case 2: return renderStep2_TrabajosRealizados();
      case 3: return renderStep3_Mediciones();
      case 4: return renderStep4_Repuestos();
      case 5: return renderStep5_Evidencias();
      case 6: return renderStep6_Observaciones();
      case 7: return renderStep7_Firmas();
      default: return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[95vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <span className="text-lg">Formulario de Mantenimiento</span>
            <Badge variant="outline">{service.id}</Badge>
          </DialogTitle>
          <DialogDescription>
            Paso {currentStep + 1} de {steps.length}: {steps[currentStep].title}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="px-6">
          <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
        </div>

        {/* Steps Indicator */}
        <div className="px-6 py-3 overflow-x-auto">
          <div className="flex gap-2">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                    index === currentStep
                      ? 'bg-brand text-white'
                      : index < currentStep
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <StepIcon className="h-4 w-4" />
                  <span className="text-xs whitespace-nowrap">{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {renderCurrentStep()}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 pt-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <Button
              onClick={handleBack}
              variant="outline"
              disabled={currentStep === 0}
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            <Button
              onClick={handleNext}
              className={`flex-1 ${
                currentStep === steps.length - 1
                  ? 'bg-success hover:bg-green-600'
                  : 'bg-brand hover:bg-brand'
              }`}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Completar
                </>
              ) : (
                <>
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
