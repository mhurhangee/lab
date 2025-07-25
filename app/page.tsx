import { auth } from '@clerk/nextjs/server'

import { redirect } from 'next/navigation'

import { Hero } from '../components/hero'

export default async function Home() {
  const { userId } = await auth()

  if (userId) {
    redirect('/dashboard')
  }

  return <Hero />
}
