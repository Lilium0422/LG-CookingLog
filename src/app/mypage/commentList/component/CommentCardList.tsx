'use client';

import React from 'react';
import CommentCard from './CommentCard';
import { CommentCardProps } from './CommentCard';
import css from '../css/CommentCardList.module.css';

interface CommentCardListProps {
  comments: CommentCardProps[];
}

const CommentCardList = ({ comments }: CommentCardListProps) => {
  return (
    <div className={css.list}>
      {comments.map(comment => (
        <CommentCard key={comment.id} {...comment} />
      ))}
    </div>
  );
};

export default CommentCardList;