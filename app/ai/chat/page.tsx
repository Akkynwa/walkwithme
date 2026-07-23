'use client';

import SpiritualWalker from '../../../components/ai/SpiritualWalker';
import { useTheme } from '../../context/ThemeContext';

export default function AIChatPage() {
  const { isDark } = useTheme();
  
  return (
    <div className={`transition-colors duration-300 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'
    }`}>
      <SpiritualWalker />
    </div>
  );
}