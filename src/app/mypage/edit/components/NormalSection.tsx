'use client';

import { useEffect, useState } from 'react';
import css from '../css/NormalSection.module.css';

interface LocalUser {
  id: number;
  nickname: string;
  phoneNumber: string;
}

const NormalSection = () => {
  const [userId, setUserId] = useState<number | null>(null);

  const [form, setForm] = useState({
    nickname: '',
    phoneNumber: '',
  });

  const [loading, setLoading] = useState(false);

  /* =====================
     localStorage에서 user 불러오기
  ====================== */
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    const user: LocalUser = JSON.parse(storedUser);

    // ✅ id는 API path에 사용
    setUserId(user.id);

    // ✅ 수정 대상 필드만 세팅
    setForm({
      nickname: user.nickname ?? '',
      phoneNumber: user.phoneNumber ?? '',
    });
  }, []);

  /* 입력 변경 */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /* 저장 */
  const handleSave = async () => {
    if (!userId) {
      alert('사용자 정보를 불러올 수 없습니다.');
      return;
    }

    try {
      setLoading(true);

      // ✅ nickname, phoneNumber만 전송
      const res = await fetch(`https://after-ungratifying-lilyanna.ngrok-free.dev/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname: form.nickname,
          phoneNumber: form.phoneNumber,
        }),
      });

      if (!res.ok) {
        throw new Error('저장 실패');
      }

      /* =====================
         localStorage도 최신 값으로 업데이트
      ====================== */
      const storedUser = JSON.parse(localStorage.getItem('user')!);

      localStorage.setItem(
        'user',
        JSON.stringify({
          ...storedUser,
          nickname: form.nickname,
          phoneNumber: form.phoneNumber,
        })
      );

      alert('회원 정보가 저장되었습니다.');
    } catch (error) {
      console.error(error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css.container}>
      <h1>회원 정보</h1>

      <section className={css.main}>
        <h3 className={css.title}>
          기본 정보
        </h3>
        <h4>닉네임</h4>
        <input
          type="text"
          name="nickname"
          value={form.nickname}
          onChange={handleChange}
        />

        <h4>휴대폰 번호</h4>
        <input
          type="text"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
        />
        
        <button onClick={handleSave} disabled={loading}>
          {loading ? '저장 중...' : '저장'}
        </button>
      </section>

    </div>
  );
};

export default NormalSection;
