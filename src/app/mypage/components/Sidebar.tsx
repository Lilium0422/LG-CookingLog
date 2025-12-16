import css from '../css/Sidebar.module.css';

const Sidebar = () => {
  return (
    <div className={css.sidebar_con}>
      <aside className={css.sidebar}>
        <div className={css.profile}>
          <div className={css.profileImage}>
            <img src="/images/male-default-profile.svg" alt="프로필 사진" />
          </div>
          <h3 className={css.nickname}>홍길동 <span>님</span></h3>
          <p className={css.bio}>안녕하세요! 반갑습니다.</p>
        </div>
        
        <div className={css.actions}>
          <button className={css.actionButton}>
            로그아웃
          </button>
          <button className={`${css.actionButton} ${css.logoutButton}`}>
            회원정보 수정
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;