/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: gera a pasta ./out pronta pra subir em qualquer VPS / hospedagem estática.
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
