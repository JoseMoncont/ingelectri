export type AccentKey = 'brand' | 'steel' | 'success' | 'warning' | 'danger';

const ACCENT_KEYS: AccentKey[] = ['brand', 'steel', 'success', 'warning', 'danger'];

const AVATAR_BG_CLASSES: Record<AccentKey, string> = {
  brand: 'bg-brand',
  steel: 'bg-steel',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

interface AccentStyle {
  icon: string;
  iconBg: string;
  text: string;
  progressTrack: string;
  progressIndicator: string;
}

export const ACCENT_STYLES: Record<AccentKey, AccentStyle> = {
  brand: {
    icon: 'text-brand',
    iconBg: 'bg-brand/10',
    text: 'text-brand',
    progressTrack: 'bg-brand/15',
    progressIndicator: 'bg-brand',
  },
  steel: {
    icon: 'text-steel',
    iconBg: 'bg-steel/10',
    text: 'text-steel',
    progressTrack: 'bg-steel/15',
    progressIndicator: 'bg-steel',
  },
  success: {
    icon: 'text-success',
    iconBg: 'bg-success/10',
    text: 'text-success',
    progressTrack: 'bg-success/15',
    progressIndicator: 'bg-success',
  },
  warning: {
    icon: 'text-warning',
    iconBg: 'bg-warning/10',
    text: 'text-warning',
    progressTrack: 'bg-warning/15',
    progressIndicator: 'bg-warning',
  },
  danger: {
    icon: 'text-danger',
    iconBg: 'bg-danger/10',
    text: 'text-danger',
    progressTrack: 'bg-danger/15',
    progressIndicator: 'bg-danger',
  },
};

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getAvatarAccentClass(seed: string): string {
  const key = ACCENT_KEYS[hashSeed(seed) % ACCENT_KEYS.length];
  return AVATAR_BG_CLASSES[key];
}
