// 'use client';

// import { useState } from 'react';
// import css from '../css/EmailSection.module.css';

// const EmailSection = () => {
//   const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};

//   const [email, setEmail] = useState(user.email || '');
//   const [loading, setLoading] = useState(false);

//   const handleSave = async () => {
//     if (!email.trim()) return alert('이메일을 입력해주세요.');

//     try {
//       setLoading(true);

//       const res = await fetch(`https://after-ungratifying-lilyanna.ngrok-free.dev/api/users/${user.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });

//       if (!res.ok) throw new Error('저장 실패');

//       // 로컬 저장된 user 업데이트
//       const updatedUser = { ...user, email };
//       localStorage.setItem('user', JSON.stringify(updatedUser));

//       alert('이메일이 변경되었습니다.');
//     } catch (err) {
//       console.error(err);
//       alert('저장 중 오류가 발생했습니다.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={css.container}>
//       <h1>이메일 주소 변경</h1>

//       <section className={css.section}>
//         <h3>이메일 주소</h3>

//         <input
//           className={css.input}
//           type="email"
//           placeholder="ex@naver.com"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//       </section>

//       <button className={css.saveBtn} onClick={handleSave} disabled={loading}>
//         {loading ? '저장 중...' : '이메일 변경'}
//       </button>
//     </div>
//   );
// };

// export default EmailSection;
