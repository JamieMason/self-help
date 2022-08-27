import { render } from 'preact';
import { App } from './components/app';
import './styles/main.css';

render(<App />, document.getElementById('app') as HTMLElement);
