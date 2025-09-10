import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Elimina 'export' si necesitas funcionalidad de servidor
  // output: 'export', // <- COMENTAR O ELIMINAR ESTA LÍNEA

  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // assetPrefix: "https://apptega-navigator.netlify.app",

  // Elimina assetPrefix y basePath si no los necesitas
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/navigator' : '',
  // basePath: process.env.NODE_ENV === 'production' ? '/navigator' : '',
  env: {
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    BEDROCK_MODEL_ID: process.env.BEDROCK_MODEL_ID,
  },
};

export default nextConfig;
