import { auth } from '@/../../auth'

export async function getUserIdFromRequest() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('UNAUTHORIZED')
  }
  return session.user.id
}
