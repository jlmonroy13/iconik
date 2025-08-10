/**
 * Test file for spa-utils functions
 * This file is for documentation and testing purposes
 */

import { getCurrentSpaId, getSpaIdWithFallback } from './spa-utils'

// Example usage:
//
// // In a server action or API route:
// export async function someAction() {
//   try {
//     const spaId = await getCurrentSpaId()
//     // Use spaId for database queries
//     const data = await prisma.someModel.findMany({ where: { spaId } })
//     return { success: true, data }
//   } catch (error) {
//     // Handle error (redirect to onboarding, show error message, etc.)
//     return { success: false, message: 'Error occurred' }
//   }
// }
//
// // For cases where you want to handle the fallback manually:
// export async function someOtherAction() {
//   const spaId = await getSpaIdWithFallback()
//   if (!spaId) {
//     // Handle onboarding redirect manually
//     redirect('/onboarding')
//   }
//   // Use spaId for database queries
// }

export { getCurrentSpaId, getSpaIdWithFallback }
