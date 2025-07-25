import { Hero } from '../components/hero'

import { auth } from '@clerk/nextjs/server'

import { redirect } from 'next/navigation'

export default async function Home() {
  const { userId } = await auth()

  if (userId) {
    redirect('/dashboard')
  }

  return <Hero />
}
