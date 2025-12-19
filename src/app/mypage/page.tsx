'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import css from './mypage.module.css';
import MainSection from './components/MainSection';

export default function MyPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      setIsAdmin(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      const role = parsed?.role;
      if (role === 'ADMIN') {
        setIsAdmin(true);
        router.replace('/mypage/admin');
      } else {
        setIsAdmin(false);
      }
    } catch {
      setIsAdmin(false);
    }
  }, [router]);

  // ADMIN이면 redirect 처리 중이라 화면 비워둠
  if (isAdmin === null || isAdmin === true) return null;

  // 일반 사용자 화면
  return (
    <div className={css.container}>
      <div className={css.main}>
        <MainSection />
      </div>
    </div>
  );
}
