# Mediterránea Gospel Singers - Claude Code Context

## Sobre el Proyecto

**Mediterránea Gospel Singers** es la web oficial de un coro de gospel valenciano que ofrece servicios musicales para eventos, bodas, celebraciones corporativas y conciertos propios.

### Propuesta de Valor
- Coro profesional de gospel en Valencia
- Servicios para bodas, eventos corporativos, fiestas privadas
- Conciertos y actuaciones propias
- Experiencia musical emotiva y vibrante

### Audiencia
- Parejas que buscan coro para su boda
- Empresas organizando eventos corporativos
- Público general interesado en conciertos de gospel
- Turistas internacionales en Valencia (EN/ES)

---

## Identidad Visual y Branding

### Estilo: Moderno y Vibrante

**Paleta de Colores**:
```css
/* Colores principales */
--gospel-purple: #7C3AED;      /* Púrpura vibrante - principal */
--gospel-purple-dark: #5B21B6; /* Púrpura oscuro - hover/accent */
--gospel-orange: #F97316;      /* Naranja energético - CTAs secundarios */
--gospel-gold: #FBBF24;        /* Dorado - acentos, iconos */

/* Neutros */
--gospel-dark: #1F2937;        /* Textos principales */
--gospel-gray: #6B7280;        /* Textos secundarios */
--gospel-light: #F9FAFB;       /* Fondos claros */
--gospel-white: #FFFFFF;       /* Fondos puros */

/* Estados */
--gospel-success: #10B981;     /* Confirmaciones */
--gospel-error: #EF4444;       /* Errores */
```

**Tipografía**:
- Headlines: Font bold/extrabold, tracking tight
- Body: Font regular, buena legibilidad
- Accent: Puede usarse una display font para títulos hero

**Estética general**:
- Energía y movimiento (animaciones sutiles)
- Fotos del grupo en acción (conciertos, bodas)
- Gradientes púrpura-rosa para fondos hero y acentos
- Iconografía relacionada con música (notas, micrófonos, ondas de sonido)
- Sensación de comunidad y alegría
- **Elemento visual distintivo**: Vinilo con centro esférico púrpura-rosa (usado en logo, favicon, y decoración en home/nosotros)

### Logo y Favicon

**Logo**: Disco de vinilo minimalista con:
- Borde fino con glow púrpura-rosa
- Centro esférico 3D con gradiente púrpura→rosa
- Surcos sutiles en el disco
- Texto "Mediterránea Gospel Singers" en arco (estilo handwriting)

**Archivos**:
- `/public/logo.svg` - Logo completo
- `/src/app/icon.svg` - Favicon (Next.js lo usa automáticamente)

**Uso del vinilo en la web**:
- Home: Avatares del equipo en formato vinilo con hover púrpura
- Nosotros: Misma estética de vinilo para fotos del equipo
- El efecto hover añade tinte púrpura con `mix-blend-color`

### Tono de Comunicación

**Voz de marca**:
- Cercano pero profesional
- Entusiasta sin ser exagerado
- Emotivo (la música gospel es emoción)
- Inclusivo (todos son bienvenidos)

**Ejemplos de copy**:
```
❌ "Servicios de coro gospel"
✅ "Ponemos la banda sonora a tus momentos más especiales"

❌ "Contactar"
✅ "Hablemos de tu evento"

❌ "Ver eventos"
✅ "Descubre dónde cantamos"
```

---

## Estructura de la Web

### Secciones Públicas

| Ruta | Propósito | Estado |
|------|-----------|--------|
| `/` | Home - Hero + servicios destacados + próximos eventos | ✅ |
| `/servicios` | Catálogo de servicios (bodas, eventos, corporativos) | 🚧 |
| `/eventos` | Calendario de conciertos y actuaciones | ✅ |
| `/sobre-nosotros` | Historia del coro, valores, trayectoria | ✅ |
| `/galeria` | Galería de fotos con filtros y lightbox | ✅ |
| `/blog` | Noticias, artículos sobre gospel | Por crear |
| `/colabora` | Para nuevos miembros o patrocinadores | ✅ |
| `/contacto` | Formulario de contacto para contrataciones | ✅ |

### Panel de Administración

| Ruta | Propósito | Estado |
|------|-----------|--------|
| `/admin` | Dashboard con métricas y accesos rápidos | ✅ |
| `/admin/eventos` | CRUD de eventos y conciertos | ✅ |
| `/admin/galeria` | Gestión de fotos con categorías | ✅ |
| `/admin/equipo` | Gestión de integrantes del coro | ✅ |
| `/admin/mensajes` | Mensajes de contacto recibidos | ✅ |
| `/admin/collaborators` | Gestión de clientes (sponsors/hosters) | ✅ |
| `/admin/contenido` | CMS: editar textos, imágenes | Por crear |
| `/admin/blog` | Gestión de artículos | Por crear |
| `/admin/suscriptores` | Lista de suscriptores | Por crear |
| `/admin/configuracion` | Info-bar, redes sociales | Por crear |

---

## Features del Proyecto

### Features Core

| Feature | Descripción | Estado |
|---------|-------------|--------|
| `home` | Landing page con hero, servicios, próximos eventos | ✅ Implementado |
| `services` | Páginas de servicios (bodas, eventos, corporativos) | 🚧 Parcial |
| `events` | Gestión y visualización de eventos/conciertos | ✅ Implementado |
| `members` | Gestión de integrantes del coro (admin only) | ✅ Implementado (como "equipo") |
| `contact` | Formulario de contacto/contratación | ✅ Implementado |
| `gallery` | Galería de fotos con admin y página pública | ✅ Implementado |
| `collaborators` | Gestión de clientes (sponsors/hosters) | ✅ Implementado (renombrado a "Clientes") |
| `about` | Sobre nosotros | ✅ Implementado |
| `collaborate` | Página para nuevos miembros y patrocinadores | ✅ Implementado |
| `blog` | Sistema de noticias/artículos | Por crear |
| `cms` | Contenido editable desde admin | 🚧 Parcial (via copies) |
| `subscribers` | Lista de suscriptores para notificaciones | Por crear |
| `emails` | Sistema de emails con Resend | 🚧 Parcial |

### Features Heredadas (del boilerplate)

| Feature | Descripción | Estado |
|---------|-------------|--------|
| `auth` | Login para admin (solo email/password) | Adaptar |
| `admin` | Panel de administración completo (CMS + CRUD + emails) | Adaptar |

### Features a Eliminar

| Feature | Razón |
|---------|-------|
| `billing` | No hay suscripciones/pagos online |
| `dashboard` | Reemplazado por admin específico |
| `my-account` | No hay cuentas de usuario público |
| `organizations` | No aplica |
| `affiliates` | No aplica |

---

## Modelo de Datos

### Tabla: `members` (Integrantes)

```sql
CREATE TABLE members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  photo_url TEXT,
  voice_type TEXT NOT NULL CHECK (
    voice_type IN ('soprano', 'alto', 'tenor', 'bajo')
  ),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Campos**:
- `name`: Nombre del integrante
- `photo_url`: URL de foto (opcional, Supabase Storage)
- `voice_type`: Tipo de voz (soprano, alto, tenor, bajo)
- `is_active`: Si está activo en el coro
- `sort_order`: Para ordenar en la web

### Tabla: `events` (Eventos)

```sql
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  image_url TEXT,
  is_free BOOLEAN DEFAULT true,
  ticket_url TEXT,                    -- URL externa o WhatsApp
  ticket_price DECIMAL(10,2),
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,  -- Para mostrar en home
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Campos**:
- `title`: Nombre del evento
- `description`: Descripción del evento
- `event_date`: Fecha y hora
- `location`: Nombre del lugar (ej: "Palau de la Música")
- `address`: Dirección completa
- `image_url`: Imagen del evento
- `is_free`: Si es gratuito
- `ticket_url`: Enlace externo para compra de entradas o WhatsApp
- `ticket_price`: Precio (si aplica)
- `is_published`: Si se muestra públicamente
- `is_featured`: Si aparece destacado en home

### Tabla: `contact_requests` (Solicitudes de Contacto)

```sql
CREATE TABLE contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  event_type TEXT NOT NULL CHECK (
    event_type IN ('boda', 'corporativo', 'privado', 'otro')
  ),
  event_date DATE,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'contacted', 'confirmed', 'rejected')
  ),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Campos**:
- `name`, `email`, `phone`: Datos de contacto
- `event_type`: Tipo de evento (boda, corporativo, privado, otro)
- `event_date`: Fecha aproximada del evento
- `message`: Descripción de lo que necesitan
- `status`: Estado de la solicitud
- `admin_notes`: Notas internas del admin

### Tabla: `gallery_images` (Galería)

```sql
CREATE TABLE gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT,
  category TEXT NOT NULL DEFAULT 'otros' CHECK (
    category IN ('conciertos', 'bodas', 'eventos', 'ensayos', 'otros')
  ),
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Campos**:
- `title`, `description`: Info opcional de la imagen
- `image_url`: URL de la imagen (Supabase Storage)
- `thumbnail_url`: Miniatura (opcional)
- `alt_text`: Texto alternativo para accesibilidad
- `category`: Categoría (conciertos, bodas, eventos, ensayos, otros)
- `event_id`: Relación opcional con un evento
- `display_order`: Orden de visualización
- `is_featured`: Si aparece destacada
- `is_active`: Si está visible públicamente

### Tabla: `blog_posts` (Blog)

```sql
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Tabla: `cms_content` (Contenido Editable)

```sql
CREATE TABLE cms_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,           -- Ej: 'home.hero.title', 'about.history'
  section TEXT NOT NULL,              -- Ej: 'home', 'about', 'services'
  content_type TEXT NOT NULL CHECK (
    content_type IN ('text', 'rich_text', 'image', 'video', 'testimonial', 'list')
  ),
  value_es TEXT,                      -- Contenido en español
  value_en TEXT,                      -- Contenido en inglés
  metadata JSONB,                     -- Datos extra (alt text, link, autor testimonial, etc.)
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Ejemplos de keys**:
- `home.hero.title` - Título principal del hero
- `home.hero.subtitle` - Subtítulo del hero
- `home.hero.cta` - Texto del botón CTA
- `home.testimonials.1` - Primer testimonial (metadata: {author, role, image})
- `services.wedding.title` - Título sección bodas
- `about.history` - Texto de historia (rich_text)

### Tabla: `subscribers` (Suscriptores)

```sql
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);
```

### Tabla: `email_logs` (Historial de Emails)

```sql
CREATE TABLE email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_type TEXT NOT NULL CHECK (
    email_type IN ('contact_confirmation', 'contact_notification', 'event_announcement')
  ),
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'sent' CHECK (
    status IN ('sent', 'failed', 'bounced')
  ),
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  contact_request_id UUID REFERENCES contact_requests(id) ON DELETE SET NULL,
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT now()
);
```

### Tabla: `app_settings` (Configuración Global)

```sql
CREATE TABLE app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN ('info_bar', 'general', 'email', 'social')
  ),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Settings disponibles**:
- `info_bar`: { enabled, message_es, message_en, type: 'info'|'warning', link_url, link_text }
- `contact_email`: Email del admin para notificaciones
- `social_links`: { instagram, facebook, youtube, spotify }

---

## Sistema de Emails (Resend)

### Emails Automáticos

| Trigger | Email | Destinatario |
|---------|-------|--------------|
| Nueva solicitud de contacto | Confirmación de recepción | Usuario que envió formulario |
| Nueva solicitud de contacto | Notificación de nueva solicitud | Admin (ADMIN_EMAIL) |
| Evento publicado | Anuncio de nuevo evento | Lista de suscriptores |

### Plantillas de Email

**1. Confirmación al usuario** (`contact_confirmation`):
```
Asunto: ¡Hemos recibido tu mensaje! - Mediterránea Gospel Singers

Hola {nombre},

Gracias por contactar con Mediterránea Gospel Singers. Hemos recibido tu
solicitud para {tipo_evento} y te responderemos lo antes posible.

Si tienes alguna pregunta urgente, puedes contactarnos por WhatsApp: {whatsapp}

¡Nos encantará ser parte de tu evento!

Mediterránea Gospel Singers
```

**2. Notificación al admin** (`contact_notification`):
```
Asunto: Nueva solicitud de contacto - {tipo_evento}

Nueva solicitud recibida:

Nombre: {nombre}
Email: {email}
Teléfono: {telefono}
Tipo de evento: {tipo_evento}
Fecha aproximada: {fecha}

Mensaje:
{mensaje}

---
Gestionar en: {admin_url}/solicitudes
```

**3. Anuncio de evento** (`event_announcement`):
```
Asunto: ¡Nuevo concierto! {titulo} - Mediterránea Gospel Singers

¡Hola!

Tenemos un nuevo evento que no te puedes perder:

{titulo}
📅 {fecha}
📍 {lugar}

{descripcion}

{cta_button: "Consigue tu entrada" → ticket_url}

¡Te esperamos!

Mediterránea Gospel Singers

---
[Darse de baja de estos emails]
```

### Flujo de Envío

```
Usuario envía formulario
        ↓
    Server Action
        ↓
┌───────┴───────┐
↓               ↓
Guardar en BD   Enviar emails (Resend)
                ├→ Confirmación al usuario
                └→ Notificación al admin
        ↓
  Registrar en email_logs
```

---

## Flujos Principales

### 1. Usuario quiere contratar al coro

```
Home → Servicios → Selecciona tipo → Contacto (formulario)
                                   ↓
                        Admin recibe notificación
                                   ↓
                        Admin gestiona solicitud
```

### 2. Usuario quiere asistir a concierto

```
Home (próximos eventos) → Eventos → Detalle evento → CTA "Consigue tu entrada"
                                                           ↓
                                              Link externo o WhatsApp
```

### 3. Admin gestiona evento

```
Admin → Eventos → Crear/Editar evento → Publicar
                                           ↓
                              Aparece en web pública
```

### 4. Alguien quiere unirse al coro

```
Colabora → Info sobre unirse → Formulario de contacto (event_type: 'otro')
```

---

## Meta-instrucciones (Eficiencia)

**Criterio experto**:
- No te dejes guiar ciegamente - usa tu juicio técnico
- Cuestiona si algo no tiene sentido o perjudica al producto
- Propón alternativas mejores cuando las veas
- Prioriza: eficiencia del desarrollo > usuario final > petición literal
- Sé honesto sobre trade-offs y consecuencias

**CRÍTICO - Antes de cada tarea**:
- Lee el CLAUDE.md de las features afectadas para tener contexto específico
- Identifica qué patrones aplican
- Revisa si hay deuda técnica relacionada que debas considerar

**Durante la ejecución**:
- Si detectas deuda técnica → Documéntala en el CLAUDE.md de la feature
- Si tomas decisiones arquitectónicas → Añádelas a "Decisiones de Arquitectura"

**Después de cada tarea**:
- Actualiza el CLAUDE.md de la feature si hay nuevo contexto relevante
- Verifica que los casos de testing están actualizados
- Ejecuta tests si es posible

**Periódicamente** (`/audit`):
- Revisa si esta configuración de Claude Code sigue siendo óptima
- Propón mejoras a commands/skills si detectas tareas repetitivas
- Actualiza este CLAUDE.md si hay patrones nuevos no documentados

**Antes de compact/fin de sesión** (`/pre-compact`):
- Evalúa si hay aprendizajes de esta sesión que mejorarían la documentación
- Patrones nuevos → Este CLAUDE.md
- Decisiones/deuda/contexto de features → CLAUDE.md de la feature
- Errores comunes → Troubleshooting en feature correspondiente

**Recursos adicionales**:
- Los README.md en directorios contienen documentación de uso - consúltalos si necesitas contexto de setup, convenciones, o uso de librerías

---

## Principios de Desarrollo

**Simplicidad y seguridad**:
- Busca siempre la solución más simple que funcione
- Menos código = menos bugs = más mantenible
- Evita abstracciones prematuras

**No romper lo previo**:
- Añadir código nuevo antes que modificar existente
- Si hay que modificar, asegurar backwards compatibility
- Tests deben seguir pasando

**Extensible sin editar** (Open/Closed):
- Diseña para que se pueda extender sin modificar código existente
- Usa composición sobre herencia
- Nuevas features = nuevos archivos, no editar los actuales

**YAGNI** (You Ain't Gonna Need It):
- No implementes funcionalidad "por si acaso"
- Implementa lo que se necesita ahora
- Es más fácil añadir después que eliminar

**Velocidad de iteración**:
- Minimizar pasos para probar cambios localmente
- Todo debe ser testeable sin deploy (Supabase local)
- Despliegues rápidos y sin fricción
- Si requiere muchos pasos manuales, automatizarlo

---

## Principios UX/UI

**Prioridad absoluta**:
1. Carga < 200ms
2. Clicks tienden a cero
3. Conversiones (contrataciones + asistencia a eventos)
4. Perfección visual

**"Un mono debe poder hacerlo"**:
- Auto-explicativo sin instrucciones
- Mínimos clicks posibles (cada click extra = fricción)
- Sin decisiones complejas para el usuario
- Acciones obvias y visibles

**Velocidad real (no trucos)**:
- Todo debe ser rápido por diseño, no por caché
- Optimistic UI siempre (mostrar resultado, revertir si error)
- Prefetch en hover/focus
- NO skeleton loaders si añaden delay - transición instantánea
- Evitar spinners - si algo tarda, el diseño está mal

**Mobile WOW**:
- Desktop importante, pero mobile debe ser experiencia WOW
- Cada interacción/flow debe generar efecto WOW
- Touch targets generosos
- Gestos naturales donde aplique

**Storytelling > Features**:
- Guiar al usuario con narrativa emocional
- Beneficios antes que funcionalidades
- CTAs orientados a resultado, no acción
- La música gospel es emoción - transmitirlo

**Maximizar conversiones**:
- Un CTA principal por pantalla
- Reducir campos en formularios al mínimo
- Social proof donde sea relevante (testimonios, fotos)
- Urgencia en eventos próximos

**Lo que NO hacer**:
- Animaciones complejas sin propósito
- Modales innecesarios
- Confirmaciones excesivas
- Tooltips como muleta de mal diseño
- Auto-reproducción de audio/vídeo

**Checklist antes de entregar UI**:
- [ ] ¿Puede completarse en menos clicks?
- [ ] ¿Está claro qué hacer sin leer?
- [ ] ¿Hay feedback inmediato en cada acción?
- [ ] ¿Los estados de error son útiles?
- [ ] ¿Funciona en mobile?
- [ ] ¿Transmite la energía del gospel?

---

## Brand Voice & UX Writing

**REGLA CRÍTICA**: NUNCA hardcodear textos. TODO debe venir de copies.

### Sistema de Traducciones: Meta-copies + Route-Level Copies

**Arquitectura en Dos Capas**:

1. **Meta-copies** (Prompts para LLM) → En `features/X/meta-copies/`
2. **Copies finales** (Textos reales) → En `app/[locale]/[ruta]/copies/`

**Idiomas**: Español (es) + Inglés (en)

### Principios de Copy para Mediterránea Gospel Singers

**Beneficio > Función**:
```json
// ❌ MAL
"cta": "Contactar"

// ✅ BIEN
"cta": "Hablemos de tu evento"
```

**Emocional y cercano**:
```json
// ❌ MAL
"hero.subtitle": "Coro de gospel profesional"

// ✅ BIEN
"hero.subtitle": "La música que hace latir tu corazón"
```

**Orientado a la acción**:
```json
// ❌ MAL
"events.empty": "No hay eventos"

// ✅ BIEN
"events.empty": "Estamos preparando nuevas sorpresas. ¡Vuelve pronto!"
```

### Ejemplos de Copy por Sección

| Sección | ❌ Malo | ✅ Bueno |
|---------|---------|----------|
| Hero CTA | "Ver servicios" | "Descubre lo que podemos hacer por ti" |
| Servicios bodas | "Coro para bodas" | "Haz de tu boda un momento inolvidable" |
| Eventos vacío | "No hay eventos" | "Pronto anunciaremos nuevas fechas" |
| Contacto submit | "Enviar" | "Cuéntanos tu idea" |
| Sobre nosotros | "Historia" | "Nuestra historia, nuestra pasión" |

---

## Accesibilidad (A11y)

### Requisitos Obligatorios

**Semántica HTML**:
- Un solo `<h1>` por página
- Jerarquía lógica: h1 → h2 → h3 (sin saltos)
- Landmarks: `<main>`, `<nav>`, `<aside>`, `<footer>`
- Listas para grupos de items relacionados

**Formularios Accesibles**:
```typescript
// SIEMPRE incluir estos atributos
<div>
  <Label htmlFor="email">{t('form.email.label')}</Label>
  <Input
    id="email"
    name="email"
    type="email"
    aria-describedby="email-help email-error"
    aria-invalid={!!error}
    aria-required="true"
  />
  {error && (
    <p id="email-error" role="alert" className="text-sm text-destructive">
      {error}
    </p>
  )}
</div>
```

**Navegación por Teclado**:
- Todo interactivo debe ser focusable (Tab)
- Orden de tab lógico
- Focus visible claro
- Escape cierra modals/dropdowns
- Enter/Space activan buttons

**Preferencias del Usuario**:
```css
/* OBLIGATORIO en animaciones */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Quick Start

### Comandos de Desarrollo

```bash
npm run dev          # Development server
npm run build        # Production build
npm run type-check   # TypeScript
npm run lint         # ESLint
npm run test         # Vitest
```

### Claude Code Commands
- `/new-feature [name]` - Crear feature completa
- `/add-page [name]` - Crear página con SEO completo
- `/add-action [name]` - Añadir Server Action
- `/fix-types` - Corregir errores TypeScript
- `/add-translation [keys]` - Añadir traducciones
- `/review-feature [name]` - Revisar feature
- `/audit` - Auto-auditoría completa
- `/security-audit` - Auditoría de seguridad

---

## Arquitectura: VSA + CQRS

### Estructura Principal

```
src/
├── features/       # Features (VSA + CQRS)
├── shared/         # Utilidades compartidas
├── app/            # Next.js routing
├── i18n/           # Configuración i18n
└── test/           # Test utilities
```

### Estructura de Feature
```
/src/features/[name]/
├── CLAUDE.md             # Contexto específico de la feature
├── components/           # UI específica
├── types/index.ts        # Zod schemas + TS types
├── [name].query.ts       # SELECT operations
├── [name].command.ts     # INSERT/UPDATE/DELETE
├── [name].handler.ts     # Business logic + validation
└── [name].actions.ts     # Server Actions (entry points)
```

### Reglas de Imports
```typescript
// ✅ CORRECTO
import { Button } from '@/shared/components/ui';
import { getUser } from '@/shared/auth';
import { createClientServer } from '@/shared/database/supabase';
import { EventCard } from '@/features/events';

// ❌ NUNCA - imports cross-feature
import { something } from '@/features/other-feature';
```

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router, RSC) |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (solo admin, email/password) |
| UI | shadcn/ui + Tailwind + Radix + Magic UI |
| Forms | React Hook Form + Zod |
| i18n | next-intl (en/es) |
| Media | Supabase Storage (fotos, vídeos) |

### MCP Tools Disponibles

- **Magic UI** (`mcp__magicui__*`): Componentes animados - textos, efectos, decorativos
- **Context7** (`mcp__context7__*`): Documentación actualizada de librerías

---

## Patrones de Código

### Server Action
```typescript
'use server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/shared/auth';
import { handleCreateEvent } from './events.handler';

export async function createEventAction(prevState: any, formData: FormData) {
  await requireAdmin();

  const input = {
    title: formData.get('title') as string,
    event_date: formData.get('event_date') as string,
    location: formData.get('location') as string,
  };

  const result = await handleCreateEvent(input);

  if (result.success) revalidatePath('/eventos');
  return result;
}
```

### Handler con Validación
```typescript
import { eventSchema, EventInput } from './types';
import { createEvent } from './events.command';

export async function handleCreateEvent(input: EventInput) {
  const validation = eventSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message
    };
  }
  return createEvent(validation.data);
}
```

### Query Pública (sin auth)
```typescript
import { createClientServer } from '@/shared/database/supabase';

export async function getPublishedEvents() {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true });

  return { data, error: error?.message || null };
}
```

---

## Convenciones de Nombres

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Schemas | camelCase + Schema | `eventSchema` |
| Types | PascalCase | `EventInput`, `Event` |
| Actions | verb + X + Action | `createEventAction` |
| Handlers | handle + Verb + X | `handleCreateEvent` |
| Queries | get/list + X | `getEvent`, `listEvents` |
| Commands | verb + X | `createEvent`, `updateEvent` |

---

## Estructura de Directorios (Objetivo)

```
/src
├── features/
│   ├── auth/               # Login admin
│   ├── admin/              # Panel de administración
│   ├── home/               # Landing page
│   ├── services/           # Servicios (bodas, eventos, etc.)
│   ├── events/             # Eventos y conciertos
│   ├── members/            # Gestión de integrantes
│   ├── contact/            # Formulario de contacto
│   ├── gallery/            # Galería multimedia
│   ├── blog/               # Noticias y artículos
│   ├── about/              # Sobre nosotros
│   └── collaborate/        # Colabora con nosotros
├── shared/
│   ├── auth/               # getUser, requireAdmin
│   ├── components/ui/      # shadcn/ui
│   ├── config/             # brand.ts
│   ├── database/supabase/  # Supabase clients
│   └── types/              # Tipos compartidos
├── app/
│   ├── [locale]/
│   │   ├── (public)/       # Rutas públicas (home, eventos, servicios...)
│   │   ├── (auth)/         # Login admin
│   │   └── (admin)/        # Panel de administración
│   └── api/                # API routes (si necesario)
├── i18n/
└── test/
```

---

## Variables de Entorno

### Requeridas
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

### Opcionales
```bash
# Admin emails (whitelist)
ADMIN_EMAILS=director@mediterraneagospelsingers.com

# Email (para notificaciones y anuncios)
RESEND_API_KEY=
RESEND_FROM_EMAIL=hola@mediterraneagospelsingers.com

# WhatsApp (para CTAs de eventos)
NEXT_PUBLIC_WHATSAPP_NUMBER=+34600000000
```

---

## Panel de Administración

### Acceso
- Solo usuarios con email en `ADMIN_EMAILS`
- Login simple email/password
- No hay registro público

### Funcionalidades

**Dashboard** (`/admin`) - ✅ Implementado:
- Estadísticas: eventos totales, próximos eventos, miembros del equipo, mensajes sin leer
- Lista de próximos eventos
- Accesos rápidos a las secciones

**Contenido / CMS** (`/admin/contenido`) - Por crear:
- Editor visual para textos de la web
- Gestión de testimonios
- Subida de imágenes

**Equipo** (`/admin/equipo`) - ✅ Implementado:
- Lista de integrantes del coro en grid de cards
- CRUD completo con formulario modal
- Foto de perfil (URL externa)
- Rol/cargo en el coro
- Toggle activar/desactivar visibilidad
- Ordenamiento por display_order

**Eventos** (`/admin/eventos`) - ✅ Implementado:
- Lista de eventos con estado (published/draft)
- Crear evento con formulario completo
- Editar eventos existentes
- Campos: título, slug, descripción, fecha, ubicación, imagen, etc.
- Soporte para speakers y sponsors por evento
- Publicar/despublicar eventos
- Marcar como destacado (featured)

**Mensajes** (`/admin/mensajes`) - ✅ Implementado:
- Lista de mensajes de contacto recibidos
- Vista detalle con toda la información
- Estados: pending, read, replied, archived
- Marcar como leído/respondido

**Galería** (`/admin/galeria`) - ✅ Implementado:
- CRUD completo de imágenes con formulario modal
- Categorías: conciertos, bodas, eventos, ensayos, otros
- Filtros por categoría en vista pública
- Asociar imágenes a eventos existentes
- Toggle activar/desactivar visibilidad
- Toggle destacado para mostrar en home
- Lightbox en página pública con navegación
- Ordenamiento por display_order

**Clientes** (`/admin/collaborators`) - ✅ Implementado:
- Lista de clientes (sponsors/hosters) en grid
- CRUD completo con formulario modal
- Logo, nombre, descripción, website
- Tipo: sponsor o hoster
- Toggle activar/desactivar visibilidad
- Ordenamiento por display_order

**Blog** (`/admin/blog`) - Por crear:
- Lista de artículos (borradores y publicados)
- Editor de contenido enriquecido (rich text)
- Subir imagen de portada
- SEO: editar slug, excerpt

**Suscriptores** (`/admin/suscriptores`) - Por crear:
- Lista de suscriptores activos
- Exportar lista (CSV)
- Dar de baja manualmente

**Configuración** (`/admin/configuracion`) - Por crear:
- Info-bar: Activar/desactivar, mensaje ES/EN
- Redes sociales: Links a Instagram, Facebook, YouTube
- Email de contacto

### Estructura de Rutas Admin (Implementada)

```
/admin
├── page.tsx                    # Dashboard (✅)
├── eventos/
│   ├── page.tsx               # Lista de eventos (✅)
│   └── nuevo/page.tsx         # Crear evento (✅)
├── galeria/
│   └── page.tsx               # Grid con CRUD inline (✅)
├── equipo/
│   └── page.tsx               # Lista con CRUD inline (✅)
├── mensajes/
│   └── page.tsx               # Mensajes de contacto (✅)
├── collaborators/
│   └── page.tsx               # Gestión de clientes (✅)
├── contenido/                  # Por crear
├── blog/                       # Por crear
├── suscriptores/              # Por crear
└── configuracion/             # Por crear
```

---

## Checklist Pre-Entrega

### Funcionalidad
- [ ] ¿Funciona el happy path completo?
- [ ] ¿Los errores muestran mensajes útiles?
- [ ] ¿Hay validación client-side y server-side?

### UX/UI
- [ ] ¿Puede completarse en menos clicks?
- [ ] ¿Está claro qué hacer sin leer instrucciones?
- [ ] ¿Hay feedback inmediato en cada acción?
- [ ] ¿Funciona en mobile?
- [ ] ¿Transmite la energía del gospel?

### i18n & Copy
- [ ] ¿TODOS los textos están en `copies/` co-localizadas?
- [ ] ¿Copy orientado a beneficio/emoción?
- [ ] ¿Existe versión EN y ES?

### Accesibilidad
- [ ] ¿Labels asociados a inputs?
- [ ] ¿Errores tienen role="alert"?
- [ ] ¿Navegable solo con teclado?
- [ ] ¿Focus visible en elementos interactivos?

### Performance
- [ ] ¿Carga inicial < 200ms?
- [ ] ¿Imágenes optimizadas (Next Image)?
- [ ] ¿Vídeos lazy loaded?

---

## Comandos Útiles

```bash
# Generar nueva feature
npm run generate:slice

# Aplicar migraciones
npx supabase db push

# Generar tipos TypeScript desde Supabase
npm run gen:types

# Añadir componente shadcn
npx shadcn@latest add [componente]

# Type check
npm run type-check
```

---

## Decisiones de Arquitectura

### Por qué no hay pagos online
- El coro prefiere gestionar pagos offline
- Los eventos usan links externos (Eventbrite, etc.) o WhatsApp
- Simplifica enormemente el sistema

### Por qué solo admin login
- Los usuarios públicos no necesitan cuenta
- Solo el director/encargados necesitan acceso al panel
- Reduce complejidad y superficie de ataque

### Por qué formulario web vs solo WhatsApp
- El formulario permite recoger información estructurada
- Se puede hacer seguimiento en el panel
- WhatsApp se usa como complemento para contacto rápido

### Qué se elimina del admin del boilerplate
El boilerplate venía con funcionalidades SaaS que no aplican:
- **Stats de suscripciones/MRR/trials**: No hay pagos → Eliminar
- **Email Journeys automáticos**: Reemplazado por emails puntuales (contacto + anuncios)
- **Cross-sell panel**: No hay productos adicionales → Eliminar
- **Gestión de usuarios/roles**: Solo 1-2 admins fijos, no necesita UI compleja

### Qué se mantiene y adapta
- **Info-bar**: Se mantiene, útil para anunciar conciertos
- **Sistema de roles**: Simplificado a verificar `ADMIN_EMAILS`
- **app_settings**: Se usa para info-bar, redes sociales, config general
