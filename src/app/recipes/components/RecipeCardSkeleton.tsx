import styles from "./RecipeCardSkeleton.module.css";

interface RecipeCardSkeletonProps {
  index?: number; // 애니메이션 지연을 위한 인덱스
}

export default function RecipeCardSkeleton({
  index = 0,
}: RecipeCardSkeletonProps) {
  return (
    <div
      className={styles.skeletonCard}
      style={{
        animationDelay: `${index * 0.05}s`, // 더 부드러운 순차 로딩
      }}
    >
      {/* 이미지 스켈레톤 */}
      <div className={styles.skeletonImage}></div>

      {/* 콘텐츠 스켈레톤 */}
      <div className={styles.skeletonContent}>
        {/* 제목 */}
        <div className={styles.skeletonTitle}></div>

        {/* 설명 (2줄) */}
        <div className={styles.skeletonDescription}>
          <div className={styles.skeletonLine}></div>
          <div className={styles.skeletonLineShort}></div>
        </div>

        {/* 별점과 카테고리 */}
        <div className={styles.skeletonInfo}>
          <div className={styles.skeletonRating}></div>
          <div className={styles.skeletonCategory}></div>
        </div>

        {/* 해시태그들 */}
        <div className={styles.skeletonHashtags}>
          <div className={styles.skeletonHashtag}></div>
          <div className={styles.skeletonHashtag}></div>
          <div className={styles.skeletonHashtagShort}></div>
        </div>

        {/* 작성자 정보 */}
        <div className={styles.skeletonAuthor}>
          <div className={styles.skeletonDate}></div>
          <div className={styles.skeletonAuthorName}></div>
        </div>
      </div>
    </div>
  );
}
