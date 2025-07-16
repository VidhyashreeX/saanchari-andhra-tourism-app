import { Language } from '@shared/types';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const languages = [
    { code: 'en' as Language, label: 'EN' },
    { code: 'hi' as Language, label: 'हिंदी' },
    { code: 'te' as Language, label: 'తెలుగు' },
  ];

  return (
    <div className="flex items-center space-x-2">
      {languages.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => onLanguageChange(code)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
            currentLanguage === code
              ? 'bg-saanchari-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
