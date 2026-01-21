import { html } from 'hono/html'

// Layout component using Hono's html tagged template literal
// The html`` function safely escapes content and returns a response-ready string
// You can use ${} to interpolate variables - they're automatically escaped
export const Layout = (props: { title: string; children: any }) => html``
