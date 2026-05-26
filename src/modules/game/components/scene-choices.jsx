export default function SceneChoices({ choices, onChoice, disabled }) {
  if (!choices?.length) return null;

  return (
    <div className="scene-choices">
      {choices.map((choice) => (
        <button
          key={choice.id}
          type="button"
          className="btn btn-choice"
          onClick={() => onChoice(choice.label)}
          disabled={disabled}
        >
          {choice.label}
        </button>
      ))}
    </div>
  );
}
