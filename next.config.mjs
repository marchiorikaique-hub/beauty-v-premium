/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: gera a pasta ./out pronta pra subir em qualquer VPS / hospedagem estática.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
