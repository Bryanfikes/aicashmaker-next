import type { Metadata } from 'next'
import AdvertiseClient from './AdvertiseClient'

export const metadata: Metadata = {
  title: 'Advertise — AICashMaker',
  description: 'Reach 50,000+ AI income seekers. Feature your tool, sponsor our newsletter, or get a full review.',
}

export default function AdvertisePage() {
  return <AdvertiseClient />
}
