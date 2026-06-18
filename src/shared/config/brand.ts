/**
 * Brand Configuration - Mediterránea Gospel Singers
 *
 * Centralizes all brand-related settings including SEO and GEO optimization.
 *
 * This is the single source of truth for:
 * - Brand identity (name, logo, colors)
 * - SEO metadata (titles, descriptions, Open Graph)
 * - GEO optimization (schemas, AI bot access)
 * - Social presence
 */

export const brand = {
  // ═══════════════════════════════════════════════════════════════════
  // APP IDENTITY
  // ═══════════════════════════════════════════════════════════════════

  /** Your product/company name */
  name: 'Mediterránea Gospel Singers',

  /** Short name for compact displays */
  shortName: 'VGS',

  /** Short tagline (appears in hero, metadata) */
  tagline: 'La banda sonora de tus momentos especiales',

  /** Full description for about/meta */
  description:
    'Coro de gospel en Valencia especializado en bodas, eventos corporativos y conciertos. Música que emociona y conecta.',

  // ═══════════════════════════════════════════════════════════════════
  // CONTACT & URLS
  // ═══════════════════════════════════════════════════════════════════

  /** Production website URL (used for canonical URLs, sitemap, schemas) */
  website: 'https://mediterraneagospelsingers.com',

  /** Contact email address */
  email: 'drgodoy@gmail.com',

  /** Support email (alias for email, for compatibility) */
  support: 'drgodoy@gmail.com',

  /** WhatsApp number (country code + number, no + or spaces) */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '34603493592',

  /** Get WhatsApp URL */
  getWhatsAppUrl: (message?: string) => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '34603493592';
    const baseUrl = `https://wa.me/${phone}`;
    return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
  },

  // ═══════════════════════════════════════════════════════════════════
  // ASSETS (place files in /public/)
  // ═══════════════════════════════════════════════════════════════════

  /** Logo for header/navigation (empty = use brand name text instead) */
  logo: '',

  /** Small icon for favicon context */
  icon: '/icon.png',

  /** Browser favicon */
  favicon: '/favicon.ico',

  // ═══════════════════════════════════════════════════════════════════
  // TYPOGRAPHY
  // ═══════════════════════════════════════════════════════════════════

  font: {
    family: 'Poppins',
    package: '@fontsource/poppins',
    weights: [400, 500, 600, 700, 800],
  },

  // ═══════════════════════════════════════════════════════════════════
  // UI THEME - Moderno y Vibrante
  // ═══════════════════════════════════════════════════════════════════

  theme: {
    /**
     * Theme Variant
     * 'gospel': Custom theme - púrpura vibrante + naranja energético
     */
    variant: 'gospel' as const,

    /** Enable glassmorphism effect (backdrop-blur, transparency) */
    glass: true,

    /** Custom colors for gospel theme */
    colors: {
      // Primary - Púrpura vibrante
      primary: '#7C3AED',
      primaryDark: '#5B21B6',
      primaryLight: '#A78BFA',

      // Secondary - Naranja energético
      secondary: '#F97316',
      secondaryDark: '#EA580C',
      secondaryLight: '#FB923C',

      // Accent - Dorado
      accent: '#FBBF24',
      accentDark: '#F59E0B',

      // Neutrals
      dark: '#1F2937',
      gray: '#6B7280',
      light: '#F9FAFB',
      white: '#FFFFFF',

      // States
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // SEO & GEO CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════

  seo: {
    /** Title template for pages. %s is replaced with page title */
    titleTemplate: '%s | Mediterránea Gospel Singers',

    /** Default title when no page title is set */
    defaultTitle: 'Mediterránea Gospel Singers - Coro Gospel para Bodas y Eventos en Valencia',

    /** Default meta description (max 160 characters recommended) */
    defaultDescription:
      'Coro de gospel profesional en Valencia. Servicios para bodas, eventos corporativos y conciertos. Música emotiva que transforma tus momentos especiales.',

    /** Keywords for meta tags */
    keywords: [
      'coro gospel valencia',
      'gospel para bodas',
      'coro para bodas valencia',
      'música gospel eventos',
      'conciertos gospel valencia',
      'coro profesional valencia',
      'música para bodas',
      'eventos corporativos música',
    ],

    /** Default Open Graph image (1200x630 recommended) */
    ogImage: '/og-image.jpg',

    /** Twitter/X handle for Twitter Cards (include @) */
    twitterHandle: '@vlosgospel',

    /** Site verification codes (leave empty if not using) */
    verification: {
      google: '',
      bing: '',
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // SOCIAL LINKS
  // ═══════════════════════════════════════════════════════════════════

  social: {
    /** Instagram profile URL */
    instagram: '',

    /** Facebook page URL */
    facebook: '',

    /** YouTube channel URL */
    youtube: '',

    /** Spotify artist URL */
    spotify: '',

    /** TikTok profile URL */
    tiktok: '',

    /** LinkedIn (not used, for compatibility) */
    linkedin: '',

    /** Telegram (not used, for compatibility) */
    telegram: '',

    /** Twitter/X (not used, for compatibility) */
    twitter: '',
  },

  // ═══════════════════════════════════════════════════════════════════
  // ORGANIZATION INFO (for Schema.org markup)
  // ═══════════════════════════════════════════════════════════════════

  organization: {
    /** Organization type for schema.org */
    type: 'PerformingGroup' as const,

    /** Year founded */
    foundingDate: '2020',

    /** Founder names (for schema) */
    founders: [] as string[],

    /** Physical address */
    address: {
      street: '',
      city: 'Valencia',
      state: 'Comunidad Valenciana',
      postalCode: '',
      country: 'España',
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // CRAWLER & AI BOT CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════

  crawlers: {
    /** Allow AI bots to crawl your site (recommended for GEO) */
    allowAIBots: true,

    /** Paths to disallow in robots.txt */
    disallowPaths: ['/admin/', '/auth/', '/api/'],

    /** Additional paths to allow (overrides disallow) */
    allowPaths: [] as string[],
  },

  // ═══════════════════════════════════════════════════════════════════
  // LEGAL PAGES
  // ═══════════════════════════════════════════════════════════════════

  legal: {
    terms: '/terminos',
    privacy: '/privacidad',
  },

  // ═══════════════════════════════════════════════════════════════════
  // AUTH PAGES CONFIGURATION (Admin Login)
  // ═══════════════════════════════════════════════════════════════════

  auth: {
    /** Show branding panel on desktop (split-screen layout) */
    showBrandingPanel: true,

    /** Gradient for branding panel background */
    gradient: 'from-[#7C3AED] via-[#5B21B6] to-[#1F2937]',

    /** Show animated background pattern */
    showPattern: true,

    /** Show testimonial in branding panel */
    showTestimonial: false,

    /** Testimonial content (if showTestimonial is true) */
    testimonial: {
      quote: '',
      author: '',
      role: '',
    },

    /** Features to highlight in branding panel */
    features: [
      'Gestiona eventos y conciertos',
      'Administra el contenido de la web',
      'Responde solicitudes de clientes',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // SERVICES (Types of events)
  // ═══════════════════════════════════════════════════════════════════

  services: {
    wedding: {
      key: 'boda',
      icon: 'heart',
    },
    corporate: {
      key: 'corporativo',
      icon: 'building',
    },
    private: {
      key: 'privado',
      icon: 'users',
    },
    concert: {
      key: 'concierto',
      icon: 'music',
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // VOICE TYPES (for choir members)
  // ═══════════════════════════════════════════════════════════════════

  voiceTypes: ['soprano', 'alto', 'tenor', 'bajo'] as const,

  // ═══════════════════════════════════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════════════════════════════════

  /** Copyright notice in footer */
  copyright: `© ${new Date().getFullYear()} Mediterránea Gospel Singers. Hecho con amor en Valencia.`,
};

export type Brand = typeof brand;
export type VoiceType = (typeof brand.voiceTypes)[number];
