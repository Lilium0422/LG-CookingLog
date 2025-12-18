'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './components/Sidebar';
import css from './css/MypageLayout.module.css';

export default function MypageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // /mypage/edit 일 때만 Sidebar 숨김
  const hideSidebar = pathname.startsWith('/mypage/edit');

  return (
    <div className={hideSidebar ? css.noSidebarContainer : css.container}>
      {!hideSidebar && <Sidebar />}
      <div className={css.content}>{children}</div>
    </div>
  );
}
