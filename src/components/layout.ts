import { setup } from 'twind'
import { virtualSheet, getStyleTag } from 'twind/sheets'

const sheet = virtualSheet()
const twindConfig = {
  theme: {
    extend: {}
  }
}

export const Layout = (props: { title: string; children: any }) => {
  sheet.reset()
  setup({ ...twindConfig, sheet })

  const styleTag = getStyleTag(sheet)

  const markup = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Frinventory - ${props.title}</title>
  ${styleTag}
</head>
<body>
  ${props.children}
</body>
</html>`
    
  return markup
}

