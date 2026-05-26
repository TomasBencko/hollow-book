export default function SceneImage({ imageUrl, isLoading, alt = 'Ilustrácia aktuálnej scény' }) {
  if (isLoading && !imageUrl) {
    return <div className="scene-image-skeleton" aria-hidden="true" />;
  }

  if (!imageUrl) {
    return <div className="scene-image" aria-hidden="true" />;
  }

  return (
    <img
      className="scene-image"
      src={imageUrl}
      alt={alt}
    />
  );
}
