import { extract, install } from '@twind/core'
import presetTailwind from '@twind/preset-tailwind'
import { HtmlEscapedString } from 'hono/utils/html';

function installTwind() {
  install({
  presets: [presetTailwind(), {
    theme: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['Times New Roman', 'ui-serif', 'Georgia'],
      },
      colors: {
        infinity: {
          1: "#131e2a",
          2: "#343d55",
          3: "#4e5b80",
          4: "#6779aa",
          5: "#8198d4",
          6: "#9bb6ff"
        },
        pistachio: {
          6: "#95e6a8",
          5: "#79bb89",
          4: "#5e916a",
          3: "#42664b",
          2: "#273c2c",
          1: "#0b110d"
        },
        "warning-pepper-light": "#f4d032",
        "warning-pepper-dark": "#53451d",
        lychee: {
          6: "#e695a2",
          5: "#bb7984",
          4: "#915e66",
          3: "#664248",
          2: "#3c272a",
          1: "#110b0c"
        },
        white: "#ffeee5",
        black: "#101316"
      }
    }
  }]
});
}

async function SSRTwind(body: string) {
  const { html, css } = extract((await body));
  return html.replace('</head>', `<style data-twind>${css}</style></head>`);
}

export { installTwind, SSRTwind };