import React from 'react';
import Sidebar from '../components/Sidebar';
import Tabs from '../components/Tabs';
import css from './css/commentPage.module.css';
import CommentCardList from './component/CommentCardList';

const page = () => {
  return (
    <div className={css.container}>
      <Sidebar />
      <div>
        <Tabs />
        <CommentCardList
          comments={[
            {
              id: 1,
              postId: 12,
              author: '사용자',
              content: '이 레시피 진짜 맛있어요!',
              date: '2025.12.16',
              likeCount: 5,
            },
            {
              id: 2,
              postId: 10,
              author: '종현',
              content: '한 번 더 만들어봐야겠네요',
              date: '2025.12.17',
              likeCount: 2,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default page;