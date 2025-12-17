"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RecipeCard from "../../recipes/components/RecipeCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import styles from "./RecipeSection.module.css";

interface Recipe {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  rating: number;
  category: string;
  tags: string[];
  userNickname: string;
  createdAt: string;
}

interface RecipeCardData {
  id: number;
  title: string;
  content: string;
  image: string;
  rating: number;
  category: string;
  hashtags: string[];
  author: string;
  createdAt: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

const transformRecipe = (recipe: Recipe): RecipeCardData => ({
  id: recipe.id,
  title: recipe.title,
  content: recipe.content,
  image: recipe.imageUrl || "/images/default-recipe.jpg",
  rating: recipe.rating || 0,
  category: recipe.category,
  hashtags: recipe.tags?.map((tag) => `#${tag}`) || [],
  author: recipe.userNickname,
  createdAt: formatDate(recipe.createdAt),
});

export default function RecipeSection({
  label,
  title,
  type,
}: {
  label: string;
  title: string;
  type: "recent" | "popular";
}) {
  const [recipes, setRecipes] = useState<RecipeCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          "https://after-ungratifying-lilyanna.ngrok-free.dev/api/posts",
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        if (response.ok) {
          const data: Recipe[] = await response.json();
          const transformedRecipes = data.map(transformRecipe);
          
          // 최신순으로 정렬 (createdAt 기준)
          const sortedRecipes = transformedRecipes.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          
          // 4개만 가져오기
          setRecipes(sortedRecipes.slice(0, 4));
        }
      } catch (error) {
        console.error("레시피 목록 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [type]);

  if (loading) {
    return (
      <section className={styles.section}>
        <LoadingSpinner />
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <span className={styles.label}>{label}</span>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <Link href="/recipes" className={styles.moreButton}>
          더 많은 레시피 보기
        </Link>
      </div>

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
