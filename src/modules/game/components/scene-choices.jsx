import FormattedText from '../../../shared/formatted-text.jsx';

const CHOICE_LETTERS = ['A', 'B', 'C', 'D'];

export default function SceneChoices({ choices, onChoice, disabled }) {
  if (!choices?.length) return null;

  return (
    <div className="scene-choices">
      {choices.map((choice, index) => (
        <button
          key={choice.id}
          type="button"
          className="btn-choice"
          style={{ animationDelay: `${index * 75}ms` }}
          onClick={() => onChoice(choice.label)}
          disabled={disabled}
        >
          <span className="btn-choice-letter">{CHOICE_LETTERS[index] ?? index + 1}</span>
          <FormattedText text={choice.label} inline />
        </button>
      ))}
    </div>
  );
}
