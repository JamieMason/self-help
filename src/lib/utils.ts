/**
 * Utility functions to replace lodash dependencies
 */

/**
 * Checks if value is classified as a String primitive or object.
 */
export const isString = (value: unknown): value is string => typeof value === 'string';

/**
 * Checks if value is classified as an Array object.
 */
export const isArray = (value: unknown): value is unknown[] => Array.isArray(value);

/**
 * Checks if value is classified as a Function object.
 */
export const isFunction = (value: unknown): value is Function => typeof value === 'function';

/**
 * Gets the value at path of object. If the resolved value is undefined,
 * the defaultValue is returned in its place.
 */
export const get = (object: unknown, path: string | string[], defaultValue?: unknown): unknown => {
  if (object == null) {
    return defaultValue;
  }

  const keys = isArray(path) ? path : path.split('.');
  let result: unknown = object;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }
    result = (result as Record<string, unknown>)[key];
  }

  return result === undefined ? defaultValue : result;
};
