"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./recipes.module.css";
import RecipeCard from "./components/RecipeCard";
import SearchBar from "./components/SearchBar";
import CategoryDropdown from "./components/CategoryDropdown";

// 댓글 데이터 (실제로는 API에서 가져올 데이터)
const mockComments = {
  1: [
    { rating: 5, author: "사용자1" },
    { rating: 4, author: "사용자2" },
  ], // 평균: 4.5
  2: [
    { rating: 5, author: "사용자3" },
    { rating: 5, author: "사용자4" },
    { rating: 4, author: "사용자5" },
  ], // 평균: 4.7
  3: [{ rating: 5, author: "사용자6" }], // 평균: 5.0
  // 나머지 레시피들은 댓글이 없어서 기본 별점 표시
};

// 별점 평균 계산 함수
const calculateAverageRating = (recipeId: number) => {
  const comments = mockComments[recipeId as keyof typeof mockComments];
  if (!comments || comments.length === 0) {
    return 0; // 댓글이 없으면 0점 (별점 없음 표시)
  }
  const sum = comments.reduce((acc, comment) => acc + comment.rating, 0);
  return Math.round((sum / comments.length) * 10) / 10; // 소수점 1자리까지
};

// 임시 데이터 (나중에 API로 대체)
const mockRecipes = [
  {
    id: 1,
    title: "제육 볶음",
    content: "매콤 달콤한 돼지고기 제육볶음 레시피",
    image: "/images/recipe1.jpg",
    rating: calculateAverageRating(1), // 댓글 기반 평균 별점
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
    rating: calculateAverageRating(2), // 댓글 기반 평균 별점
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
    rating: calculateAverageRating(3), // 댓글 기반 평균 별점
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
    rating: calculateAverageRating(4),
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
    rating: calculateAverageRating(5),
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
    rating: calculateAverageRating(6),
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
    rating: calculateAverageRating(7),
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
    rating: calculateAverageRating(8),
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
    rating: calculateAverageRating(9),
    category: "양식",
    hashtags: ["#파스타", "#새우", "#크림"],
    author: "레스토랑셰프",
    createdAt: "25.12.01",
  },
  {
    id: 10,
    title: "김치볶음밥",
    content: "집에서 쉽게 만드는 김치볶음밥",
    image: "/images/recipe1.jpg",
    rating: calculateAverageRating(10),
    category: "한식",
    hashtags: ["#볶음밥", "#김치", "#간단요리"],
    author: "집밥요리사",
    createdAt: "25.11.30",
  },
  {
    id: 11,
    title: "치킨 카레",
    content: "진한 향신료의 치킨 카레",
    image: "/images/recipe2.jpg",
    rating: calculateAverageRating(11),
    category: "양식",
    hashtags: ["#카레", "#치킨", "#향신료"],
    author: "카레마스터",
    createdAt: "25.11.29",
  },
];

export default function RecipesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체 보기");
  const [selectedHashtag, setSelectedHashtag] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 9;

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

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;
  const currentRecipes = filteredRecipes.slice(startIndex, endIndex);

  // 페이지 번호 배열 생성 (최대 5개 페이지 버튼 표시)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // 총 페이지가 5개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 현재 페이지를 중심으로 5개 페이지 표시
      let startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      // 끝에서 시작 페이지 조정
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // 카테고리 변경시 첫 페이지로
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 변경시 스크롤을 맨 위로
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 검색이나 필터 변경시 첫 페이지로 리셋
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSelectedHashtag(""); // 해시태그 필터 초기화
    setCurrentPage(1); // 첫 페이지로
  };

  const handleHashtagClick = (hashtag: string) => {
    setSelectedHashtag(hashtag);
    setSearchTerm(""); // 검색어 초기화
    setSearchInput(""); // 검색 입력창 초기화
    setCurrentPage(1); // 첫 페이지로
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

        {/* 카테고리 드롭다운과 글쓰기 버튼 */}
        <div className={styles.actionBar}>
          <CategoryDropdown
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategoryChange}
          />
          <Link href="/recipes/write" className={styles.writeButton}>
            ✏️ 글쓰기
          </Link>
        </div>

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
          {currentRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onHashtagClick={handleHashtagClick}
            />
          ))}
        </div>

        {/* 검색 결과가 없을 때 */}
        {filteredRecipes.length === 0 && (
          <div className={styles.noResults}>
            <p>검색 결과가 없습니다.</p>
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            {/* 이전 페이지 버튼 */}
            <button
              className={`${styles.pageButton} ${
                currentPage === 1 ? styles.disabled : ""
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>

            {/* 페이지 번호 버튼들 */}
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                className={`${styles.pageButton} ${
                  currentPage === pageNum ? styles.active : ""
                }`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            ))}

            {/* 다음 페이지 버튼 */}
            <button
              className={`${styles.pageButton} ${
                currentPage === totalPages ? styles.disabled : ""
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        )}

        {/* 페이지 정보 표시 */}
        <div className={styles.pageInfo}>
          총 {filteredRecipes.length}개의 레시피 (페이지 {currentPage} /{" "}
          {totalPages})
        </div>
      </main>
    </div>
  );
}
