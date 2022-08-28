import darkModeIcon from '../img/dark-mode.svg';
import lightModeIcon from '../img/light-mode.svg';

interface Props {
  darkModeEnabled: boolean;
  toggleDarkModeEnabled: () => void;
}

export function ThemeButton({ darkModeEnabled, toggleDarkModeEnabled }: Props) {
  return (
    <button
      className="inline-flex items-center p-2 border border-gray-300 dark:border-slate-600 shadow-sm font-medium rounded-full bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      onClick={toggleDarkModeEnabled}
      type="button"
    >
      <img
        alt=""
        className="inline w-5 h-5"
        src={darkModeEnabled ? lightModeIcon : darkModeIcon}
        width={10}
        height={10}
      />
    </button>
  );
}
