import { useState } from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  searchInput: string;
  onSearchInputChange: (input: string) => void;
  onSearch: (term: string) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export default function SearchBar({
  searchInput,
  onSearchInputChange,
  onSearch,
  isVisible,
  onToggleVisibility,
}: SearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch(searchInput);
    }
  };

  const handleClear = () => {
    onSearchInputChange("");
    onSearch("");
  };

  return (
    <div className={styles.searchContainer}>
      {/* 검색 토글 버튼 */}
      <button
        className={styles.searchToggle}
        onClick={onToggleVisibility}
        aria-label="검색"
      >
        🔍
      </button>

      {/* 검색 입력창 */}
      <div
        className={`${styles.searchInputContainer} ${
          isVisible ? styles.visible : ""
        }`}
      >
        <input
          type="text"
          placeholder="레시피를 검색하고 Enter를 누르세요..."
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles.searchInput}
        />
        {searchInput && (
          <button
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="검색어 지우기"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
