import { EditorApp } from '../types';
import { getRxJsExample } from './get-rx-js-example';
import { readLocalStorage } from './local-storage';

export function getInitialState(): EditorApp.State {
  return {
    currentRoute: 'editor',
    darkModeEnabled: readLocalStorage<boolean>('darkModeEnabled') || false,
    doc: getRxJsExample(),
  };
}
