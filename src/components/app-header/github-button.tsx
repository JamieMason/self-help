import githubIcon from '../../img/github.svg';

interface Props {}

export function GitHubButton({}: Props) {
  return (
    <a
      className="inline-flex items-center p-2 border border-slate-600 rounded-full bg-transparent"
      href="https://github.com/JamieMason/self-help"
    >
      <img
        alt="View JamieMason/self-help on GitHub"
        className="inline w-5 h-5"
        src={githubIcon}
        width={10}
        height={10}
      />
    </a>
  );
}
