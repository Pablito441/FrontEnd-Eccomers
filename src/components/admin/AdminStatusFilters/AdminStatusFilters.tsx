import s from "./AdminStatusFilters.module.css";

export type StatusFilter = "all" | "active" | "inactive" | "soft-deleted";

interface AdminStatusFiltersProps {
  currentFilter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
  showSoftDeleted?: boolean;
}

export const AdminStatusFilters: React.FC<AdminStatusFiltersProps> = ({
  currentFilter,
  onFilterChange,
  showSoftDeleted = true,
}) => {
  const filters = [
    { key: "all" as StatusFilter, label: "Todos", icon: "list" },
    { key: "active" as StatusFilter, label: "Activos", icon: "check_circle" },
    { key: "inactive" as StatusFilter, label: "Inactivos", icon: "cancel" },
    ...(showSoftDeleted
      ? [{ key: "soft-deleted" as StatusFilter, label: "Eliminados", icon: "delete" }]
      : []),
  ];

  return (
    <div className={s.container}>
      <h3 className={s.title}>Filtrar por Estado</h3>
      <div className={s.filterButtons}>
        {filters.map((filter) => (
          <button
            key={filter.key}
            className={`${s.filterButton} ${
              currentFilter === filter.key ? s.active : ""
            }`}
            data-filter={filter.key}
            onClick={() => onFilterChange(filter.key)}
          >
            <span className="material-symbols-outlined">{filter.icon}</span>
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}; 