import { motion, type MotionProps } from "motion/react";

type MotionBoxProps = {
  className?: string;
} & MotionProps;

export const MotionBox = ({
  children,
  className,
  ...props
}: MotionBoxProps) => {
  return (
    <motion.div className={className} {...props}>
      {children}
    </motion.div>
  );
};
