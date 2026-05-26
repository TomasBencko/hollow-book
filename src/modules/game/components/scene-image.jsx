import { useCallback, useEffect, useRef, useState } from 'react';

function isImageReady(img) {
  return img.complete && img.naturalHeight > 0;
}

export default function SceneImage({ imageUrl, isLoading, alt = 'Ilustrácia aktuálnej scény' }) {
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const markLoadedIfReady = useCallback(() => {
    const img = imgRef.current;
    if (img && isImageReady(img)) setLoaded(true);
  }, []);

  const handleImgRef = useCallback((node) => {
    imgRef.current = node;
    if (node && imageUrl && isImageReady(node)) setLoaded(true);
  }, [imageUrl]);

  useEffect(() => {
    setLoaded(false);
    markLoadedIfReady();
  }, [imageUrl, markLoadedIfReady]);

  const showSkeleton = !loaded || (isLoading && !imageUrl);

  return (
    <div className="scene-image-wrapper">
      <div
        className={`scene-image-skeleton${!showSkeleton ? ' scene-image-skeleton--hidden' : ''}`}
        aria-hidden="true"
      />
      {imageUrl && (
        <img
          ref={handleImgRef}
          className={`scene-image${loaded ? ' scene-image--loaded' : ''}`}
          src={imageUrl}
          alt={alt}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
}
