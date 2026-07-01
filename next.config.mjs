/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Mantém o PDFKit como pacote externo no servidor. Isso evita erros de runtime
  // quando o Next tenta empacotar dependências internas do gerador de PDF.
  experimental: {
    serverComponentsExternalPackages: ['pdfkit']
  }
};

export default nextConfig;
