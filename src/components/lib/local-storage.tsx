export function readLocalStorage<T = unknown>(name: string): T | null {
  try {
    const value = localStorage.getItem(name);
    return value === null ? value : JSON.parse(value);
  } catch (err) {
    return null;
  }
}
export function writeLocalStorage(name: string, value: any): void {
  try {
    localStorage.setItem(name, JSON.stringify(value));
  } catch (err) {}
}
