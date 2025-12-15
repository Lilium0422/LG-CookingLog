"use client";

import RecipeCard from "../../recipes/components/RecipeCard";
import styles from "./RecipeSection.module.css";

export default function RecipeSection({
  label,
  title,
  type,
}: {
  label: string;
  title: string;
  type: "popular" | "recommend";
}) {
  // ✅ 임시 데이터 (나중에 API로 대체)
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
  ];

  // 섹션별로 3개씩 분리
  const recipes =
    type === "popular"
      ? mockRecipes.slice(0, 3)
      : mockRecipes.slice(3, 6);

  return (
    <section className={styles.section}>
      <span className={styles.label}>{label}</span>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.grid}>
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onHashtagClick={() => {}}
          />
        ))}
      </div>
    </section>
  );
}
