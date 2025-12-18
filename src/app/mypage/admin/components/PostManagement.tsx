'use client';

import { useEffect, useState } from 'react';
import css from '../css/PostManagement.module.css';

interface Post {
  id: number;
  title: string;
  author: string;
  createDate: string;
}

export default function PostManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');

  const API_URL = 'https://after-ungratifying-lilyanna.ngrok-free.dev/api/posts';

  /** 게시글 조회 */
  const fetchPosts = async () => {
    try {
      const res = await fetch(API_URL, {
        credentials: 'include', // 쿠키/세션 포함
      });

      if (!res.ok) {
        console.error('게시글 조회 실패, status:', res.status);
        setPosts([]); // 실패 시 빈 배열
        return;
      }

      const data: Post[] = await res.json();

      setPosts(data || []); // 안전하게 배열 처리
    } catch (err) {
      console.error('게시글 조회 에러:', err);
      setPosts([]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /** 게시글 삭제 */
  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        console.error('게시글 삭제 실패, status:', res.status);
        return;
      }

      fetchPosts(); // 삭제 후 재조회
    } catch (err) {
      console.error('게시글 삭제 에러:', err);
    }
  };

  // 검색 필터 적용
  const filteredPosts = posts.filter((p) => p.title.includes(search));

  return (
    <div className={css.container}>
      <h2>게시글 관리</h2>

      {/* 검색창 */}
      <input
        className={css.search}
        type="text"
        placeholder="제목 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 게시글 테이블 */}
      <table className={css.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.title}</td>
                <td>{post.author}</td>
                <td>{post.createDate}</td>
                <td>
                  <button className={css.deleteBtn} onClick={() => handleDelete(post.id)}>
                    삭제
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className={css.noData}>
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
