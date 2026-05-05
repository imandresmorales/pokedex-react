import { typeColors } from '../../utils/typeColors';
import './TypeBadge.css';

export default function TypeBadge({ type }) {
  const colors = typeColors[type] || { bg: '#777', text: '#fff' };

  return (
    <span
      className="type-badge"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {type}
    </span>
  );
}
