import Image from "next/image";
import Link from "next/link";
import styles from "./RecipeCard.module.css";

interface Recipe {
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

interface RecipeCardProps {
  recipe: Recipe;
  onHashtagClick: (hashtag: string) => void;
  index?: number; // 애니메이션 지연을 위한 줄 인덱스 (3개씩 한번에)
}

export default function RecipeCard({
  recipe,
  onHashtagClick,
  index = 0,
}: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`} className={styles.recipeCardLink}>
      <div
        className={styles.recipeCard}
        style={{
          animationDelay: `${index * 0.15}s`, // 각 줄마다 0.15초씩 지연 (더 부드럽게)
        }}
      >
        <div className={styles.imageContainer}>
          <img
            src={
              recipe.image && recipe.image.startsWith("/uploads")
                ? `https://after-ungratifying-lilyanna.ngrok-free.dev${recipe.image}`
                : recipe.image || "/images/default-recipe.jpg"
            }
            alt={recipe.title}
            className={styles.recipeImage}
            onError={(e) => {
              // 이미지 로드 실패시 기본 이미지로 대체
              e.currentTarget.src = "/images/default-recipe.jpg";
            }}
          />
        </div>

        <div className={styles.cardContent}>
          <h3 className={styles.recipeTitle}>{recipe.title}</h3>
          <p className={styles.recipeDescription}>{recipe.content}</p>

          <div className={styles.recipeInfo}>
            <div className={styles.rating}>
              {recipe.rating > 0 ? (
                <>
                  <span className={styles.star}>⭐</span>
                  <span className={styles.ratingValue}>{recipe.rating}</span>
                </>
              ) : (
                <span className={styles.noRating}>별점 없음</span>
              )}
            </div>

            <div className={styles.metadata}>
              <span className={styles.category}>{recipe.category}</span>
            </div>
          </div>

          <div className={styles.hashtags}>
            {recipe.hashtags.map((hashtag, index) => (
              <button
                key={index}
                className={styles.hashtag}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onHashtagClick(hashtag);
                }}
              >
                {hashtag}
              </button>
            ))}
          </div>

          {/* 작성자 및 작성일 */}
          <div className={styles.authorInfo}>
            <span className={styles.createdAt}>{recipe.createdAt}</span>
            <span className={styles.author}>작성자 {recipe.author}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
