import React from 'react';

// Provider Icon Komponente - Hier kannst du die Icons leicht austauschen
// Jedes Icon ist als SVG definiert, du kannst sie durch eigene ersetzen

interface IconProps {
  className?: string;
  size?: number;
}

// OpenRouter Icon
export const OpenRouterIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className}
    fill="currentColor"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);

// Groq Icon (Lightning bolt - represents speed)
export const GroqIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className}
    fill="currentColor"
  >
    <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
  </svg>
);

// NVIDIA Icon
export const NvidiaIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className}
    fill="currentColor"
  >
    <path d="M8.948 8.798v-1.43a6.7 6.7 0 0 1 .424-.018c3.922-.124 6.493 3.374 6.493 3.374s-2.774 3.851-5.75 3.851c-.453 0-.883-.063-1.167-.149V9.94c1.195.119 1.461.569 2.207 1.608l1.64-1.377s-1.474-1.555-3.847-1.555v.182zm0-4.908v2.253l.424-.024c5.45-.18 9.027 4.54 9.027 4.54s-4.163 5.143-8.348 5.143c-.386 0-.751-.035-1.103-.1v1.448c.31.035.632.06.965.06 3.978 0 6.85-2.024 9.635-4.394.461.371 2.356 1.27 2.746 1.665-2.626 2.12-8.721 4.027-12.24 4.027-.377 0-.737-.023-1.106-.065v2.322H3.478V3.89H8.95zm0 9.69v1.459c-3.587-.538-4.557-3.89-4.557-3.89s1.664-1.873 4.557-2.11v1.587h-.005c-1.196-.118-2.133.553-2.133.553s.562 1.851 2.138 2.401z"/>
  </svg>
);

// OpenAI Icon
export const OpenAIIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className}
    fill="currentColor"
  >
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
  </svg>
);

// Anthropic Claude Icon
export const AnthropicIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className}
    fill="currentColor"
  >
    <path d="M13.827 3.52h3.603L24 20.48h-3.603l-6.57-16.96zm-7.258 0h3.767L16.906 20.48h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.521zm3.629 10.238l-2.07-5.36-2.094 5.36h4.164z"/>
  </svg>
);

// Google AI Icon
export const GoogleAIIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className}
  >
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// Expert Mode Icon (Trophy/Star combination)
export const ExpertModeIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className}
    fill="currentColor"
  >
    <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2zm0 3.36l1.74 4.09 4.45.38-3.38 2.93 1.02 4.36L12 14.69l-3.83 2.43 1.02-4.36-3.38-2.93 4.45-.38L12 5.36z"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </svg>
);

// Mapping von Provider zu Icon-Komponente
export const ProviderIconMap: Record<string, React.FC<IconProps>> = {
  openrouter: OpenRouterIcon,
  groq: GroqIcon,
  nvidia: NvidiaIcon,
  openai: OpenAIIcon,
  anthropic: AnthropicIcon,
  google: GoogleAIIcon,
  expert: ExpertModeIcon,
};

// Hauptkomponente die basierend auf dem Provider-Namen das richtige Icon rendert
interface ProviderIconProps extends IconProps {
  provider: string;
}

export const ProviderIcon: React.FC<ProviderIconProps> = ({ provider, className = '', size = 24 }) => {
  const IconComponent = ProviderIconMap[provider];
  
  if (!IconComponent) {
    // Fallback für unbekannte Provider
    return <span className={className}>🤖</span>;
  }
  
  return <IconComponent className={className} size={size} />;
};

// Export für einfache Verwendung
export default ProviderIcon;
