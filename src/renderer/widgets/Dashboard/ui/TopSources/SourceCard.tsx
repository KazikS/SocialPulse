import styles from "./SorceCard.module.scss";

type SourceCardProps = {
  name: string;
  count: number;
};

export const SourceCard = ({ name, count }: SourceCardProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.logo}>
        {/* TODO продумать как получать и хранить иконки конкретных источников */}
        <img src="/icon.svg" />
      </div>
      <div>
        <p className={styles.title}>{name}</p>
        <p className={styles.stats}>Количество публикаций {count}</p>
      </div>
    </div>
  );
};
