'use client';

import React from 'react';
import css from '../css/DeleteModal.module.css'

const Modal = ({ open, onClose, children }: any) => {
  if (!open) return null;

  return (
    <div className={css.overlay} onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
