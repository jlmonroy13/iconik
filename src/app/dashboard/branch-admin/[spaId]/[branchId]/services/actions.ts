'use server';

import { getServicesGroupedByType, getAllActiveServices } from './queries';

// ============================================
// READ ACTIONS (for Client Components)
// ============================================

/**
 * Fetch services grouped by type
 * Used by: Manicurist services modal
 */
export async function fetchServicesGrouped(spaId: string, branchId?: string) {
  try {
    return await getServicesGroupedByType(spaId, branchId);
  } catch (error) {
    console.error('Error fetching services grouped:', error);
    throw error;
  }
}

/**
 * Fetch all active services
 * Used by: Forms, dropdowns
 */
export async function fetchActiveServices(spaId: string, branchId?: string) {
  try {
    return await getAllActiveServices(spaId, branchId);
  } catch (error) {
    console.error('Error fetching active services:', error);
    throw error;
  }
}

// ============================================
// MUTATION ACTIONS
// ============================================

// TODO: Add service CRUD actions here when needed
// - createService
// - updateService
// - deleteService
