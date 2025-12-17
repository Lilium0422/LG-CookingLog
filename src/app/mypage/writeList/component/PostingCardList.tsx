'use client';

import PostingCard from './PostingCard';
import css from '../css/PostingCardList.module.css';

const PostingCardList = () => {
  // 🔹 임시 데이터 (나중에 API로 교체)
  const posts = [
    {
      id: 1,
      category: '한식',
      title: '맛있는 요리1',
      date: '2025.12.16',
      commentCount: 10,
      rating: 4.5,
      likeCount: 10,
    },
    {
      id: 2,
      category: '중식',
      title: '집에서 만드는 마파두부',
      date: '2025.12.15',
      commentCount: 3,
      rating: 4.2,
      likeCount: 7,
    },
    {
      id: 3,
      category: '양식',
      title: '파스타 제대로 만드는 법',
      date: '2025.12.14',
      commentCount: 20,
      rating: 4.8,
      likeCount: 33,
    },
  ];

  return (
    <section className={css.listContainer}>
      {posts.map((post) => (
        <PostingCard
          key={post.id}
          id={post.id}
          category={post.category}
          title={post.title}
          date={post.date}
          commentCount={post.commentCount}
          rating={post.rating}
          likeCount={post.likeCount}
        />
      ))}
    </section>
  );
};

export default PostingCardList;
