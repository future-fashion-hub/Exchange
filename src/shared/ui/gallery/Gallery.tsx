import React from "react";
import styles from "./Gallery.module.css";

type GalleryProps = {
  images?: string[];
  placeholder: string; // путь к фото-заглушке. Если указываете svg, то в конце дописать "...svg.?svg"
};

export const Gallery: React.FC<GalleryProps> = ({ images = [], placeholder }) => {
  const maxVisible = 4; // 1 большая + 3 маленькие
  const visibleImages = images.slice(0, maxVisible);
  const extraCount = images.length - maxVisible;

  const filledImages = [
    ...visibleImages,
    ...Array(Math.max(0, maxVisible - visibleImages.length)).fill(null),
  ];

  return (
    <div className={styles.galleryGrid}>
      {/* 1-я колонка (большая картинка) */}
      <div className={styles.mainWrapper}>
        <img
          src={filledImages[0] ? `/db/skills-photo/${filledImages[0]}` : placeholder}
          alt="Главная"
          className={styles.mainImage}
        />
      </div>

      {/* 2-я колонка (три маленьких квадрата) */}
      <div className={styles.smallImageWrapper}>
        {filledImages.slice(1, 4).map((img, i) => (
          <div key={i} className={styles.smallImages}>
            {extraCount > 0 && i === 2 ? (
              <>
              <div className={styles.moreOverlay}>+{extraCount}</div>
              <img
                src={img ? `/db/skills-photo/${img}` : placeholder}
                alt={`Миниатюра фото ${i + 1}`}
                className={styles.smallImage}
              />
              </>
            ) : (
              <img
                src={img ? `/db/skills-photo/${img}` : placeholder}
                alt={`Миниатюра фото ${i + 1}`}
                className={styles.smallImage}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
