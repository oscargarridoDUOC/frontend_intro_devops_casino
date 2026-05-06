// Configuracion para produccion. Cambien la URL antes de hacer 'npm run build'
// o inyectenla por una variable a la imagen Docker en el step de build.
export const environment = {
  production: true,
  apiBaseUrl: 'http://CHANGE-ME-EC2-BACKEND:3000'
};
