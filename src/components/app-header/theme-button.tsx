import darkModeIcon from '../../img/dark-mode.svg';
import lightModeIcon from '../../img/light-mode.svg';
import { IconButton } from './icon-button';

interface Props {
  darkModeEnabled: boolean;
  toggleDarkModeEnabled: () => void;
}

export function ThemeButton({ darkModeEnabled, toggleDarkModeEnabled }: Props) {
  return (
    <IconButton
      iconSrc={darkModeEnabled ? lightModeIcon : darkModeIcon}
      onClick={toggleDarkModeEnabled}
    />
  );
}
