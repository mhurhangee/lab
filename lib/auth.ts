'use server'

import { auth } from '@clerk/nextjs/server'

export async function getUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error('⛔ Unauthorized. You need to be logged in to do that!')
  return userId
}
