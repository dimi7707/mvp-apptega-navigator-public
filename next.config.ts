import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Elimina 'export' si necesitas funcionalidad de servidor
  // output: 'export', // <- COMENTAR O ELIMINAR ESTA LÍNEA
  
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // Elimina assetPrefix y basePath si no los necesitas
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/navigator' : '',
  // basePath: process.env.NODE_ENV === 'production' ? '/navigator' : '',
};

export default nextConfig;