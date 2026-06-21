import { clsx } from "clsx";

import { PeriodVariants } from "../../lib/types";
import styles from "./PeriodSwitcher.module.scss";

type Option = {
  value: PeriodVariants;
  label: string;
};

type Props = {
  value: PeriodVariants;
  onChange: (value: PeriodVariants) => void;
  options: Option[];
};

export const PeriodSwitcher = ({ value, onChange, options }: Props) => {
  return (
    <div className={styles.wrapper}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={clsx(styles.variant, {
            [styles.active]: value === option.value,
          })}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
