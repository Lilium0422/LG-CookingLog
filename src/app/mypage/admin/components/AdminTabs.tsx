'use client';

import { useState } from 'react';
import css from '../css/AdminTabs.module.css';
import UserManagement from '../components/UserManagement'
import PostManagement from '../components/PostManagement';

const AdminTabs = () => {
  const [tab, setTab] = useState<'users' | 'posts'>('users');

  return (
    <div className={css.wrapper}>
      <div className={css.tabs}>
        <button
          className={tab === 'users' ? css.active : ''}
          onClick={() => setTab('users')}
        >
          회원 관리
        </button>

        <button
          className={tab === 'posts' ? css.active : ''}
          onClick={() => setTab('posts')}
        >
          게시글 관리
        </button>
      </div>

      <div className={css.content}>
        {tab === 'users' && <UserManagement />}
        {tab === 'posts' && <PostManagement />}
      </div>
    </div>
  );
};

export default AdminTabs;
