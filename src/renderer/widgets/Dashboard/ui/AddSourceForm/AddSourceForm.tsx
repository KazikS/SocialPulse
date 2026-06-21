import { Platform, PlatformSlug } from "@shared/types/entites";
import { Info, LucideX } from "lucide-react";
import { useEffect, useState } from "react";

import { api } from "@/shared/api";
import { useAddSourceDialog } from "@/shared/store/store";
import { Button } from "@/shared/ui/Button";
import { Dialog } from "@/shared/ui/Dialog";
import { Input } from "@/shared/ui/Input";

import styles from "./AddSourceForm.module.scss";
import { PlatformItem } from "./PlatformItem";

export const AddSourceForm = () => {
  const { isOpen, close } = useAddSourceDialog();
  const [choosenPlatform, setChoosenPlatform] = useState<PlatformSlug | null>(
    null,
  );
  const [platfromsList, setPlatformList] = useState<Platform[]>([]);

  useEffect(() => {
    const fetchPlatforms = async () => {
      const response = await api.platforms.getAll();
      setPlatformList(response);
    };

    fetchPlatforms();
  }, []);

  const handleChoosePlatform = (slug: PlatformSlug) => {
    setChoosenPlatform(slug);
  };

  return (
    <Dialog open={isOpen} onClose={close}>
      <form className={styles.wrapper}>
        <div className={styles.header}>
          <div>
            <span className={styles.title}>Добавить источник</span>
            <p className={styles.subtitle}>Новый канал для мониторинга</p>
          </div>
          <button className={styles.closeBtn} onClick={close}>
            <LucideX color="#8892a8" />
          </button>
        </div>
        <div className={styles.platformSelector}>
          {platfromsList.map((platform) => (
            <div
              key={platform.slug}
              onClick={() => handleChoosePlatform(platform.slug)}
            >
              <PlatformItem
                name={platform.name}
                icon={platform.slug}
                isActive={choosenPlatform === platform.slug}
              />
            </div>
          ))}
        </div>
        <div className={styles.addIconBlock}>
          <Input type="text" variant="img" />
          <div className={styles.addIconDesc}>
            <span>Иконка источника</span>
            <p>
              PNG, JPG или WEBP до 5 МБ.
              <br />
              Если не выбрать - возьмем иконку платформы
            </p>
          </div>
        </div>
        <div className={styles.inputWithLabel}>
          <label htmlFor="sourceName">Название источника</label>
          <Input
            placeholder="Название источника..."
            type="text"
            name="sourceName"
          />
        </div>
        <div className={styles.inputWithLabel}>
          <label htmlFor="sourceLink">Ссылка на источник</label>
          <Input placeholder="Ссылка на источник..." type="text" />
          <span>
            <Info color="#8892a8" size={14} /> Публичная ссылка на канал или
            паблик
          </span>
        </div>
        <div className={styles.footer}>
          <Button variant="outline">Отмена</Button>
          <Button variant="solid">Добавить источник</Button>
        </div>
      </form>
    </Dialog>
  );
};
