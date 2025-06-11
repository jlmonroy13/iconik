interface EmptyStateProps {
  onClearFilters: () => void
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="p-8 text-center">
      <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
        <span className="text-2xl">🔍</span>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No se encontraron servicios
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        Ajusta los filtros para ver más resultados
      </p>
      <button
        onClick={onClearFilters}
        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Limpiar Filtros
      </button>
    </div>
  )
}
