'use client';

import css from '../css/Sidebar.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchProfile } from '../api/profileApi';
import { ProfileData } from '../types/profile';

interface ProfileSummary {
  imageUrl: string;
  bio: string;
}

const DEFAULT_IMAGE = '/images/male-default-profile.svg';

const Sidebar = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  /* ======================
     초기 로드 (API)
  ====================== */
  useEffect(() => {
    fetchProfile().then(setProfile).catch(console.error);
  }, []);

  /* ======================
     localStorage 즉시 반영
  ====================== */
  useEffect(() => {
    const handler = () => {
      const raw = localStorage.getItem('profileSummary');
      if (!raw) return;

      const summary: ProfileSummary = JSON.parse(raw);

      setProfile(prev =>
        prev
          ? { ...prev, imageUrl: summary.imageUrl, bio: summary.bio }
          : prev
      );
    };

    window.addEventListener('profileUpdated', handler);
    return () => window.removeEventListener('profileUpdated', handler);
  }, []);

  // if (!profile) return null; 임시로 

  /* ======================
     로그아웃
  ====================== */
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userUpdated'));
    router.push('/home');
  };

  return (
    <div className={css.sidebar_con}>
      <aside className={css.sidebar}>
        <div className={css.profile}>
          <div className={css.profileImage}>
            <img
              src={profile?.imageUrl || DEFAULT_IMAGE}
              alt="프로필 사진"
            />
          </div>

          <h3 className={css.nickname}>
            {profile?.userId ?? '사용자'} <span>님</span>
          </h3>

          <p className={css.bio}>
            {profile?.bio || '소개글이 없습니다.'}
          </p>
        </div>

        <div className={css.actions}>
          <button
            className={css.actionButton}
            onClick={handleLogout}
          >
            로그아웃
          </button>

          <button
            className={`${css.actionButton} ${css.logoutButton}`}
            onClick={() => router.push('/mypage/edit')}
          >
            회원정보 수정
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
