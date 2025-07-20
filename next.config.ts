import { withContentCollections } from '@content-collections/next'

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
}

// withContentCollections must be the outermost plugin
export default withContentCollections(nextConfig)
