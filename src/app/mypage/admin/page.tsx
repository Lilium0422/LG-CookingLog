'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminTabs from './components/AdminTabs';
import css from './css/Admin.module.css';

export default function AdminPage() {
  const router = useRouter();

  // role 체크
  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (!raw) {
      router.push('/home');
      return;
    }

    const user = JSON.parse(raw);

    if (user.role !== 'ADMIN') {
      alert('관리자만 접근 가능합니다.');
      router.push('/mypage');
    }
  }, []);

  return (
    <div className={css.adminContainer}>
      <h1>관리자 페이지</h1>
      <AdminTabs />
    </div>
  );
}
