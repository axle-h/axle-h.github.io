/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  env: {
    email: 'alex.haslehurst@gmail.com',
    linkedin: 'ahaslehurst',
    website: 'ax-h.com',
    github: 'axle-h',
    googleMaps: 'a12DCrhaHz9XdY2n8',
    location: 'Sheffield, UK',
    disqus: 'ax-h',
    googleAnalytics: 'UA-110996722-1',
  },
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
}

export default nextConfig
