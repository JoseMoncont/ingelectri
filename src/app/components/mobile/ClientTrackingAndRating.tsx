import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { 
  MapPin,
  Navigation,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  Star,
  User,
  Camera,
  ThumbsUp,
  Award,
  Send,
  AlertCircle,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface TechnicianLocation {
  lat: number;
  lng: number;
  timestamp: string;
  status: 'en_route' | 'arrived' | 'working' | 'completed';
}

interface ServiceRating {
  serviceId: string;
  orderNumber: string;
  equipment: string;
  completedDate: string;
  technician: {
    name: string;
    photo: string;
  };
  rating?: number;
  feedback?: string;
  wouldRecommend?: boolean;
}

export function ClientTrackingAndRating() {
  const [activeService, setActiveService] = useState<any>(null);
  const [technicianLocation, setTechnicianLocation] = useState<TechnicianLocation>({
    lat: 4.6813,
    lng: -74.0583,
    timestamp: new Date().toLocaleTimeString('es-CO'),
    status: 'en_route'
  });
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingFeedback, setRatingFeedback] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [estimatedArrival, setEstimatedArrival] = useState(15); // minutos

  // Mock active service
  const mockActiveService = {
    id: 'S001',
    orderNumber: 'OS-2025-001',
    equipment: 'Sistema HVAC Piso 3',
    scheduledTime: '10:00 AM',
    technician: {
      name: 'Carlos Ramírez',
      phone: '+57 300 123 4567',
      photo: 'CR',
      rating: 4.8,
      completedServices: 156
    },
    clientLocation: {
      lat: 4.6545,
      lng: -74.0605,
      address: 'Carrera 7 #72-50, Bogotá'
    }
  };

  // Mock services pending rating
  const servicesPendingRating: ServiceRating[] = [
    {
      serviceId: 'S005',
      orderNumber: 'OS-2025-005',
      equipment: 'Chiller Central',
      completedDate: '2025-01-08 04:30 PM',
      technician: {
        name: 'Ana Morales',
        photo: 'AM'
      }
    },
    {
      serviceId: 'S004',
      orderNumber: 'OS-2025-004',
      equipment: 'Mini Split Oficina',
      completedDate: '2025-01-07 11:20 AM',
      technician: {
        name: 'Pedro Sánchez',
        photo: 'PS'
      }
    }
  ];

  // Simulate technician movement
  useEffect(() => {
    if (!activeService) return;

    const interval = setInterval(() => {
      setTechnicianLocation(prev => {
        // Simulate movement towards client location
        const newLat = prev.lat + (Math.random() - 0.5) * 0.001;
        const newLng = prev.lng + (Math.random() - 0.5) * 0.001;
        
        return {
          lat: newLat,
          lng: newLng,
          timestamp: new Date().toLocaleTimeString('es-CO'),
          status: prev.status
        };
      });

      // Decrease estimated arrival time
      setEstimatedArrival(prev => Math.max(0, prev - 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [activeService]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_route': return 'bg-steel';
      case 'arrived': return 'bg-success';
      case 'working': return 'bg-warning';
      case 'completed': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'en_route': return 'En Camino';
      case 'arrived': return 'En Sitio';
      case 'working': return 'Trabajando';
      case 'completed': return 'Completado';
      default: return status;
    }
  };

  const submitRating = () => {
    if (selectedRating === 0) {
      toast.error('Selecciona una calificación');
      return;
    }

    if (wouldRecommend === null) {
      toast.error('Indica si recomendarías el servicio');
      return;
    }

    toast.success('¡Gracias por tu calificación!', {
      description: 'Tu opinión nos ayuda a mejorar. Ganaste 50 puntos de fidelidad.',
    });

    setShowRatingModal(false);
    setSelectedRating(0);
    setRatingFeedback('');
    setWouldRecommend(null);
  };

  const renderTracking = () => (
    <div className="space-y-4">
      {mockActiveService ? (
        <>
          {/* Live Tracking Map */}
          <Card className="border-0 shadow-lg overflow-hidden rounded-3xl">
            <div className="relative h-56 bg-steel/10">
              {/* Map Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-14 w-14 text-brand mx-auto mb-2 animate-bounce" />
                  <p className="text-sm font-semibold text-gray-700">Mapa en Tiempo Real</p>
                  <p className="text-xs text-gray-500">
                    Lat: {technicianLocation.lat.toFixed(4)}, Lng: {technicianLocation.lng.toFixed(4)}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <Badge className={`${getStatusColor(technicianLocation.status)} text-white font-bold`}>
                  {getStatusLabel(technicianLocation.status)}
                </Badge>
              </div>

              {/* ETA Badge */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand" />
                  <div>
                    <p className="text-xs text-gray-600">Llegada estimada</p>
                    <p className="text-lg font-bold text-gray-900">{estimatedArrival} min</p>
                  </div>
                </div>
              </div>

              {/* Last Update */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                <p className="text-xs text-gray-600">Última actualización: {technicianLocation.timestamp}</p>
              </div>
            </div>
          </Card>

          {/* Technician Info */}
          <Card className="border-0 shadow-lg bg-steel/10 rounded-3xl">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-16 w-16 rounded-full bg-brand flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {mockActiveService.technician.photo}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{mockActiveService.technician.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-warning fill-warning" />
                      <span className="text-sm font-semibold text-gray-700">
                        {mockActiveService.technician.rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      • {mockActiveService.technician.completedServices} servicios
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => window.open(`tel:${mockActiveService.technician.phone}`)}
                  className="bg-success hover:bg-success/90"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar
                </Button>
                <Button
                  onClick={() => toast.info('Chat próximamente disponible')}
                  variant="outline"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-base">Detalles del Servicio</CardTitle>
              <CardDescription>{mockActiveService.orderNumber}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 text-xs mb-1">Equipo</p>
                <p className="font-semibold text-gray-900">{mockActiveService.equipment}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs mb-1">Hora Programada</p>
                <p className="font-semibold text-gray-900">{mockActiveService.scheduledTime}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs mb-1">Ubicación</p>
                <p className="text-gray-900">{mockActiveService.clientLocation.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-base">Línea de Tiempo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    technicianLocation.status === 'en_route' ? 'bg-steel' : 'bg-success'
                  }`}>
                    <Navigation className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">En Camino</p>
                    <p className="text-xs text-gray-600">El técnico se dirige a tu ubicación</p>
                  </div>
                  {technicianLocation.status === 'en_route' && (
                    <Badge className="bg-steel">Actual</Badge>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    ['arrived', 'working', 'completed'].includes(technicianLocation.status) ? 'bg-success' : 'bg-gray-200'
                  }`}>
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">Llegada al Sitio</p>
                    <p className="text-xs text-gray-600">Técnico en tu ubicación</p>
                  </div>
                  {technicianLocation.status === 'arrived' && (
                    <Badge className="bg-success">Actual</Badge>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    ['working', 'completed'].includes(technicianLocation.status) ? 'bg-warning' : 'bg-gray-200'
                  }`}>
                    <AlertCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">Trabajando</p>
                    <p className="text-xs text-gray-600">Realizando el mantenimiento</p>
                  </div>
                  {technicianLocation.status === 'working' && (
                    <Badge className="bg-warning">Actual</Badge>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    technicianLocation.status === 'completed' ? 'bg-success' : 'bg-gray-200'
                  }`}>
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">Completado</p>
                    <p className="text-xs text-gray-600">Servicio finalizado</p>
                  </div>
                  {technicianLocation.status === 'completed' && (
                    <Badge className="bg-success">Actual</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Simulate Status Change */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setTechnicianLocation(prev => ({ ...prev, status: 'arrived' }))}
            >
              Simular Llegada
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setTechnicianLocation(prev => ({ ...prev, status: 'working' }))}
            >
              Simular Trabajo
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                setTechnicianLocation(prev => ({ ...prev, status: 'completed' }));
                setTimeout(() => setShowRatingModal(true), 1000);
              }}
            >
              Completar
            </Button>
          </div>
        </>
      ) : (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6 text-center">
            <MapPin className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">No hay servicios activos</p>
            <Button
              onClick={() => setActiveService(mockActiveService)}
              className="rounded-full bg-brand hover:bg-brand/90"
            >
              Simular Servicio Activo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderRatings = () => (
    <div className="space-y-4">
      {/* Pending Ratings */}
      {servicesPendingRating.length > 0 ? (
        <>
          <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  Tienes {servicesPendingRating.length} servicio(s) sin calificar
                </p>
                <p className="text-xs text-warning mt-1">
                  Tu opinión nos ayuda a mejorar la calidad del servicio
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {servicesPendingRating.map((service) => (
              <Card key={service.serviceId} className="border-0 shadow-lg rounded-3xl">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-12 w-12 rounded-full bg-steel flex items-center justify-center text-white font-bold">
                      {service.technician.photo}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">{service.orderNumber}</p>
                      <p className="text-xs text-gray-600">{service.equipment}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{service.completedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl mb-3">
                    <p className="text-xs text-gray-600 mb-1">Técnico</p>
                    <p className="font-semibold text-gray-900 text-sm">{service.technician.name}</p>
                  </div>

                  <Button
                    onClick={() => {
                      setShowRatingModal(true);
                      // Here you would set the service being rated
                    }}
                    className="w-full rounded-full bg-brand hover:bg-brand/90"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Calificar Servicio
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto text-success mb-4" />
            <p className="font-semibold text-gray-900 mb-2">¡Todo al día!</p>
            <p className="text-sm text-gray-600">No tienes servicios pendientes de calificar</p>
          </CardContent>
        </Card>
      )}

      {/* Rating History */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand" />
            Tus Calificaciones Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { service: 'OS-2025-003', tech: 'Luis Torres', rating: 5, date: '2025-01-06', comment: 'Excelente servicio' },
              { service: 'OS-2024-098', tech: 'María González', rating: 4, date: '2024-12-28', comment: 'Muy profesional' },
              { service: 'OS-2024-095', tech: 'Juan Pérez', rating: 5, date: '2024-12-20', comment: 'Trabajo impecable' }
            ].map((rating, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900 text-sm">{rating.service}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < rating.rating
                              ? 'text-warning fill-warning'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{rating.tech}</p>
                  <p className="text-xs text-gray-700 italic">"{rating.comment}"</p>
                  <p className="text-xs text-gray-500 mt-1">{rating.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-4 pb-24 pt-9 px-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Rastreo y Calificaciones</h2>
        <p className="text-sm text-gray-500">Sigue tu servicio en tiempo real</p>
      </div>

      {/* Toggle */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-full">
        <button
          onClick={() => setActiveService(mockActiveService)}
          className={`flex-1 py-2 px-3 rounded-full transition-all text-sm font-medium ${
            activeService ? 'bg-white text-brand shadow-sm' : 'text-gray-500'
          }`}
        >
          <MapPin className="h-4 w-4 inline-block mr-1.5 -mt-0.5" />
          Rastreo en Vivo
        </button>
        <button
          onClick={() => setActiveService(null)}
          className={`flex-1 py-2 px-3 rounded-full transition-all text-sm font-medium ${
            !activeService ? 'bg-white text-brand shadow-sm' : 'text-gray-500'
          }`}
        >
          <Star className="h-4 w-4 inline-block mr-1.5 -mt-0.5" />
          Calificaciones
        </button>
      </div>

      {/* Content */}
      {activeService ? renderTracking() : renderRatings()}

      {/* Rating Modal */}
      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-warning fill-warning" />
              Calificar Servicio
            </DialogTitle>
            <DialogDescription>
              Cuéntanos tu experiencia
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Star Rating */}
            <div className="text-center">
              <p className="text-sm font-medium mb-3">¿Cómo calificas el servicio?</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSelectedRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-10 w-10 ${
                        star <= selectedRating
                          ? 'text-warning fill-warning'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {selectedRating > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {selectedRating === 5 && '¡Excelente!'}
                  {selectedRating === 4 && 'Muy bueno'}
                  {selectedRating === 3 && 'Bueno'}
                  {selectedRating === 2 && 'Regular'}
                  {selectedRating === 1 && 'Necesita mejorar'}
                </p>
              )}
            </div>

            {/* Recommend */}
            <div>
              <p className="text-sm font-medium mb-2">¿Recomendarías este servicio?</p>
              <div className="flex gap-2">
                <Button
                  variant={wouldRecommend === true ? 'default' : 'outline'}
                  className={`flex-1 ${wouldRecommend === true ? 'bg-success hover:bg-success/90' : ''}`}
                  onClick={() => setWouldRecommend(true)}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Sí
                </Button>
                <Button
                  variant={wouldRecommend === false ? 'default' : 'outline'}
                  className={`flex-1 ${wouldRecommend === false ? 'bg-danger hover:bg-danger/90' : ''}`}
                  onClick={() => setWouldRecommend(false)}
                >
                  <ThumbsUp className="h-4 w-4 mr-2 rotate-180" />
                  No
                </Button>
              </div>
            </div>

            {/* Feedback */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Comentarios (opcional)
              </label>
              <Textarea
                placeholder="Cuéntanos más sobre tu experiencia..."
                value={ratingFeedback}
                onChange={(e) => setRatingFeedback(e.target.value)}
                rows={4}
              />
            </div>

            {/* Submit */}
            <Button
              onClick={submitRating}
              className="w-full rounded-full bg-brand hover:bg-brand/90"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar Calificación
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
