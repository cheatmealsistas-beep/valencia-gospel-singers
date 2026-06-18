/**
 * Central Project Configuration
 * Single source of truth for all project information
 * Used by: SEO, Home, Brand, Emails, etc.
 *
 * Run 'npm run project:setup' to configure interactively
 */

export interface ProjectConfig {
  business: {
    // Basic Info
    name: string;
    domain: string;
    type: 'b2b-saas' | 'b2c-saas' | 'marketplace' | 'dev-tool' | 'ai-product' | 'other';
    industry: string;

    // Core Messaging (used everywhere)
    tagline: string; // Short, punchy (3-5 words)
    elevator_pitch: string; // One sentence value prop

    // Features (for home, SEO, marketing)
    core_features: string[]; // 3-5 main features

    // Target Market
    target_personas: string[]; // e.g., ['startups', 'developers', 'agencies']
    ideal_customer: string; // e.g., "SaaS founders who want to ship fast"

    // Positioning
    main_competitor?: string; // For alternative pages
    unique_value: string; // What makes you different

    // Growth
    pricing_model: 'freemium' | 'trial' | 'paid-only' | 'usage-based';
    starting_price?: number; // For "Starting at $X"
  };

  // Auto-generated or override
  seo?: {
    keywords?: string[];
    defaultTitle?: string;
    defaultDescription?: string;
  };

  // Preferences
  preferences: {
    auto_translate: boolean; // Auto-generate Spanish from English
    content_tone: 'professional' | 'casual' | 'playful' | 'technical';
    cta_style: 'direct' | 'benefit-focused' | 'urgency';
  };
}

// Mediterránea Gospel Singers - Coro Gospel de Valencia
export const projectConfig: ProjectConfig = {
  business: {
    name: 'Mediterránea Gospel Singers',
    domain: 'mediterraneagospelsingers.com',
    type: 'other', // Service / Entertainment
    industry: 'music entertainment',

    tagline: 'La emoción del gospel',
    elevator_pitch: 'Somos un coro de gospel que lleva la alegría y la emoción a tu evento especial con pasión y profesionalidad.',

    core_features: [
      'Bodas con gospel en vivo',
      'Eventos corporativos',
      'Conciertos y actuaciones',
      'Celebraciones especiales',
      'Repertorio personalizado'
    ],

    target_personas: ['novios', 'organizadores de eventos', 'empresas', 'espacios culturales'],
    ideal_customer: 'Personas que quieren hacer de su evento un momento inolvidable con la energía y emoción del gospel',

    main_competitor: undefined,
    unique_value: 'Coro gospel profesional en Valencia que combina la tradición del gospel con pasión y cercanía',

    pricing_model: 'paid-only', // Custom quotes for events
    starting_price: undefined
  },

  preferences: {
    auto_translate: true,
    content_tone: 'casual', // Friendly and approachable
    cta_style: 'benefit-focused'
  }
};

/**
 * Helper to get project info from anywhere
 */
export function getProjectInfo() {
  return projectConfig.business;
}

/**
 * Helper to get SEO defaults
 */
export function getSEODefaults() {
  const { name, tagline, elevator_pitch } = projectConfig.business;
  return {
    titleTemplate: `%s | ${name}`,
    defaultTitle: `${name} - ${tagline}`,
    defaultDescription: elevator_pitch,
    keywords: projectConfig.seo?.keywords || []
  };
}
