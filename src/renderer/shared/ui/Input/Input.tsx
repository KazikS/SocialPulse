import { clsx } from "clsx";
import { ImagePlus } from "lucide-react";
import { DragEvent, HTMLInputTypeAttribute, useEffect, useState } from "react";

import styles from "./Input.module.scss";

type InputProps = {
  type: HTMLInputTypeAttribute;
  placeholder: string;
  variant: "default" | "img";
  name?: string;
};

type PartialProps = Partial<InputProps>;

export const Input = ({
  type,
  placeholder,
  variant = "default",
  name,
}: PartialProps) => {
  const [overArea, setOverArea] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOverArea(true);
  };
  const handleDragExit = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOverArea(false);
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOverArea(false);
    setFile(e.dataTransfer.files[0]);
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    const url = URL.createObjectURL(file);
    const addPreview = () => {
      setPreview(url);
    };

    addPreview();

    return () => URL.revokeObjectURL(url);
  }, [file]);

  switch (variant) {
    case "default":
      return (
        <input
          type={type}
          placeholder={placeholder}
          className={styles.input}
          name={name}
        />
      );
    case "img":
      return (
        <div
          className={clsx(
            styles.fileInputWrapper,
            overArea ? styles.overArea : undefined,
          )}
          onDragEnter={handleDragEnter}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={handleDragExit}
          onDrop={handleDrop}
        >
          {file ? (
            <img
              src={preview}
              alt="source icon"
              id="sourceIcon"
              className={styles.preview}
            />
          ) : (
            <ImagePlus color="#8892a8" />
          )}
          <input
            type="file"
            className={styles.fileInput}
            name={name}
            accept="image/*"
          />
        </div>
      );
    default:
      break;
  }
};
