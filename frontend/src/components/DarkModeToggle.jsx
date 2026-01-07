import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-4 py-2 bg-[#fff3d4] text-black rounded-full border border-[#d4af37] hover:bg-[#d4af37] hover:text-black transition"

    >
      {dark ? '☀ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
