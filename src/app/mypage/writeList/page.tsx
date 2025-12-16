import React from 'react';
import Sidebar from '../components/Sidebar';
import Tabs from '../components/Tabs';
import css from './css/writePage.module.css';

const page = () => {
  return (
    <div className={css.container}>
      <Sidebar />
      <Tabs />
      내가 쓴 글 페이지입니다.
    </div>
  );
};

export default page;