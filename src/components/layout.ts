import { installTwind, SSRTwind } from "../twind.config";



export const Layout = (props: { title: string; children: any }) => {
  const _html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Frinventory - ${props.title}</title>
  <meta name="theme-color" content="#131e2a">
</head>
<body>
  ${props.children}
</body>
</html>`
    
  return SSRTwind(_html);
}

