'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DashboardStats } from '../types/dashboard';
import { DASHBOARD_CONFIG } from '../config/dashboardConfig';

interface UseDashboardReturn {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useDashboard(): UseDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await response.json();
      setStats(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshStats = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Auto-refresh based on configuration
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats();
    }, DASHBOARD_CONFIG.refreshIntervals.stats);

    return () => clearInterval(interval);
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refreshStats,
    lastUpdated,
  };
}

// Hook for managing dashboard filters and preferences
interface DashboardFilters {
  timePeriod: 'today' | 'week' | 'month' | 'year';
  showCashRegister: boolean;
  showAlerts: boolean;
  showTopPerformers: boolean;
  showPopularServices: boolean;
}

interface UseDashboardFiltersReturn {
  filters: DashboardFilters;
  updateFilter: <K extends keyof DashboardFilters>(
    key: K,
    value: DashboardFilters[K]
  ) => void;
  resetFilters: () => void;
}

const defaultFilters: DashboardFilters = {
  timePeriod: 'month',
  showCashRegister: true,
  showAlerts: true,
  showTopPerformers: true,
  showPopularServices: true,
};

export function useDashboardFilters(): UseDashboardFiltersReturn {
  const [filters, setFilters] = useState<DashboardFilters>(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-filters');
      if (saved) {
        try {
          return { ...defaultFilters, ...JSON.parse(saved) };
        } catch {
          // If parsing fails, use defaults
        }
      }
    }
    return defaultFilters;
  });

  const updateFilter = useCallback(
    <K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) => {
      setFilters(prev => {
        const newFilters = { ...prev, [key]: value };
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('dashboard-filters', JSON.stringify(newFilters));
        }
        return newFilters;
      });
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dashboard-filters');
    }
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
  };
}

// Hook for managing dashboard layout preferences
interface DashboardLayout {
  sidebarCollapsed: boolean;
  compactMode: boolean;
  showAnimations: boolean;
}

interface UseDashboardLayoutReturn {
  layout: DashboardLayout;
  toggleSidebar: () => void;
  toggleCompactMode: () => void;
  toggleAnimations: () => void;
  resetLayout: () => void;
}

const defaultLayout: DashboardLayout = {
  sidebarCollapsed: false,
  compactMode: false,
  showAnimations: true,
};

export function useDashboardLayout(): UseDashboardLayoutReturn {
  const [layout, setLayout] = useState<DashboardLayout>(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-layout');
      if (saved) {
        try {
          return { ...defaultLayout, ...JSON.parse(saved) };
        } catch {
          // If parsing fails, use defaults
        }
      }
    }
    return defaultLayout;
  });

  const updateLayout = useCallback((updates: Partial<DashboardLayout>) => {
    setLayout(prev => {
      const newLayout = { ...prev, ...updates };
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('dashboard-layout', JSON.stringify(newLayout));
      }
      return newLayout;
    });
  }, []);

  const toggleSidebar = useCallback(() => {
    updateLayout({ sidebarCollapsed: !layout.sidebarCollapsed });
  }, [layout.sidebarCollapsed, updateLayout]);

  const toggleCompactMode = useCallback(() => {
    updateLayout({ compactMode: !layout.compactMode });
  }, [layout.compactMode, updateLayout]);

  const toggleAnimations = useCallback(() => {
    updateLayout({ showAnimations: !layout.showAnimations });
  }, [layout.showAnimations, updateLayout]);

  const resetLayout = useCallback(() => {
    setLayout(defaultLayout);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dashboard-layout');
    }
  }, []);

  return {
    layout,
    toggleSidebar,
    toggleCompactMode,
    toggleAnimations,
    resetLayout,
  };
}
