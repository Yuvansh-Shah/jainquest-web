import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  // Fully static export: the app is a client-side Firebase SPA with no
  // server logic, so it ships as static HTML/JS. This avoids the Cloud
  // Function backend Firebase Hosting would otherwise need for SSR, so it
  // deploys on the free (Spark) plan.
  output: 'export',
  // Pin the workspace root so Next doesn't pick up an unrelated parent
  // lockfile (there is a stray one in the user's home directory).
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
