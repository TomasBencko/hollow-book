function parseInline(text) {
  const nodes = [];
  let index = 0;
  let key = 0;

  while (index < text.length) {
    if (text.startsWith('**', index)) {
      const end = text.indexOf('**', index + 2);

      if (end !== -1) {
        nodes.push(<strong key={key++}>{text.slice(index + 2, end)}</strong>);
        index = end + 2;
        continue;
      }
    }

    if (text[index] === '*' && text[index + 1] !== '*') {
      const end = text.indexOf('*', index + 1);

      if (end !== -1) {
        nodes.push(<em key={key++}>{text.slice(index + 1, end)}</em>);
        index = end + 1;
        continue;
      }
    }

    const nextBold = text.indexOf('**', index);
    const nextItalic = text.indexOf('*', index);
    let nextSpecial = text.length;

    if (nextBold !== -1) nextSpecial = Math.min(nextSpecial, nextBold);
    if (nextItalic !== -1) nextSpecial = Math.min(nextSpecial, nextItalic);

    if (nextSpecial > index) {
      nodes.push(text.slice(index, nextSpecial));
      index = nextSpecial;
    } else {
      nodes.push(text[index]);
      index += 1;
    }
  }

  return nodes;
}

export default function FormattedText({ text, className = '', inline = false }) {
  if (!text) return null;

  const classNames = ['formatted-text', className].filter(Boolean).join(' ');
  const paragraphs = text.split(/\n\n+/).filter((paragraph) => paragraph.trim());

  if (inline) {
    return <span className={classNames}>{parseInline(text.replace(/\n+/g, ' ').trim())}</span>;
  }

  return (
    <div className={classNames}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{parseInline(paragraph.replace(/\n/g, ' ').trim())}</p>
      ))}
    </div>
  );
}
