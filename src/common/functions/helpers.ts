/**
 * Replaces all undefined values in an object with null.
 * @param obj - The object to transform.
 * @param class - The class constructor to use for creating the object.
 * @template T - The type of the object.
 * @returns The transformed object with undefined values replaced by null.
 */
export function transformUndefinedToNull<T extends Object>(
  obj: Partial<T>,
  targetClass: new () => T,
): T {
  // Create an instance of the target class to get its default structure
  const targetInstance = new targetClass();

  // Iterate over the keys of the target class
  for (const key of Object.keys(targetInstance) as (keyof T)[]) {
    // If the key is missing in the input object, set it to null
    if (!(key in obj)) {
      (obj as T)[key] = null as any;
    }
  }

  return obj as T;
}
