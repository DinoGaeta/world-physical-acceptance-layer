/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Enable static HTML export for GitHub Pages / Netlify Drop
    images: {
        unoptimized: true
    }
}

module.exports = nextConfig
