/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@libsql/client', '@prisma/adapter-libsql'],
  images: {
    domains: ['localhost', 'i.hizliresim.com', 'hizliresim.com', 'placehold.co'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
}

module.exports = nextConfig
