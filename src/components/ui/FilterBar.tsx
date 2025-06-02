import { ChangeEvent } from "react";

interface FilterBarProps {
  placeholder?: string;
  value: string;
  onSearchChange: (value: string) => void;
  activeFilter?: string;
  onFilterChange: (filter: string) => void;
  filterButtons?: { label: string; value: string }[]; // Custom filter buttons
  secondaryFilterButtons?: { label: string; value: string }[];
  activeSecondaryFilter?: string;
  onSecondaryFilterChange?: (val: string) => void;
}

const FilterBar = ({
  placeholder = "Search...",
  value,
  onSearchChange,
  activeFilter = "",
  onFilterChange,
  filterButtons = [],
  secondaryFilterButtons,
  activeSecondaryFilter,
  onSecondaryFilterChange,
}: FilterBarProps) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleFilterClick = (filter: string) => {
    onFilterChange(filter === activeFilter ? "" : filter); // Toggle active filter
  };

  return (
    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      {/* Search Input */}
      <div className="flex-1">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0 sm:ml-4 items-center">
        {/* Primary Filter Buttons */}
        {filterButtons.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => handleFilterClick(value)}
            className={`px-4 py-2 rounded-md text-sm ${
              activeFilter === value
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            } hover:bg-blue-600 focus:outline-none`}
          >
            {label}
          </button>
        ))}

        {/* Separator */}
        {secondaryFilterButtons && (
          <div className="w-px h-6 bg-gray-400 mx-2 hidden sm:block" />
        )}

        {/* Secondary Filter Buttons */}
        {secondaryFilterButtons &&
          onSecondaryFilterChange &&
          secondaryFilterButtons.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => onSecondaryFilterChange(value)}
              className={`px-4 py-2 rounded-md text-sm ${
                activeSecondaryFilter === value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              } hover:bg-blue-600 focus:outline-none`}
            >
              {label}
            </button>
          ))}
      </div>
    </div>
  );
};

export default FilterBar;
