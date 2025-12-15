"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import styles from "./detail.module.css";

// 백엔드 API 응답 타입
interface RecipeDetail {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  category: string;
  tags: string[];
  mainIngredients: string[];
  seasonings: string[];
  rating: number;
  userNickname: string;
  createdAt: string;
  updatedAt: string;
}

// 날짜 포맷 함수
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function RecipeDetailPage() {
  const params = useParams();
  const recipeId = params.id;

  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<
    {
      id: number;
      author: string;
      rating: number;
      content: string;
      createdAt: string;
      likes: number;
    }[]
  >([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // 백엔드에서 레시피 상세 정보 가져오기
  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        const response = await fetch(
          `https://after-ungratifying-lilyanna.ngrok-free.dev/api/posts/${recipeId}`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        if (response.ok) {
          const data: RecipeDetail = await response.json();
          setRecipe(data);
        }
      } catch (error) {
        console.error("레시피 상세 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    if (recipeId) {
      fetchRecipeDetail();
    }
  }, [recipeId]);

  // 별점 렌더링 함수
  const renderStars = (
    rating: number,
    interactive = false,
    onStarClick?: (rating: number) => void
  ) => {
    return (
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${styles.star} ${star <= rating ? styles.filled : ""} ${
              interactive ? styles.interactive : ""
            }`}
            onClick={() => interactive && onStarClick && onStarClick(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // 댓글 작성
  const handleCommentSubmit = () => {
    if (!newComment.trim() || newRating === 0) {
      alert("댓글과 별점을 모두 입력해주세요.");
      return;
    }

    const comment = {
      id: comments.length + 1,
      author: "현재 사용자", // 실제로는 로그인한 사용자 정보
      rating: newRating,
      content: newComment,
      createdAt: new Date().toLocaleDateString("ko-KR"),
      likes: 0,
    };

    setComments([...comments, comment]);
    setNewComment("");
    setNewRating(0);
  };

  // 댓글 좋아요
  const handleCommentLike = (commentId: number) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  // 로딩 중
  if (loading) {
    return (
      <div className={styles.detailContainer}>
        <div className={styles.detailContent}>
          <p>레시피를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 레시피가 없는 경우
  if (!recipe) {
    return (
      <div className={styles.detailContainer}>
        <div className={styles.detailContent}>
          <p>레시피를 찾을 수 없습니다.</p>
          <button
            className={styles.backButton}
            onClick={() => window.history.back()}
          >
            목록으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailContent}>
        {/* 레시피 헤더 */}
        <header className={styles.recipeHeader}>
          <div className={styles.titleSection}>
            <h1 className={styles.recipeTitle}>{recipe.title}</h1>
            <button
              className={`${styles.likeButton} ${isLiked ? styles.liked : ""}`}
              onClick={() => setIsLiked(!isLiked)}
            >
              ♡
            </button>
          </div>
          <div className={styles.authorInfo}>
            <span className={styles.author}>{recipe.userNickname}</span>
            <span className={styles.date}>{formatDate(recipe.createdAt)}</span>
            <div className={styles.authorAvatar}>👨‍🍳</div>
          </div>
        </header>

        {/* 레시피 이미지 */}
        <div className={styles.imageSection}>
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className={styles.recipeImage}
            />
          ) : (
            <Image
              src="/images/default-recipe.jpg"
              alt={recipe.title}
              width={600}
              height={400}
              className={styles.recipeImage}
            />
          )}
        </div>

        {/* 재료 정보 */}
        <div className={styles.ingredientsSection}>
          <div className={styles.ingredientColumn}>
            <h3 className={styles.ingredientTitle}>[재료]</h3>
            {recipe.mainIngredients?.map((ingredient, index) => (
              <div key={index} className={styles.ingredientItem}>
                <span className={styles.ingredientName}>{ingredient}</span>
              </div>
            ))}
            {(!recipe.mainIngredients ||
              recipe.mainIngredients.length === 0) && (
              <p className={styles.noIngredients}>등록된 재료가 없습니다.</p>
            )}
          </div>

          <div className={styles.ingredientColumn}>
            <h3 className={styles.ingredientTitle}>[양념]</h3>
            {recipe.seasonings?.map((seasoning, index) => (
              <div key={index} className={styles.ingredientItem}>
                <span className={styles.ingredientName}>{seasoning}</span>
              </div>
            ))}
            {(!recipe.seasonings || recipe.seasonings.length === 0) && (
              <p className={styles.noIngredients}>등록된 양념이 없습니다.</p>
            )}
          </div>
        </div>

        {/* 레시피 내용 */}
        <div className={styles.contentSection}>
          <div className={styles.recipeContent}>
            {recipe.content.split("\n").map((line, index) => (
              <p key={index} className={styles.contentLine}>
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* 태그 */}
        <div className={styles.tagsSection}>
          {recipe.tags?.map((tag, index) => (
            <span key={index} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>

        {/* 목록으로 버튼 */}
        <div className={styles.actionSection}>
          <button
            className={styles.backButton}
            onClick={() => window.history.back()}
          >
            목록으로
          </button>
        </div>

        {/* 댓글 섹션 */}
        <div className={styles.commentsSection}>
          {/* 평점 표시 */}
          <div className={styles.ratingHeader}>
            <span className={styles.averageRating}>
              평점 {recipe.rating || 0}
            </span>
            {renderStars(recipe.rating || 0)}
          </div>

          {/* 기존 댓글 목록 */}
          <div className={styles.commentsList}>
            {comments.map((comment) => (
              <div key={comment.id} className={styles.commentItem}>
                <div className={styles.commentHeader}>
                  <div className={styles.commentAuthor}>
                    <div className={styles.commentAvatar}>👨‍🍳</div>
                    <span className={styles.commentAuthorName}>
                      {comment.author}
                    </span>
                    {renderStars(comment.rating)}
                  </div>
                  <div className={styles.commentActions}>
                    <span className={styles.commentDate}>답글 달기</span>
                    <button
                      className={styles.commentLike}
                      onClick={() => handleCommentLike(comment.id)}
                    >
                      ♡
                    </button>
                  </div>
                </div>
                <p className={styles.commentContent}>{comment.content}</p>
              </div>
            ))}
          </div>

          {/* 댓글 작성 */}
          <div className={styles.commentForm}>
            <div className={styles.ratingInput}>
              {renderStars(newRating, true, setNewRating)}
            </div>
            <textarea
              className={styles.commentTextarea}
              placeholder="방문자 레시피 후기를 알려주세요"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              className={styles.commentSubmit}
              onClick={handleCommentSubmit}
            >
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
