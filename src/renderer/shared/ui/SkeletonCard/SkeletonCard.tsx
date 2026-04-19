import { MotionBox } from "../MotionBox";
import styles from "./SkeletonCard.module.scss";

export const SkeletonCard = () => {
  return (
    <MotionBox
      className={styles.wrapper}
      animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
      transition={{ duration: 3, ease: "linear", repeat: Infinity }}
    />
  );
};
