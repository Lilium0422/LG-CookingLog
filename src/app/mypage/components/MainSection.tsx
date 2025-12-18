'use client';

import { useEffect, useState } from 'react';
import Tabs from './Tabs';
import ProfileMainSection from './ProfileMainSection';
import css from '../css/ProfileMainSection.module.css';

const MainSection = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      const userRole = parsed?.user?.role ?? null;
      setRole(userRole);
    } catch {
      setRole(null);
    }
  }, []);

  return (
    <div className={css.main}>
      {/* ADMIN이 아닐 때만 Tabs 보이기 */}
      {role !== 'ADMIN' && <Tabs />}

      <ProfileMainSection />
    </div>
  );
};

export default MainSection;