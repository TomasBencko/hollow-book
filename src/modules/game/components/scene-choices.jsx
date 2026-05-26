import FormattedText from '../../../shared/formatted-text.jsx';

const CHOICE_LETTERS = ['A', 'B', 'C', 'D'];

export default function SceneChoices({ choices, onChoice, disabled, selectedLabel }) {
  if (!choices?.length) return null;

  return (
    <div className="scene-choices" aria-busy={disabled}>
      {choices.map((choice, index) => {
        const isSelected = selectedLabel === choice.label;

        return (
        <button
          key={choice.id}
          type="button"
          className={`btn-choice${isSelected ? ' btn-choice--selected' : ''}`}
          style={{ animationDelay: `${index * 75}ms` }}
          onClick={() => {
            if (disabled) return;
            onChoice(choice.label);
          }}
          disabled={disabled}
          aria-pressed={isSelected}
        >
          <span className="btn-choice-letter">{CHOICE_LETTERS[index] ?? index + 1}</span>
          <FormattedText text={choice.label} inline />
        </button>
        );
      })}
    </div>
  );
}
