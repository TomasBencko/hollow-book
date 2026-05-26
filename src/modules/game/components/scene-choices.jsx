import FormattedText from '../../../shared/formatted-text.jsx';

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
          <FormattedText text={choice.label} inline />
        </button>
      ))}
    </div>
  );
}
