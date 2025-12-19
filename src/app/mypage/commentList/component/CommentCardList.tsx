'use client';

import { useEffect, useState } from 'react';
import CommentCard, { CommentCardProps } from './CommentCard';
import css from '../css/CommentCardList.module.css';

interface CommentCardListProps {
  userId: string; // 조회할 사용자 닉네임
}

const CommentCardList = ({ userId }: CommentCardListProps) => {
  const [comments, setComments] = useState<CommentCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://after-ungratifying-lilyanna.ngrok-free.dev/api/users/${userId}/comments`,
        { credentials: 'include' }
      );

      if (!res.ok) {
        console.error('댓글 조회 실패, status:', res.status);
        setComments([]);
        setLoading(false);
        return;
      }

      const data: CommentCardProps[] = await res.json();
      setComments(data || []);
    } catch (err) {
      console.error('댓글 조회 에러:', err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserComments();
    }
  }, [userId]);

  if (loading) return <div className={css.loading}>댓글을 불러오는 중...</div>;
  if (comments.length === 0)
    return <div className={css.noData}>작성한 댓글이 없습니다.</div>;

  return (
    <div className={css.list}>
      {comments.map((comment) => (
        <CommentCard key={comment.id} {...comment} />
      ))}
    </div>
  );
};

export default CommentCardList;
