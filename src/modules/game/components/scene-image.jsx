export default function SceneImage({ imageUrl, isLoading }) {
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
      alt="Ilustrácia aktuálnej scény"
    />
  );
}
