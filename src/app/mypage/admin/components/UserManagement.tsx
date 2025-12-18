'use client';

import { useEffect, useState } from "react";
import css from "../css/UserManagement.module.css";

interface User {
  id: number;
  userId: string;
  nickname: string;
  phoneNumber: string;
  role: string;
}

interface UserResponse {
  users: User[];       // users 필드에 배열이 들어옴
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const API_URL = "https://after-ungratifying-lilyanna.ngrok-free.dev/api/admin/users";

  /** 사용자 목록 조회 */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        size: String(size),
        sortBy: "id",
        sortDir: "desc",
      });

      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`${API_URL}?${params.toString()}`, {
        credentials: "include",
      });

      if (!res.ok) {
        console.error("사용자 목록 조회 실패, status:", res.status);
        setUsers([]);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      const data: UserResponse = await res.json();
      console.log("API 응답:", data); // 디버깅용

      setUsers(data.users || []); // content -> users로 변경
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("사용자 목록 조회 에러:", err);
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, size, search]);

  /** 사용자 삭제 */
  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        console.error("사용자 삭제 실패, status:", res.status);
        return;
      }

      fetchUsers();
    } catch (err) {
      console.error("사용자 삭제 에러:", err);
    }
  };

  if (loading) return <div className={css.loading}>사용자 목록을 불러오는 중...</div>;

  return (
    <div className={css.container}>
      <h2>회원 관리</h2>

      {/* 검색창 */}
      <input
        className={css.search}
        type="text"
        placeholder="닉네임, 아이디, 전화번호 검색"
        value={search}
        onChange={(e) => {
          setPage(0); // 검색 시 첫 페이지로 이동
          setSearch(e.target.value);
        }}
      />

      {/* 사용자 테이블 */}
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
          {users?.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.userId}</td>
                <td>{user.nickname}</td>
                <td>{user.phoneNumber || "-"}</td>
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
              <td colSpan={6} className={css.noData}>
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className={css.pagination}>
        <button disabled={page === 0} onClick={() => setPage((prev) => prev - 1)}>
          이전
        </button>

        <span>
          {page + 1} / {totalPages}
        </span>

        <button disabled={page + 1 === totalPages} onClick={() => setPage((prev) => prev + 1)}>
          다음
        </button>
      </div>
    </div>
  );
}
