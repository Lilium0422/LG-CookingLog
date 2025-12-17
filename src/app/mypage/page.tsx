'use client';

import { useState } from 'react';
import css from './mypage.module.css';
import Sidebar from './components/Sidebar';
import MainSection from './components/MainSection';

export default function MyPage() {

  return (
    <div className={css.container}>
      <Sidebar />
      {/* 메인 콘텐츠 */}
      <div className={css.main}>
        <MainSection />
      </div>
    </div>
  );
}