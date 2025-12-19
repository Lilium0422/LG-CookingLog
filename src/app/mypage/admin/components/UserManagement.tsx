'use client';

import { useEffect, useState, useMemo } from 'react';
import css from '../css/UserManagement.module.css';

interface User {
  id: number;
  userId: string;
  nickname: string;
  phoneNumber: string;
  role: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 페이지네이션 관련 (클라이언트 사이드에서 처리)
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const API_URL = 'https://after-ungratifying-lilyanna.ngrok-free.dev/api/admin/users';

  /** 사용자 목록 조회 (전체 혹은 초기 데이터) */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // PostManagement 방식처럼 전체 목록을 가져오거나 
      // 충분히 큰 사이즈를 가져와서 클라이언트에서 검색하도록 설정
      const params = new URLSearchParams({
        page: '0',
        size: '1000', // 전체 검색을 위해 범위를 크게 잡음
        sortBy: 'id',
        sortDir: 'desc',
      });

      const res = await fetch(`${API_URL}?${params.toString()}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        setUsers([]);
        return;
      }

      const data = await res.json();
      // API 응답 구조에 따라 data.users 또는 data를 설정
      setUsers(data.users || data || []);
    } catch (err) {
      console.error('사용자 목록 조회 에러:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /** 사용자 삭제 */
  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error('사용자 삭제 에러:', err);
    }
  };

  // [핵심] PostManagement 스타일의 클라이언트 필터링
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.userId.toLowerCase().includes(search.toLowerCase()) ||
      user.nickname.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  // 필터링된 결과에 따른 페이지네이션 계산
  const totalPages = Math.ceil(filteredUsers.length / size) || 1;
  const paginatedUsers = filteredUsers.slice(page * size, (page + 1) * size);

  return (
    <div className={css.container}>
      <h2>회원 관리</h2>

      {/* 검색창: 이제 입력해도 전체 UI가 사라지지 않음 */}
      <input
        className={css.search}
        type="text"
        placeholder="아이디 또는 닉네임 검색"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0); // 검색 시 첫 페이지로 이동
        }}
      />

      {loading && users.length === 0 ? (
        <div className={css.loading}>사용자 목록을 불러오는 중...</div>
      ) : (
        <>
          <table className={css.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>아이디</th>
                <th>닉네임</th>
                <th>전화번호</th>
                <th>역할</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.userId}</td>
                    <td>{user.nickname}</td>
                    <td>{user.phoneNumber || '-'}</td>
                    <td>{user.role}</td>
                    <td>
                      <button className={css.deleteBtn} onClick={() => handleDelete(user.id)}>
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={css.noData}>데이터가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          <div className={css.pagination}>
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>이전</button>
            <span>{page + 1} / {totalPages}</span>
            <button disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>다음</button>
          </div>
        </>
      )}
    </div>
  );
}