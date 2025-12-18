"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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

// 댓글 타입 (백엔드 API 응답에 맞춤)
interface Comment {
  id: number;
  content: string;
  postId: number;
  userNickname: string;
  userProfileImageUrl: string;
  rating: number;
  likeCount: number;
  isLikedByUser: boolean;
  parentCommentId: number | null;
  replies: Comment[];
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

// 댓글 별점 평균 계산 함수 (대댓글 제외)
const calculateAverageRating = (comments: Comment[]) => {
  if (!comments || comments.length === 0) {
    return 0;
  }

  // 대댓글이 아닌 일반 댓글만 필터링 (parentCommentId가 null인 것)
  const mainComments = comments.filter(
    (comment) => comment.parentCommentId === null && comment.rating > 0
  );

  if (mainComments.length === 0) {
    return 0;
  }

  const sum = mainComments.reduce((acc, comment) => acc + comment.rating, 0);
  return Math.round((sum / mainComments.length) * 10) / 10; // 소수점 첫째자리까지
};

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = params.id;

  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 대댓글 관련 상태
  const [replyingTo, setReplyingTo] = useState<number | null>(null); // 답글 달고 있는 댓글 ID
  const [replyContent, setReplyContent] = useState("");

  // 댓글 수정 관련 상태
  const [editingComment, setEditingComment] = useState<number | null>(null); // 수정 중인 댓글 ID
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(0);

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const data = JSON.parse(userData);
      const nickname = data.user?.nickname || data.nickname || "";
      setCurrentUser(nickname);
    }
  }, []);

  // 댓글 목록 가져오기 (useCallback으로 메모이제이션)
  const fetchComments = useCallback(async () => {
    if (!recipeId) return;

    setCommentsLoading(true);
    try {
      const response = await fetch(
        `https://after-ungratifying-lilyanna.ngrok-free.dev/api/posts/${recipeId}/comments`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            ...(currentUser && { "User-Nickname": currentUser }), // 로그인한 경우에만 헤더 추가
          },
        }
      );
      if (response.ok) {
        const data: Comment[] = await response.json();
        console.log("댓글 데이터:", data); // 디버깅용
        console.log("현재 사용자:", currentUser); // 디버깅용
        // 각 댓글의 좋아요 상태 로그
        data.forEach((comment) => {
          console.log(
            `댓글 ${comment.id}: 좋아요 ${comment.likeCount}개, 내가 좋아요 했나? ${comment.isLikedByUser}`
          );
        });
        setComments(data);
      } else {
        console.error("댓글 조회 실패:", response.status, response.statusText);
        const errorText = await response.text();
        console.error("댓글 에러 응답:", errorText);
      }
    } catch (error) {
      console.error("댓글 목록 조회 실패:", error);
    } finally {
      setCommentsLoading(false);
    }
  }, [recipeId, currentUser]);

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
          console.log("레시피 데이터:", data); // 디버깅용
          setRecipe(data);
        } else {
          console.error(
            "레시피 조회 실패:",
            response.status,
            response.statusText
          );
          const errorText = await response.text();
          console.error("에러 응답:", errorText);
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

  // 게시글 좋아요 상태 조회
  const fetchPostLikeStatus = useCallback(async () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      const token = localStorage.getItem("token"); // 토큰은 별도 키로 저장됨
      const response = await fetch(
        `https://after-ungratifying-lilyanna.ngrok-free.dev/api/likes/status/${recipeId}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
        setLikeCount(data.likeCount);
      }
    } catch (error) {
      console.error("게시글 좋아요 상태 조회 실패:", error);
    }
  }, [recipeId]);

  // 댓글 목록 가져오기 (별도 useEffect)
  useEffect(() => {
    if (recipeId) {
      fetchComments();
      fetchPostLikeStatus(); // 게시글 좋아요 상태도 함께 가져오기
    }
  }, [recipeId, fetchComments, fetchPostLikeStatus]);

  // 본인 글인지 확인
  const isOwner = recipe && currentUser && recipe.userNickname === currentUser;

  // 글 수정
  const handleEdit = () => {
    router.push(`/recipes/${recipeId}/edit`);
  };

  // 글 삭제
  const handleDelete = async () => {
    if (!window.confirm("정말로 이 레시피를 삭제하시겠습니까?")) {
      return;
    }

    try {
      const userData = localStorage.getItem("user");
      const token = userData ? JSON.parse(userData).token : "";

      const response = await fetch(
        `https://after-ungratifying-lilyanna.ngrok-free.dev/api/posts/${recipeId}`,
        {
          method: "DELETE",
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("레시피가 삭제되었습니다.");
        router.push("/recipes");
      } else {
        throw new Error("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("레시피 삭제 실패:", error);
      alert("레시피 삭제 중 오류가 발생했습니다.");
    }
  };

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
  const handleCommentSubmit = async () => {
    if (!newComment.trim() || newRating === 0) {
      alert("댓글과 별점을 모두 입력해주세요.");
      return;
    }

    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(
        `https://after-ungratifying-lilyanna.ngrok-free.dev/api/posts/${recipeId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            "User-Nickname": currentUser,
          },
          body: JSON.stringify({
            content: newComment,
            rating: newRating,
            parentCommentId: null,
            likeCount: 0,
          }),
        }
      );

      if (response.ok) {
        const newCommentData: Comment = await response.json();
        setComments([...comments, newCommentData]);
        setNewComment("");
        setNewRating(0);
        // alert 제거 - 자연스럽게 댓글이 추가됨
      } else {
        throw new Error("댓글 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      alert("댓글 작성 중 오류가 발생했습니다.");
    }
  };

  // 대댓글 작성
  const handleReplySubmit = async (parentCommentId: number) => {
    console.log("대댓글 작성 시작:", {
      parentCommentId,
      replyContent,
      currentUser,
    });

    if (!replyContent.trim()) {
      alert("답글 내용을 입력해주세요.");
      return;
    }

    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(
        `https://after-ungratifying-lilyanna.ngrok-free.dev/api/posts/${recipeId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            "User-Nickname": currentUser,
          },
          body: JSON.stringify({
            content: replyContent,
            rating: 1, // 대댓글은 기본 별점 1점 (백엔드 필수 필드)
            parentCommentId: parentCommentId,
            likeCount: 0, // 임시: 백엔드에서 처리할 때까지
          }),
        }
      );

      if (response.ok) {
        const newReplyData = await response.json();
        console.log("대댓글 작성 성공:", newReplyData);

        // 댓글 목록을 다시 가져와서 대댓글이 포함된 최신 상태로 업데이트
        try {
          await fetchComments();
          setReplyContent("");
          setReplyingTo(null);
          // alert 제거 - 자연스럽게 답글이 추가됨
        } catch (fetchError) {
          console.error("댓글 목록 새로고침 실패:", fetchError);
          // 새로고침 실패해도 폼은 초기화
          setReplyContent("");
          setReplyingTo(null);
          alert("답글 작성 중 오류가 발생했습니다. 페이지를 새로고침해주세요.");
        }
      } else {
        const errorText = await response.text();
        console.error(
          "답글 작성 실패:",
          response.status,
          response.statusText,
          errorText
        );
        throw new Error(`답글 작성에 실패했습니다: ${response.status}`);
      }
    } catch (error) {
      console.error("답글 작성 실패:", error);
      alert("답글 작성 중 오류가 발생했습니다.");
    }
  };

  // 답글 취소
  const handleReplyCancel = () => {
    setReplyingTo(null);
    setReplyContent("");
  };

  // 댓글 수정
  const handleEditStart = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
    setEditRating(comment.rating);
  };

  // 댓글 수정 취소
  const handleEditCancel = () => {
    setEditingComment(null);
    setEditContent("");
    setEditRating(0);
  };

  // 댓글 수정 완료
  const handleEditSubmit = async (commentId: number) => {
    if (!editContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(
        `https://after-ungratifying-lilyanna.ngrok-free.dev/api/posts/${recipeId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            "User-Nickname": currentUser,
          },
          body: JSON.stringify({
            content: editContent,
            rating: editRating,
          }),
        }
      );

      if (response.ok) {
        // 댓글 목록을 다시 가져와서 수정된 내용 반영
        await fetchComments();
        setEditingComment(null);
        setEditContent("");
        setEditRating(0);
      } else {
        const errorText = await response.text();
        console.error(
          "댓글 수정 실패:",
          response.status,
          response.statusText,
          errorText
        );
        throw new Error(`댓글 수정에 실패했습니다: ${response.status}`);
      }
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  // 댓글 삭제
  const handleCommentDelete = async (commentId: number) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      return;
    }

    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(
        `https://after-ungratifying-lilyanna.ngrok-free.dev/api/posts/${recipeId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "User-Nickname": currentUser,
          },
        }
      );

      if (response.ok) {
        // 댓글 목록을 다시 가져와서 삭제된 댓글 제거
        await fetchComments();
      } else {
        const errorText = await response.text();
        console.error(
          "댓글 삭제 실패:",
          response.status,
          response.statusText,
          errorText
        );
        throw new Error(`댓글 삭제에 실패했습니다: ${response.status}`);
      }
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  // 게시글 좋아요 토글
  const handlePostLike = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        alert("로그인이 필요합니다.");
        return;
      }

      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://after-ungratifying-lilyanna.ngrok-free.dev/api/likes/toggle/${recipeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setIsLiked(result.liked);
        setLikeCount(result.likeCount);
      } else {
        throw new Error("좋아요 처리에 실패했습니다.");
      }
    } catch (error) {
      console.error("게시글 좋아요 실패:", error);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  // 댓글 좋아요 토글
  const handleCommentLike = async (commentId: number) => {
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(
        `https://after-ungratifying-lilyanna.ngrok-free.dev/api/posts/${recipeId}/comments/${commentId}/like`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "User-Nickname": currentUser,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        // 댓글 목록에서 해당 댓글의 좋아요 상태 업데이트
        setComments(
          comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  likeCount: result.likeCount,
                  isLikedByUser: result.isLiked,
                }
              : comment
          )
        );
      } else {
        throw new Error("좋아요 처리에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 좋아요 실패:", error);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
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
              onClick={handlePostLike}
            >
              {isLiked ? "♥" : "♡"} {likeCount}
            </button>
          </div>
          <div className={styles.authorInfo}>
            <span className={styles.author}>{recipe.userNickname}</span>
            <span className={styles.date}>{formatDate(recipe.createdAt)}</span>
          </div>
        </header>

        {/* 레시피 이미지 */}
        <div className={styles.imageSection}>
          {recipe.imageUrl ? (
            <img
              src={
                recipe.imageUrl && recipe.imageUrl.startsWith("/uploads")
                  ? `https://after-ungratifying-lilyanna.ngrok-free.dev${recipe.imageUrl}`
                  : recipe.imageUrl
              }
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

        {/* 액션 버튼들 */}
        <div className={styles.actionSection}>
          <button
            className={styles.backButton}
            onClick={() => window.history.back()}
          >
            목록으로
          </button>

          {/* 본인 글인 경우에만 수정/삭제 버튼 표시 */}
          {isOwner && (
            <div className={styles.ownerActions}>
              <button className={styles.editButton} onClick={handleEdit}>
                수정
              </button>
              <button className={styles.deleteButton} onClick={handleDelete}>
                삭제
              </button>
            </div>
          )}
        </div>

        {/* 댓글 섹션 */}
        <div className={styles.commentsSection}>
          {/* 평점 표시 */}
          <div className={styles.ratingHeader}>
            {(() => {
              const avgRating = calculateAverageRating(comments);
              return (
                <>
                  <span className={styles.averageRating}>
                    {avgRating > 0 ? `평점 ${avgRating}` : "별점 없음"}
                  </span>
                  {avgRating > 0 && renderStars(avgRating)}
                </>
              );
            })()}
          </div>

          {/* 댓글 목록 */}
          <div className={styles.commentsList}>
            {commentsLoading ? (
              <p>댓글을 불러오는 중...</p>
            ) : comments.length === 0 ? (
              <p>첫 번째 댓글을 작성해보세요!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className={styles.commentItem}>
                  <div className={styles.commentHeader}>
                    <div className={styles.commentAuthor}>
                      <div className={styles.commentAvatar}>
                        {comment.userProfileImageUrl ? (
                          <img
                            src={comment.userProfileImageUrl}
                            alt={`${comment.userNickname} 프로필`}
                            className={styles.profileImage}
                            onError={(e) => {
                              // 이미지 로드 실패시 기본 아바타로 대체
                              e.currentTarget.style.display = "none";
                              const nextElement = e.currentTarget
                                .nextElementSibling as HTMLElement;
                              if (nextElement) {
                                nextElement.style.display = "flex";
                              }
                            }}
                          />
                        ) : null}
                        <div
                          className={styles.defaultAvatar}
                          style={{
                            display: comment.userProfileImageUrl
                              ? "none"
                              : "flex",
                          }}
                        >
                          👨‍🍳
                        </div>
                      </div>
                      <div className={styles.commentAuthorInfo}>
                        <span className={styles.commentAuthorName}>
                          {comment.userNickname}
                        </span>
                        {renderStars(comment.rating)}
                      </div>
                    </div>
                    <div className={styles.commentActions}>
                      <span className={styles.commentDate}>
                        {formatDate(comment.createdAt)}
                      </span>
                      <div className={styles.commentButtons}>
                        {/* 본인 댓글인 경우에만 수정/삭제 버튼 표시 */}
                        {currentUser === comment.userNickname && (
                          <>
                            <button
                              className={styles.editCommentBtn}
                              onClick={() => handleEditStart(comment)}
                            >
                              수정
                            </button>
                            <button
                              className={styles.deleteCommentBtn}
                              onClick={() => handleCommentDelete(comment.id)}
                            >
                              삭제
                            </button>
                          </>
                        )}
                        <button
                          className={`${styles.commentLike} ${
                            comment.isLikedByUser ? styles.liked : ""
                          }`}
                          onClick={() => handleCommentLike(comment.id)}
                        >
                          {comment.isLikedByUser ? "♥" : "♡"}{" "}
                          {comment.likeCount}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 댓글 내용 또는 수정 폼 */}
                  {editingComment === comment.id ? (
                    <div className={styles.editForm}>
                      <div className={styles.editRatingInput}>
                        <span>별점: </span>
                        {renderStars(editRating, true, setEditRating)}
                      </div>
                      <textarea
                        className={styles.editTextarea}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <div className={styles.editActions}>
                        <button
                          className={styles.editCancelBtn}
                          onClick={handleEditCancel}
                        >
                          취소
                        </button>
                        <button
                          className={styles.editSubmitBtn}
                          onClick={() => handleEditSubmit(comment.id)}
                        >
                          수정 완료
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className={styles.commentContent}>{comment.content}</p>
                  )}

                  {/* 답글 달기 버튼 */}
                  <div className={styles.commentFooter}>
                    <button
                      className={styles.replyButton}
                      onClick={() => setReplyingTo(comment.id)}
                    >
                      답글 달기
                    </button>
                  </div>

                  {/* 대댓글 작성 폼 */}
                  {replyingTo === comment.id && (
                    <div className={styles.replyForm}>
                      <textarea
                        className={styles.replyTextarea}
                        placeholder="답글을 작성해주세요"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <div className={styles.replyActions}>
                        <button
                          className={styles.replyCancelBtn}
                          onClick={handleReplyCancel}
                        >
                          취소
                        </button>
                        <button
                          className={styles.replySubmitBtn}
                          onClick={() => handleReplySubmit(comment.id)}
                        >
                          답글 작성
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 대댓글 표시 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className={styles.repliesList}>
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className={styles.replyItem}>
                          <div className={styles.commentHeader}>
                            <div className={styles.commentAuthor}>
                              <div className={styles.commentAvatar}>
                                {reply.userProfileImageUrl ? (
                                  <img
                                    src={reply.userProfileImageUrl}
                                    alt={`${reply.userNickname} 프로필`}
                                    className={styles.profileImage}
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                      const nextElement = e.currentTarget
                                        .nextElementSibling as HTMLElement;
                                      if (nextElement) {
                                        nextElement.style.display = "flex";
                                      }
                                    }}
                                  />
                                ) : null}
                                <div
                                  className={styles.defaultAvatar}
                                  style={{
                                    display: reply.userProfileImageUrl
                                      ? "none"
                                      : "flex",
                                  }}
                                >
                                  👨‍🍳
                                </div>
                              </div>
                              <div className={styles.commentAuthorInfo}>
                                <span className={styles.commentAuthorName}>
                                  {reply.userNickname}
                                </span>
                              </div>
                            </div>
                            <div className={styles.commentActions}>
                              <span className={styles.commentDate}>
                                {formatDate(reply.createdAt)}
                              </span>
                              <div className={styles.commentButtons}>
                                {/* 본인 대댓글인 경우에만 수정/삭제 버튼 표시 */}
                                {currentUser === reply.userNickname && (
                                  <>
                                    <button
                                      className={styles.editCommentBtn}
                                      onClick={() => handleEditStart(reply)}
                                    >
                                      수정
                                    </button>
                                    <button
                                      className={styles.deleteCommentBtn}
                                      onClick={() =>
                                        handleCommentDelete(reply.id)
                                      }
                                    >
                                      삭제
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* 대댓글 내용 또는 수정 폼 */}
                          {editingComment === reply.id ? (
                            <div className={styles.editForm}>
                              {/* 대댓글은 별점 수정 없음 */}
                              <textarea
                                className={styles.editTextarea}
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                              />
                              <div className={styles.editActions}>
                                <button
                                  className={styles.editCancelBtn}
                                  onClick={handleEditCancel}
                                >
                                  취소
                                </button>
                                <button
                                  className={styles.editSubmitBtn}
                                  onClick={() => handleEditSubmit(reply.id)}
                                >
                                  수정 완료
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className={styles.commentContent}>
                              {reply.content}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
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
