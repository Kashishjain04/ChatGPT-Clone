/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ["links.kjdev.tech"],
	},
	swcMinify: true,
	experimental: {
		appDir: true,
	},
};

module.exports = nextConfig;
