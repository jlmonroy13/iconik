import { getManicurists, getManicuristStats } from './actions'
import ManicuristsClientPage from './components/ManicuristsClientPage'
import type { Manicurist } from './types'

export default async function ManicuristsPage() {
  const manicuristsResult = await getManicurists()
  const statsResult = await getManicuristStats()

  if (!manicuristsResult.success) {
    // Puedes personalizar el error si lo deseas
    return <div className="p-8 text-center text-red-500">{manicuristsResult.message}</div>
  }

  const manicurists = (manicuristsResult.data || []) as Manicurist[]
  const stats = statsResult.success && statsResult.data
    ? statsResult.data
    : {
        total: 0,
        active: 0,
        inactive: 0,
      }

  return (
    <ManicuristsClientPage
      manicurists={manicurists}
      stats={stats}
    />
  )
}
