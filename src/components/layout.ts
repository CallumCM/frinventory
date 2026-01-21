import { extract } from '@twind/core'

export const Layout = (props: { title: string; children: any }) => {
  const markup = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Frinventory - ${props.title}</title>
</head>
<body>
  ${props.children}
</body>
</html>`
  
  const { html, css } = extract(markup)
  
  return html.replace(
    '</head>',
    `<style data-twind>${css}</style></head>`
  )
}

