'use client';

import { useState } from 'react';
import css from '../css/PasswordSection.module.css';

const PasswordSection = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  /* 비밀번호 조건 체크 */
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const validLength = password.length >= 8 && password.length <= 20;
  const isMatch = password && password === confirm;

  const isValid =
    hasUpperCase && hasSpecialChar && validLength && isMatch;

  const handleSave = async () => {
    if (!isValid) return;

    try {
      setLoading(true);

      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        alert('로그인 정보가 없습니다.');
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user.id;

      const res = await fetch(`https://after-ungratifying-lilyanna.ngrok-free.dev/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
        }),
      });

      if (!res.ok) throw new Error('비밀번호 변경 실패');

      alert('비밀번호가 변경되었습니다.');
      setPassword('');
      setConfirm('');
    } catch (err) {
      console.error(err);
      alert('비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css.container}>
      <h1 className={css.title}>비밀번호 설정</h1>

      {/* 비밀번호 */}
      <div className={css.formGroup}>
        <label className={css.label}>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호를 입력해주세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={css.input}
        />

        <ul className={css.rules}>
          <li className={hasUpperCase ? css.ok : ''}>
            대문자 포함
          </li>
          <li className={hasSpecialChar ? css.ok : ''}>
            특수문자 포함
          </li>
          <li className={validLength ? css.ok : ''}>
            8~20자 이내
          </li>
        </ul>
      </div>

      {/* 비밀번호 확인 */}
      <div className={css.formGroup}>
        <label className={css.label}>새 비밀번호 확인</label>
        <input
          type="password"
          placeholder="비밀번호를 한 번 더 입력해주세요."
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={css.input}
        />

        {confirm && (
          <p className={`${css.match} ${isMatch ? css.ok : css.error}`}>
            {isMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
          </p>
        )}

        <button
          className={css.saveBtn}
          disabled={!isValid || loading}
          onClick={handleSave}
        >
          {loading ? '변경 중...' : '비밀번호 설정'}
        </button>
      </div>
    </div>
  );
};

export default PasswordSection;
