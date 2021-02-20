const parsedUrl = new URL(window.location.href);
const baseUrl = parsedUrl.origin;

export const environment = {
  production: false,
  apiBase: `${baseUrl.includes('localhost') ? "http://localhost:3000": "https://vmkrcmar68.in.tum.de"}/api`
};