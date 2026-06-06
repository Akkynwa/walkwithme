'use client';

import React from 'react';
import { useBibleData } from '@/hooks/useBibleData';

interface Props {
  onVersionChange: (versionId: string) => void;
  selectedLangCode: string;
  onLangChange: (langCode: string) => void;
}

export const BibleSwitcher = ({ onVersionChange, selectedLangCode, onLangChange }: Props) => {
  const { languageOptions } = useBibleData();
  
  const selectedLang = languageOptions.find(l => l.code === selectedLangCode) || languageOptions[0];

  return (
    <div className="flex gap-4">
      {/* Language Dropdown */}
      <select 
        value={selectedLangCode} 
        onChange={(e) => onLangChange(e.target.value)}
        className="bg-white/50 p-2 rounded"
      >
        {languageOptions.map(l => (
          <option key={l.code} value={l.code}>{l.flag} {l.nativeName}</option>
        ))}
      </select>

      {/* Version Dropdown */}
      <select onChange={(e) => onVersionChange(e.target.value)} className="bg-white/50 p-2 rounded">
        {selectedLang?.translations.map(t => (
          <option key={t.id} value={t.id}>{t.abbreviation} - {t.name}</option>
        ))}
      </select>
    </div>
  );
};