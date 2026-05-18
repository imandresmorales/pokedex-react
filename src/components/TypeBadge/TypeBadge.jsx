import { typeColors, typeTranslationsES } from '../../utils/typeColors';
import { useLanguage } from '../../context/LanguageContext';
import './TypeBadge.css';

export default function TypeBadge({ type }) {
  const { language } = useLanguage();
  const colors = typeColors[type] || { bg: '#777', text: '#fff' };
  
  const displayName = language === 'es' && typeTranslationsES[type] 
    ? typeTranslationsES[type] 
    : type;

  return (
    <span
      className="type-badge"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {displayName}
    </span>
  );
}
