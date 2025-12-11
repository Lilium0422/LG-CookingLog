"use client";

import { useState } from "react";
import styles from "./recipes.module.css";
import RecipeCard from "./components/RecipeCard";
import SearchBar from "./components/SearchBar";
import CategoryDropdown from "./components/CategoryDropdown";

// 임시 데이터 (나중에 API로 대체)
const mockRecipes = [
  {
    id: 1,
    title: "제육 볶음",
    content: "매콤 달콤한 돼지고기 제육볶음 레시피",
    image: "/images/recipe1.jpg",
    rating: 4.8,
    category: "한식",
    hashtags: ["#매운맛", "#돼지고기", "#볶음"],
    author: "요리왕 김셰프",
    createdAt: "25.12.09",
  },
  {
    id: 2,
    title: "차돌 된장찌개",
    content: "진한 국물이 일품인 차돌 된장찌개 만들기",
    image: "/images/recipe2.jpg",
    rating: 4.9,
    category: "한식",
    hashtags: ["#찌개", "#차돌박이", "#된장"],
    author: "집밥요리사",
    createdAt: "25.12.08",
  },
  {
    id: 3,
    title: "떡볶이",
    content: "집에서 만드는 매콤달콤한 떡볶이 레시피",
    image: "/images/recipe3.jpg",
    rating: 4.7,
    category: "분식",
    hashtags: ["#떡볶이", "#매운맛", "#간식"],
    author: "분식마니아",
    createdAt: "25.12.07",
  },
  {
    id: 4,
    title: "봉골레 파스타",
    content: "이탈리아 정통 봉골레 파스타 만들기",
    image: "/images/recipe4.jpg",
    rating: 4.7,
    category: "양식",
    hashtags: ["#파스타", "#조개", "#이탈리안"],
    author: "이탈리아요리사",
    createdAt: "25.12.06",
  },
  {
    id: 5,
    title: "토마토 파스타",
    content: "새콤달콤한 토마토 파스타 레시피",
    image: "/images/recipe5.jpg",
    rating: 4.6,
    category: "양식",
    hashtags: ["#파스타", "#토마토", "#이탈리안"],
    author: "파스타러버",
    createdAt: "25.12.05",
  },
  {
    id: 6,
    title: "돼지 불백",
    content: "기사 식당 돼지 불백 만들기",
    image: "/images/recipe6.jpg",
    rating: 4.8,
    category: "한식",
    hashtags: ["#돼지고기", "#한식", "#불백"],
    author: "기사식당사장",
    createdAt: "25.12.04",
  },
  {
    id: 7,
    title: "소갈비찜",
    content: "부드러운 소갈비찜 레시피",
    image: "/images/recipe7.jpg",
    rating: 4.7,
    category: "한식",
    hashtags: ["#갈비찜", "#소고기", "#찜요리"],
    author: "한식마스터",
    createdAt: "25.12.03",
  },
  {
    id: 8,
    title: "해물 김치찜",
    content: "칼칼한 김치찜 레시피",
    image: "/images/recipe8.jpg",
    rating: 4.6,
    category: "한식",
    hashtags: ["#김치찜", "#해물", "#찜요리"],
    author: "김치요리전문가",
    createdAt: "25.12.02",
  },
  {
    id: 9,
    title: "투움바 파스타",
    content: "유명 레스토랑에서 팔던 그 맛",
    image: "/images/recipe9.jpg",
    rating: 4.5,
    category: "양식",
    hashtags: ["#파스타", "#새우", "#크림"],
    author: "레스토랑셰프",
    createdAt: "25.12.01",
  },
];

export default function RecipesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체 보기");
  const [selectedHashtag, setSelectedHashtag] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // 검색 및 필터링 로직
  const filteredRecipes = mockRecipes.filter((recipe) => {
    // 해시태그 필터링 (해시태그가 선택된 경우)
    if (selectedHashtag) {
      const matchesHashtag = recipe.hashtags.includes(selectedHashtag);
      const matchesCategory =
        selectedCategory === "전체 보기" ||
        recipe.category === selectedCategory;
      return matchesHashtag && matchesCategory;
    }

    // 일반 검색 (Enter로 검색한 경우)
    const matchesSearch =
      searchTerm === "" ||
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "전체 보기" || recipe.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleHashtagClick = (hashtag: string) => {
    setSelectedHashtag(hashtag);
    setSearchTerm(""); // 검색어 초기화
    setSearchInput(""); // 검색 입력창 초기화
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSelectedHashtag(""); // 해시태그 필터 초기화
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // 카테고리 변경시 해시태그 필터는 유지
  };

  return (
    <div className={styles.recipesContainer}>
      {/* 메인 콘텐츠 */}
      <main className={styles.mainContent}>
        {/* 페이지 헤더 */}
        <div className={styles.pageHeader}>
          <div className={styles.titleSection}>
            <div className={styles.chefIcon}>👨‍🍳</div>
            <h1 className={styles.pageTitle}>레시피 게시판</h1>
          </div>

          <SearchBar
            searchInput={searchInput}
            onSearchInputChange={setSearchInput}
            onSearch={handleSearch}
            isVisible={isSearchVisible}
            onToggleVisibility={() => setIsSearchVisible(!isSearchVisible)}
          />
        </div>

        {/* 카테고리 드롭다운 */}
        <CategoryDropdown
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategoryChange}
        />

        {/* 현재 필터 상태 표시 */}
        {(searchTerm || selectedHashtag) && (
          <div className={styles.filterStatus}>
            {searchTerm && (
              <span className={styles.filterTag}>
                검색: {searchTerm}
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSearchInput("");
                  }}
                >
                  ×
                </button>
              </span>
            )}
            {selectedHashtag && (
              <span className={styles.filterTag}>
                해시태그: {selectedHashtag}
                <button onClick={() => setSelectedHashtag("")}>×</button>
              </span>
            )}
          </div>
        )}

        {/* 레시피 그리드 */}
        <div className={styles.recipeGrid}>
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onHashtagClick={handleHashtagClick}
            />
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className={styles.pagination}>
          <button className={styles.pageButton}>&lt;</button>
          <button className={`${styles.pageButton} ${styles.active}`}>1</button>
          <button className={styles.pageButton}>2</button>
          <button className={styles.pageButton}>3</button>
          <button className={styles.pageButton}>4</button>
          <button className={styles.pageButton}>5</button>
          <button className={styles.pageButton}>&gt;</button>
        </div>
      </main>
    </div>
  );
}
