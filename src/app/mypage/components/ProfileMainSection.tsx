'use client';

import React, { useRef, useState, useEffect } from 'react';
import css from '../css/ProfileMainSection.module.css';
import CookingSurvey from './CookingSurvey';
import { COOKING_SURVEY } from '../data/cookingSurvey';
import { fetchProfile, updateProfile } from '../api/profileApi';
import { ProfileData } from '../types/profile';

const MAX_SIZE = 5 * 1024 * 1024;
const DEFAULT_IMAGE = '/images/male-default-profile.svg';

const ProfileMainSection = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [original, setOriginal] = useState<ProfileData | null>(null);
  const [form, setForm] = useState<ProfileData>({
    imageUrl: DEFAULT_IMAGE,
    bio: '',
    survey: {},
  });

  // UI용 미리보기
  const [preview, setPreview] = useState(DEFAULT_IMAGE);

  /* ======================
     초기 데이터 로드
  ======================= */
  useEffect(() => {
    fetchProfile().then(data => {
      setOriginal(data);
      setForm(data);
      setPreview(data.imageUrl);
    });
  }, []);

  /* ======================
     핸들러
  ======================= */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE) {
      alert('5MB 이하의 이미지만 업로드할 수 있습니다.');
      return;
    }

    setPreview(URL.createObjectURL(file));
  };

  const handleBioChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, bio: e.target.value }));
  };

  const handleSurveyChange = (survey: ProfileData['survey']) => {
    setForm(prev => ({ ...prev, survey }));
  };

  const handleSave = async () => {
    try {
      const res = await updateProfile({
        bio: form.bio,
        survey: form.survey,
        imageFile: fileInputRef.current?.files?.[0],
      });

      setOriginal(res);
      setForm(res);
      setPreview(res.imageUrl);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      alert('저장되었습니다');
    } catch {
      alert('저장에 실패했습니다');
    }
  };

  const handleCancel = () => {
    if (!original) return;

    setForm(original);
    setPreview(original.imageUrl);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /* ======================
     렌더링
  ======================= */
  return (
    <main className={css.container}>
      {/* 프로필 사진 */}
      <div className={css.imageContainer}>
        <h4><span>●</span> 프로필 사진</h4>

        <div className={css.profileImage}>
          <img src={preview} alt="프로필 이미지" />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={css.hiddenInput}
        />

        <label
          className={css.profileAttach}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className={css.profileAttachText}>
            5MB 이하의 이미지를 업로드 해주세요
          </div>
          <span>파일첨부</span>
        </label>
      </div>

      {/* 소개글 */}
      <div className={css.bioContainer}>
        <h4><span>●</span> 프로필 소개글</h4>
        <div className={css.bioCard}>
          <textarea
            placeholder="소개글을 입력해주세요"
            maxLength={150}
            value={form.bio}
            onChange={handleBioChange}
          />
          <div className={css.bioFooter}>
            <span>{form.bio.length} / 150</span>
          </div>
        </div>
      </div>

      {/* 요리 프로필 */}
      <div className={css.cookingProfile}>
        <h4><span>●</span> 요리 프로필</h4>
        <p>
          여러분의 더 나은 요리 경험을 위해 요리 프로필을 입력해 주세요.
        </p>
      </div>

      {/* 설문 */}
      <div className={css.survey}>
        <CookingSurvey
          questions={COOKING_SURVEY}
          value={form.survey}
          onChange={handleSurveyChange}
        />
      </div>

      {/* 버튼 */}
      <div className={css.footerBtn}>
        <button className={css.cancelBtn} onClick={handleCancel}>
          취소하기
        </button>
        <button className={css.saveBtn} onClick={handleSave}>
          저장하기
        </button>
      </div>
    </main>
  );
};

export default ProfileMainSection;
