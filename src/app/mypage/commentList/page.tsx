import React from 'react';
import Sidebar from '../components/Sidebar';
import Tabs from '../components/Tabs';
import css from './css/commentPage.module.css';

const page = () => {
  return (
    <div className={css.container}>
      <Sidebar />
      <Tabs />
      나의 댓글 페이지입니다.
    </div>
  );
};

export default page;