import { useEffect, useState } from 'react';

export default function SceneImage({ imageUrl, isLoading, alt = 'Ilustrácia aktuálnej scény' }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [imageUrl]);

  const showSkeleton = !loaded || (isLoading && !imageUrl);

  return (
    <div className="scene-image-wrapper">
      <div
        className={`scene-image-skeleton${!showSkeleton ? ' scene-image-skeleton--hidden' : ''}`}
        aria-hidden="true"
      />
      {imageUrl && (
        <img
          className={`scene-image${loaded ? ' scene-image--loaded' : ''}`}
          src={imageUrl}
          alt={alt}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
}
