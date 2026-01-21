import { install } from '@twind/core'
import presetTailwind from '@twind/preset-tailwind'

install({
  presets: [presetTailwind()],
  theme: {
    extend: {
      colors: {
        // Blackbody temperature colors
        '0k': '#000000',      // 0K - absolute black
        '1700k': '#FF6B35',   // 1700K - warm red/orange (candle flame)
        '3000k': '#FFA057',   // 3000K - warm white (incandescent)
        '5000k': '#FFFFFF',   // 5000K - neutral white (daylight)
        '8000k': '#A0C8FF',   // 8000K - cool blue
        // Utility grays for UI elements
        'dark-1': '#1A1A1A',
        'dark-2': '#2A2A2A',
      },
      fontFamily: {
        serif: ['Times New Roman', 'Times', 'serif'],
      },
    },
  },
})
