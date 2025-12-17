'use client';

import { useRouter } from 'next/navigation';
import css from '../css/CommentCard.module.css';

export interface CommentCardProps {
  id: number;
  postId: number;
  author: string;
  content: string;
  date: string;
  likeCount: number;
}

const CommentCard = ({
  postId,
  author,
  content,
  date,
  likeCount,
}: CommentCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/post/${postId}`);
  };

  return (
    <div className={css.cardCon} onClick={handleClick}>
      <div className={css.cardHead}>
        <div className={css.textWrapper}>
          <div className={css.author}>{author}</div>
          <div className={css.content}>{content}</div>
          <div className={css.time}>{date}</div>
        </div>
      </div>

      <div className={css.commentMeta}>
        <div className={css.heart}>
          <img src="/icon/heart-icon.svg" alt="좋아요" />
          <span>{likeCount}</span>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
