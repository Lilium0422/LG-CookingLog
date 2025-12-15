import React from 'react';
import Tabs from './Tabs';
import ProfileMainSection from './ProfileMainSection';
import css from '../css/ProfileMainSection.module.css'

const MainSection = () => {
  return (
    <div className={css.main}>
      <Tabs />
      <ProfileMainSection />
    </div>
  );
};

export default MainSection;