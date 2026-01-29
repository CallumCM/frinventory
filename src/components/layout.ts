import { installTwind, SSRTwind } from "../twind.config";



export const Layout = (props: { title: string; children: any }) => {
  const _html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Frinventory - ${props.title}</title>
  <meta name="theme-color" content="#131e2a">
  <link rel="icon" href="/public/icons/ios/192.png" />
  <link rel="manifest" href="/public/manifest.json" />
</head>
<body>
  ${props.children}
  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/public/sw.js');
    }
  </script>
</body>
</html>`
    
  return SSRTwind(_html);
}

