import React from 'react';
import Sidebar from '../components/Sidebar';
import Tabs from '../components/Tabs';
import css from './css/writePage.module.css';
import PostingCardList from './component/PostingCardList';

const page = () => {
  return (
    <div className={css.container}>
      <Sidebar />
      <div>
        <Tabs />
        <PostingCardList />
      </div>
    </div>
  );
};

export default page;