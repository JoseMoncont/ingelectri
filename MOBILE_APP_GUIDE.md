# 📱 Aplicación Móvil Ingelectri A&E - Guía Completa

## 🎯 Descripción General

Aplicación móvil complementaria al sistema web de gestión de mantenimiento, diseñada para **dos roles principales**:

1. **Empresas Socias (Clientes)** - Control total de su infraestructura de refrigeración
2. **Técnicos de Campo** - Registro digital de trabajos con evidencias multimedia

---

## 🔐 Sistema de Login

### Características:
- ✅ Selección de rol (Cliente / Técnico)
- ✅ Autenticación por correo y contraseña
- ✅ **Autenticación biométrica** (Huella / Face ID)
- ✅ Validación de credenciales
- ✅ Colores corporativos integrados

### Demo de Usuarios:
- **Cliente**: juan.martinez@empresa.com
- **Técnico**: carlos.ramirez@ingelectri.com

---

## 👔 MÓDULO PARA EMPRESAS SOCIAS (Clientes)

### 📊 1. Dashboard de Estado
**Vista principal con resumen ejecutivo:**

- **KPIs Visuales:**
  - 🟢 Equipos OK: 8 unidades operativas
  - 🟡 Requieren Atención: 2 equipos
  - 🔵 Mantenimientos Pendientes: 3 servicios
  
- **Acceso Rápido:**
  - Última factura generada
  - Reportes PDF descargables
  - Documentación técnica

### 🚨 2. Sistema de Solicitud de Servicio (Ticketera)

**Botón de Emergencia:**
- 🔴 Reporte de fallos críticos
- Prioridad alta automática
- Notificación inmediata al equipo técnico

**Agendamiento de Citas:**
- 📅 Calendario interactivo
- Fechas y horarios disponibles
- Selección de tipo de servicio
- 🎥 Adjuntar video/audio explicativo del fallo

### 📦 3. Gestión de Activos (Inventario)

**Lista de Equipos por Ubicación:**
- Vista organizada por sede/piso
- Información detallada de cada equipo

**Sistema de Semáforo Visual:**
- 🟢 **Verde**: Operativo (sin problemas)
- 🟡 **Amarillo**: Requiere atención (mantenimiento próximo)
- 🔴 **Rojo**: Fuera de servicio (crítico)

**Datos por Equipo:**
- Nombre y modelo
- Ubicación exacta
- Última fecha de mantenimiento
- Próxima fecha programada
- Acceso a hoja de vida completa

### 📜 4. Historial de Mantenimientos

**Características:**
- **Filtros avanzados:**
  - Por fecha
  - Por técnico asignado
  - Por equipo específico

**Visualización de Evidencias:**
- 📷 Fotos "Antes y Después" de cada intervención
- Reporte técnico completo
- Firma digital de conformidad
- Observaciones del técnico

### ✅ 5. Autorizaciones en Tiempo Real

**Flujo de Autorización:**
1. 🔔 Notificación push cuando técnico detecta daño
2. 📋 Detalle de la falla y repuesto requerido
3. 💰 Costo estimado de la reparación
4. ✍️ Botón "Autorizar Cambio" con firma digital
5. ⚡ Confirmación inmediata al técnico

**Ejemplo:**
```
⚠️ Autorización Requerida
Equipo: Cuarto Frío
Técnico: María González
Problema: Compresor con ruido anormal
Solución: Cambio de capacitor y válvula
Costo: $450,000 COP

[Autorizar] [Ver Detalles]
```

### 📈 6. Reportes de Indicadores (BI)

**Gráficas Disponibles:**
- Cumplimiento de mantenimientos preventivos
- Servicios contratados vs realizados
- Tiempo de respuesta promedio
- Tendencias de fallas por equipo
- Costos de mantenimiento mensuales

---

## 🔧 MÓDULO PARA TÉCNICOS (Campo)

### 🏠 1. Home - Dashboard Técnico

**Resumen Diario:**
- ✅ Servicios completados hoy: 5
- ⏳ Servicios pendientes: 3
- ⭐ Rating promedio: 4.8
- 🏆 Ranking: #3

**Métricas de Rendimiento:**
- Progreso del día (barra de progreso)
- Total de servicios semanales
- Calificaciones de clientes
- Puntos de gamificación

### 📅 2. Agenda del Día

**Lista de Servicios Asignados:**
```
08:00 AM - Empresa XYZ S.A.S
- Equipo: Chiller Industrial
- Tipo: Preventivo
- Ubicación: Calle 100 #15-20
- Duración: 2 horas
- [Check-in] [Navegar] [Iniciar]
```

**Integración con Mapas:**
- 🗺️ Google Maps / Waze
- Navegación directa al sitio
- Estimación de tiempo de llegada
- Optimización de rutas

**Check-in con Geolocalización:**
- 📍 Validación de presencia en el sitio
- Registro automático de hora de llegada
- Coordenadas GPS guardadas
- Confirmación visual

### 📱 3. Escáner de Activos (QR)

**Funcionalidad:**
- 🎯 Escaneo de código QR del equipo
- 📂 Apertura automática del historial
- 📋 Ficha técnica completa
- 🔍 Acceso a manuales del fabricante

**Generador de QR:**
- Para equipos nuevos sin código
- Impresión vía Bluetooth (impresora térmica)
- Etiquetas descargables
- Registro inmediato en sistema

### 📝 4. Formulario de Mantenimiento Digital (Smart Form)

**Secciones del Formulario:**

#### A) Información General:
- Tipo de Equipo (selección rápida)
- Cliente y ubicación
- Tipo de servicio (Preventivo/Correctivo)

#### B) Mediciones Eléctricas:
```
⚡ Lecturas Eléctricas:
- L1 (V): 220 ✅
- L2 (V): 218 ⚠️ (fuera de rango)
- L3 (V): 222 ✅
- Amperaje (A): 15.5
```

**Validación Inteligente:**
- 🟢 Verde: Valores dentro del rango
- 🟡 Naranja: Alerta (fuera de rango)
- 🔴 Rojo: Crítico (requiere atención inmediata)

#### C) Checklist de Trabajos:
- [ ] Limpieza de filtros
- [ ] Limpieza de serpentín
- [ ] Revisión de presiones
- [ ] Lubricación de motor
- [ ] Revisión eléctrica
- [ ] Limpieza general

#### D) Estado de Repuestos:
- Selección de piezas cambiadas
- Cantidad utilizada
- Solicitud de autorización si aplica
- Costo de repuestos

### 📷 5. Centro de Evidencia Multimedia

**Captura de Fotos:**
- 📸 Fotos "Antes" (obligatorias)
- 📸 Fotos "Durante" el proceso
- 📸 Fotos "Después" (obligatorias)
- Mínimo 3 fotos para cerrar servicio

**Anotaciones por Voz:**
- 🎤 Grabación de observaciones
- 🤖 Transcripción automática a texto
- ✏️ Edición manual posterior
- 💾 Guardado con marca de tiempo

**Multimedia Adicional:**
- 🎥 Videos cortos (máx 1 minuto)
- 📄 Adjuntar documentos PDF
- ✍️ Dibujos y anotaciones en pantalla

### 📶 6. Sincronización Offline

**Modo Sin Conexión:**
- 💾 Guardado local de reportes
- 📊 Captura de datos sin señal
- 🔄 Sincronización automática al recuperar conexión
- ⚠️ Indicador visual de estado

**Cola de Sincronización:**
```
📤 Pendientes de Subir:
- Servicio S001 - Chiller Industrial
- Servicio S002 - HVAC Central
- 12 fotos sin sincronizar
```

---

## 🚀 FUNCIONES INNOVADORAS

### 🤖 1. Predicción de Vida Útil (IA)

**Análisis Predictivo:**
- Monitoreo de corriente (L1, L2, L3)
- Historial de consumo eléctrico
- Tendencias de amperaje

**Indicador de Salud:**
```
🔋 Salud del Compresor: 78%

Análisis:
- Corriente L1 aumentó 8% en últimos 3 meses
- Amperaje dentro de rango normal
- Recomendación: Cambio preventivo en 2 meses
```

### 🥽 2. Realidad Aumentada para Soporte (Asistencia Remota)

**Videollamada con Soporte:**
- 📞 Conexión con ingeniero senior
- 🖊️ Dibujo sobre pantalla en tiempo real
- 📹 Compartir vista de cámara
- 🎯 Guía paso a paso para reparaciones complejas

**Casos de Uso:**
- Diagnóstico remoto de fallas
- Capacitación en campo
- Verificación de trabajos
- Consultas técnicas urgentes

### 📚 3. Chatbot Interno de Manuales

**Funcionalidad:**
```
👤 Técnico: "Manual de Chiller Carrier 30RB"

🤖 Bot: "Encontré el manual del Chiller Carrier 30RB.
       - Manual de Servicio (PDF - 45 páginas)
       - Códigos de Error (Lista completa)
       - Diagrama Eléctrico
       - Video de Mantenimiento

       ¿Qué necesitas consultar?"
```

**Base de Conocimiento:**
- Manuales de fabricantes
- Diagramas técnicos
- Códigos de error
- Procedimientos paso a paso
- Videos tutoriales

### 🏆 4. Gamificación para Técnicos

**Sistema de Puntos:**
- ⭐ Por servicio completado: +10 puntos
- 📷 Por evidencias completas: +5 puntos
- ⏰ Por puntualidad: +3 puntos
- 😊 Por calificación 5 estrellas: +15 puntos

**Ranking Mensual:**
```
🥇 #1 Ana Morales - 420 pts
🥈 #2 Pedro Sánchez - 380 pts
🥉 #3 Carlos Ramírez - 350 pts (TÚ)
```

**Incentivos Canjeables:**
- 🎁 Bonos de productividad
- 🏖️ Días libres adicionales
- 🎓 Cursos de capacitación
- 🛠️ Herramientas premium
- 🏆 Reconocimientos públicos

---

## 🎨 Diseño y UX

### Colores Corporativos:
- **Naranja Principal**: #F26522 (Ingelectri)
- **Gris Oscuro**: #2B3036 (Fondo sidebar)
- **Verde Éxito**: #28A745 (Confirmaciones)
- **Azul Cliente**: #3B82F6 (Módulo cliente)
- **Naranja Técnico**: #F26522 (Módulo técnico)

### Navegación:
- **Bottom Tab Bar** con 5 pestañas principales
- **Transiciones suaves** entre vistas
- **Gestos intuitivos** (swipe, pull-to-refresh)
- **Feedback visual** en todas las acciones

### Accesibilidad:
- ✅ Textos legibles (mínimo 14px)
- ✅ Contraste alto en elementos importantes
- ✅ Botones grandes (min 44x44px)
- ✅ Iconografía clara y consistente

---

## 🔒 Seguridad

### Autenticación:
- Tokens JWT con expiración
- Refresh tokens automáticos
- Biometría local (no envía huellas al servidor)
- Logout automático por inactividad

### Datos Sensibles:
- Encriptación de datos locales
- HTTPS obligatorio
- No almacenamiento de contraseñas
- Logs de auditoría

---

## 📊 Flujo de Usuario Completo

### Para Clientes:
```
1. Login → 2. Dashboard → 3. Ver Equipos →
4. Solicitar Servicio → 5. Autorizar Cambios →
6. Ver Historial → 7. Descargar Reportes
```

### Para Técnicos:
```
1. Login → 2. Ver Agenda → 3. Check-in →
4. Escanear QR → 5. Formulario Digital →
6. Capturar Fotos → 7. Firma Cliente →
8. Generar PDF → 9. Enviar por WhatsApp/Email
```

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React + TypeScript
- **UI Framework**: Tailwind CSS
- **Componentes**: shadcn/ui
- **Iconos**: Lucide React
- **Estado**: React Hooks (useState)
- **Responsive**: Mobile-first design

---

## 🚀 Cómo Acceder

1. En la aplicación web, navega al menú lateral
2. Click en **"App Móvil"** (icono de smartphone 📱)
3. Selecciona tu rol (Cliente o Técnico)
4. Inicia sesión con tus credenciales
5. ¡Listo para usar!

---

## 📞 Soporte

Para cualquier duda o problema técnico:
- 📧 Email: soporte@ingelectri.com
- 📱 WhatsApp: +57 300 123 4567
- 🌐 Web: www.ingelectri.com

---

**© 2026 Ingelectri A&E S.A.S. - Todos los derechos reservados**
