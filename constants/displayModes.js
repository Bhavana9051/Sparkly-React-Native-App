export const DISPLAY_MODES = {
  DEFAULT: 'default',
  FLOATING_EMOJIS: 'floating-emojis',
  LED_BORDER: 'led-border',
  SNOWFLAKES: 'snowflakes',
  SPARKLES: 'sparkles',
};

export const displayModesConfig = {
  [DISPLAY_MODES.DEFAULT]: {
    name: 'Simple',
    textEffect: {}
  },
  [DISPLAY_MODES.FLOATING_EMOJIS]: {
    name: 'Floating Emojis',
    emojis: ['❤️', '😂', '😢', '😎', '🔥', '🌟'],
    textEffect: { textShadowColor: '#ff1493', textShadowRadius: 10 }
  },
  [DISPLAY_MODES.LED_BORDER]: {
    name: 'LED Border',
    textEffect: { 
      textShadowColor: '#00ffff', 
      textShadowRadius: 15,
      textShadowOffset: { width: 0, height: 0 }
    }
  },
  [DISPLAY_MODES.SNOWFLAKES]: {
    name: 'Snowflakes',
    emojis: ['❄️', '⛄', '🌨️'],
    textEffect: { textShadowColor: '#ffffff', textShadowRadius: 8 }
  },
  [DISPLAY_MODES.SPARKLES]: {
    name: 'Sparkles',
    emojis: ['✨', '⭐', '💫'],
    textEffect: { textShadowColor: '#ffff00', textShadowRadius: 12 }
  }
};