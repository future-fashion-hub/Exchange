import React, { useState, ChangeEvent, DragEvent } from "react";
import styles from './DragDrop.module.css';
import galleryAddImg from '../../assets/icons/gallery-add.svg';

type DragDropProps = {
  onChange?: (files: File[]) => void;
   status?: "error" | "default";
};

export const DragDrop: React.FC<DragDropProps> = ({ onChange }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [, setDragActive] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const fileArray = Array.from(e.target.files);
      setFiles(fileArray);
      onChange?.(fileArray);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const fileArray = Array.from(e.dataTransfer.files);
      setFiles(fileArray);
      onChange?.(fileArray);
    }
  };

  return (
    <div className={`${styles.wrapper} ${status === "error" ? styles.error : ""}`}>
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label className={styles.label}>
          {files.length > 0 ? (
            <p>Выбранный файл: {files[0].name}</p>
          ) : (
            <p>Перетащите или выберите изображения навыка</p>
          )}
          <div className={styles.imageWrapper}>
            <img src={galleryAddImg} alt="иконка" className={styles.image}/>
            <span className={styles.imageText}>
              {files.length > 0 ? 'Изменить изображение' : 'Выбрать изображения'}
            </span>
          </div>
          <input
            className={styles.input}
            type="file"
            multiple={false}
            onChange={handleChange}
            accept={'.png, .jpg, .jpeg'}
          />
        </label>
      </div>
    </div>
  );
};
