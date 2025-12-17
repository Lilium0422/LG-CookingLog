'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import css from '../css/Tabs.module.css';

const TABS = [
  {
    label: '내가 쓴 글',
    href: '/mypage/writeList',
    icon: '/icon/pen-icon.svg',
    activeIcon: '/icon/pen-icon-active.svg',
    width: 30,
    height: 30,
  },
  {
    label: '나의 댓글',
    href: '/mypage/commentList',
    icon: '/icon/comment-icon.svg',
    activeIcon: '/icon/comment-icon-active.svg',
    width: 26,
    height: 26,
  },
  {
    label: '프로필 관리',
    href: '/mypage',
    icon: '/icon/profileManagement-icon.svg',
    activeIcon: '/icon/profileManagement-icon-active.svg',
    width: 24,
    height: 24,
  },
];

const Tabs = () => {
  const pathname = usePathname();

  return (
    <div className={css.tabs}>
      {TABS.map(({ label, href, icon, activeIcon, width, height }) => {
        const isActive =
          href === '/mypage'
            ? pathname === '/mypage'
            : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={`${css.tabItem} ${isActive ? css.active : ''}`}
          >
            <div className={css.iconWrapper}>
              <Image
                src={icon}
                alt={label}
                width={width}
                height={height}
                className={css.icon}
              />
              <Image
                src={activeIcon}
                alt={label}
                width={width}
                height={height}
                className={css.iconActive}
              />
            </div>
            <span>{label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default Tabs;
