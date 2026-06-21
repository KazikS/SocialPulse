import { MouseEvent, ReactNode } from "react";
import { createPortal } from "react-dom";

import styles from "./Dialog.module.scss";

type DialogProps = {
  open: boolean;
  children: ReactNode;
  onClose: () => void;
};

export const Dialog = ({ open, children, onClose }: DialogProps) => {
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!open) {
    return null;
  }
  return createPortal(
    <div className={styles.backdrop} onClick={(e) => handleBackdropClick(e)}>
      <div className={styles.content}>{children}</div>
    </div>,
    document.body,
  );
};
