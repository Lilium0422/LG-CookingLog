'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import css from './css/EditPage.module.css';
import NormalSection from './components/NormalSection';
import PasswordSection from './components/PasswordSection';
import DeleteModal from '../components/DeleteModal';

const Page = () => {
  const router = useRouter();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleDelete = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user?.id) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(`https://after-ungratifying-lilyanna.ngrok-free.dev/api/users/${user.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error("탈퇴 실패");

      // localStorage 삭제
      localStorage.removeItem('user');

      // 성공 모달 띄움
      setConfirmOpen(false);
      setSuccessOpen(true);

    } catch (err) {
      console.error(err);
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <div className={css.container}>
      <NormalSection />
      <PasswordSection />

      {/* 회원 탈퇴 버튼 */}
      <button className={css.deleteBtn} onClick={() => setConfirmOpen(true)}>
        회원 탈퇴
      </button>

      {/* 탈퇴 확인 모달 */}
      <DeleteModal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <div className={css.modalForm}>
          <div className={css.modalText}>
            <h3>정말로 탈퇴하실건가요?</h3>
            <p>탈퇴 후에는 복구가 불가능합니다.</p>
          </div>
          <div className={css.modalImg}>
            <img src='/images/crying-character.svg'/>
          </div>
        </div>
        <div className={css.modalButtons}>
          <button className={css.deleteBtnSmall} onClick={handleDelete}>예</button>
          <button className={css.cancelBtn} onClick={() => setConfirmOpen(false)}>아니요</button>
        </div>
      </DeleteModal>

      {/* 탈퇴 성공 모달 */}
      <DeleteModal open={successOpen} onClose={() => {}}>
        <div className={css.successWrapper}>
          <div className={css.successModal}>
            <h3>탈퇴 완료</h3>
            <p>회원 탈퇴가 정상적으로 처리되었습니다.</p>
          </div>

          <button
            className={css.okBtn}
            onClick={() => {
              setSuccessOpen(false);
              router.push('/login');
            }}
          >
            확인
          </button>
        </div>
      </DeleteModal>
    </div>
  );
};

export default Page;
