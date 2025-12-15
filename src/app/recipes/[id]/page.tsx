"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./detail.module.css";

// 임시 데이터 (나중에 API로 대체)
const mockRecipeDetail = {
  id: 1,
  title: "절대 실패없는 제육볶음 레시피",
  content: `1. 대파와 청양고추는 어슷썰어주고 양파는 1cm 두께로 썰어주세요

2. 냉장고에는 한국고기를 썰어주세요

3. 팬에이는 양념장을 고기와 섞어주세요 (냉장고에서 30분정도 숙성시켜 더 좋습니다)

4. 팬에 식용유 2큰술과 대파를 넣고 강불로 3분정도 볶아 파기름을 내주세요

5. 중불로 돌아 고기를 볶던 의식주세요~약 양념장으로 더 맛있습니다

6. 양파와 청양고추를 넣어주세요~

7. 강불로 2분정도 볶아주면 재료 뽀얀 완성~`,
  author: "작성자1",
  createdAt: "2025.12.10 14:30",
  imageUrl: "/images/recipe1.jpg",
  category: "한식",
  tags: ["매운맛", "돼지고기", "볶음"],
  mainIngredients: [
    { name: "돼지고기 앞다리살", amount: "600g" },
    { name: "양파", amount: "1/2개" },
    { name: "청양고추", amount: "2~3개" },
    { name: "대파", amount: "1/3개" },
  ],
  seasonings: [
    { name: "고추장", amount: "3큰술" },
    { name: "고춧가루", amount: "2큰술" },
    { name: "다진마늘", amount: "1큰술" },
    { name: "설탕", amount: "2큰술" },
    { name: "간장", amount: "1큰술" },
    { name: "통깨", amount: "약간" },
  ],
  averageRating: 4.5,
  totalRatings: 2,
};

const mockComments = [
  {
    id: 1,
    author: "사용자 1",
    rating: 5,
    content:
      "너무 맛있게먹었습니다. 제육볶음 레시피는 항상 이걸로 정착할거같아요.",
    createdAt: "2025.12.10",
    likes: 0,
  },
  {
    id: 2,
    author: "사용자 2",
    rating: 4,
    content:
      "맛있긴 한데, 저한테는 조금 맵네요. 매운걸 못드시면 청양고추는 1개만 넣어서 추천합니다.",
    createdAt: "2025.12.09",
    likes: 0,
  },
];

export default function RecipeDetailPage() {
  const [recipe] = useState(mockRecipeDetail);
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

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
            <span className={styles.author}>{recipe.author}</span>
            <span className={styles.date}>{recipe.createdAt}</span>
            <div className={styles.authorAvatar}>👨‍🍳</div>
          </div>
        </header>

        {/* 레시피 이미지 */}
        <div className={styles.imageSection}>
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            width={600}
            height={400}
            className={styles.recipeImage}
          />
        </div>

        {/* 재료 정보 */}
        <div className={styles.ingredientsSection}>
          <div className={styles.ingredientColumn}>
            <h3 className={styles.ingredientTitle}>[재료]</h3>
            {recipe.mainIngredients.map((ingredient, index) => (
              <div key={index} className={styles.ingredientItem}>
                <span className={styles.ingredientName}>{ingredient.name}</span>
                <span className={styles.ingredientAmount}>
                  {ingredient.amount}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.ingredientColumn}>
            <h3 className={styles.ingredientTitle}>[양념]</h3>
            {recipe.seasonings.map((seasoning, index) => (
              <div key={index} className={styles.ingredientItem}>
                <span className={styles.ingredientName}>{seasoning.name}</span>
                <span className={styles.ingredientAmount}>
                  {seasoning.amount}
                </span>
              </div>
            ))}
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
          {recipe.tags.map((tag, index) => (
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
              평점 {recipe.averageRating}
            </span>
            {renderStars(recipe.averageRating)}
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
